export interface CVAnalysis {
  score: number;
  maxScore: number;
  grade: string;
  sections: CVSectionResult[];
  suggestions: CVSuggestion[];
  stats: CVStats;
}

export interface CVSectionResult {
  name: string;
  score: number;
  maxScore: number;
  passed: boolean;
  details: string;
}

export interface CVSuggestion {
  category: 'critical' | 'important' | 'nice-to-have';
  title: string;
  description: string;
}

export interface CVStats {
  wordCount: number;
  characterCount: number;
  estimatedReadingTime: string;
  actionVerbsFound: number;
  metricsFound: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  sectionsFound: string[];
}

const actionVerbs = [
  'achieved', 'administered', 'advised', 'analyzed', 'assessed', 'assembled',
  'built', 'calculated', 'coached', 'collaborated', 'communicated', 'compiled',
  'conceived', 'conducted', 'consolidated', 'constructed', 'consulted',
  'coordinated', 'created', 'cultivated', 'delivered', 'designed', 'developed',
  'devised', 'diagnosed', 'directed', 'documented', 'drove', 'edited',
  'eliminated', 'enhanced', 'engineered', 'established', 'evaluated',
  'executed', 'expanded', 'expedited', 'facilitated', 'formulated', 'founded',
  'generated', 'grew', 'guided', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'inspected', 'instituted', 'integrated',
  'interpreted', 'introduced', 'launched', 'led', 'managed', 'mentored',
  'modernized', 'motivated', 'negotiated', 'operated', 'optimized',
  'orchestrated', 'organized', 'originated', 'oversaw', 'pioneered', 'planned',
  'prepared', 'presented', 'prevented', 'produced', 'programmed', 'promoted',
  'proposed', 'provided', 'reduced', 'reengineered', 'refined', 'reorganized',
  'replaced', 'restructured', 'resolved', 'restructured', 'revamped',
  'revitalized', 'scheduled', 'solved', 'spearheaded', 'streamlined',
  'strengthened', 'structured', 'supervised', 'surpassed', 'sustained',
  'systematized', 'targeted', 'tested', 'trained', 'transformed', 'translated',
  'troubleshooted', 'tutored', 'updated', 'utilized', 'validated', 'verified',
  'wrote',
];

const expectedSections = [
  'summary', 'objective', 'experience', 'work', 'employment', 'career',
  'education', 'skills', 'technical', 'certification', 'award', 'honor',
  'project', 'portfolio', 'languages', 'volunteer',
];

const sectionKeywords: Record<string, string[]> = {
  'Contact Info': ['email', '@', 'phone', 'linkedin', 'github', 'portfolio', 'tel:', 'http'],
  'Summary/Objective': ['summary', 'objective', 'profile', 'about me', 'career objective', 'professional summary'],
  'Work Experience': ['experience', 'employment', 'work history', 'career', 'professional experience', 'work'],
  'Education': ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma', 'gpa'],
  'Skills': ['skills', 'technical', 'proficient', 'expertise', 'competencies', 'technologies'],
  'Projects': ['project', 'projects', 'portfolio', 'personal project'],
  'Certifications': ['certification', 'certifications', 'license', 'licensed', 'certificate'],
  'Awards': ['award', 'awards', 'honor', 'honors', 'recognition', 'achievement'],
};

export function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      reader.onload = async () => {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
          const pdf = await pdfjsLib.getDocument({ data: reader.result as ArrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(' ') + '\n';
          }
          resolve(text);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Unsupported file type. Please upload .txt or .pdf files.'));
    }
  });
}

export function analyzeCV(text: string): CVAnalysis {
  const normalizedText = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const characterCount = text.length;

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(normalizedText);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[\w-]+/i.test(text);

  const actionVerbsFound = actionVerbs.filter(verb => normalizedText.includes(verb)).length;
  const metricsRegex = /\d+%|\$[\d,.]+|\d+[\s]?[xX]|\b\d{2,}\b/g;
  const metricsFound = (text.match(metricsRegex) || []).length;

  const sectionsFound = expectedSections.filter(section => normalizedText.includes(section));

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const estimatedReadingTime = readingTimeMinutes <= 1 ? '< 1 min' : `~${readingTimeMinutes} min`;

  const sections: CVSectionResult[] = [];
  const suggestions: CVSuggestion[] = [];

  const contactScore = (hasEmail ? 2 : 0) + (hasPhone ? 1.5 : 0) + (hasLinkedIn ? 1.5 : 0);
  const contactMax = 5;
  sections.push({
    name: 'Contact Information',
    score: contactScore,
    maxScore: contactMax,
    passed: contactScore >= 3.5,
    details: `Email: ${hasEmail ? '✓' : '✗'} | Phone: ${hasPhone ? '✓' : '✗'} | LinkedIn: ${hasLinkedIn ? '✓' : '✗'}`,
  });
  if (!hasEmail) suggestions.push({ category: 'critical', title: 'Add your email address', description: 'Employers need a way to contact you. Include a professional email address at the top of your CV.' });
  if (!hasPhone) suggestions.push({ category: 'important', title: 'Add your phone number', description: 'Many recruiters prefer phone contact. Include your phone number in the header.' });
  if (!hasLinkedIn) suggestions.push({ category: 'nice-to-have', title: 'Add LinkedIn profile', description: 'A LinkedIn URL gives employers a way to verify your background and see recommendations.' });

  const hasSummary = sectionsFound.some(s => ['summary', 'objective', 'profile'].includes(s));
  const summaryScore = hasSummary ? 2 : 0;
  const summaryMax = 2;
  sections.push({
    name: 'Professional Summary',
    score: summaryScore,
    maxScore: summaryMax,
    passed: hasSummary,
    details: hasSummary ? 'Summary/Objective section found' : 'No summary or objective section detected',
  });
  if (!hasSummary) suggestions.push({ category: 'critical', title: 'Add a professional summary', description: 'A 2-3 sentence summary at the top tells employers who you are and what you offer. Include your key skills and career goal.' });

  const hasExperience = sectionsFound.some(s => ['experience', 'employment', 'work', 'career'].includes(s));
  const experienceScore = hasExperience ? 3 : 0;
  const experienceMax = 3;
  sections.push({
    name: 'Work Experience',
    score: experienceScore,
    maxScore: experienceMax,
    passed: hasExperience,
    details: hasExperience ? 'Work experience section found' : 'No work experience section detected',
  });
  if (!hasExperience) suggestions.push({ category: 'critical', title: 'Add work experience section', description: 'List your relevant work history in reverse chronological order. Include company, title, dates, and bullet points describing your achievements.' });

  const hasEducation = sectionsFound.some(s => ['education', 'degree', 'university', 'college', 'bachelor', 'master'].includes(s));
  const educationScore = hasEducation ? 2 : 0;
  const educationMax = 2;
  sections.push({
    name: 'Education',
    score: educationScore,
    maxScore: educationMax,
    passed: hasEducation,
    details: hasEducation ? 'Education section found' : 'No education section detected',
  });
  if (!hasEducation) suggestions.push({ category: 'critical', title: 'Add education section', description: 'Include your degree(s), institution(s), and graduation year(s). Relevant coursework or honors are a bonus.' });

  const hasSkills = sectionsFound.some(s => ['skills', 'technical', 'proficient', 'expertise'].includes(s));
  const skillsScore = hasSkills ? 3 : 0;
  const skillsMax = 3;
  sections.push({
    name: 'Skills',
    score: skillsScore,
    maxScore: skillsMax,
    passed: hasSkills,
    details: hasSkills ? 'Skills section found' : 'No skills section detected',
  });
  if (!hasSkills) suggestions.push({ category: 'critical', title: 'Add a skills section', description: 'List your hard and soft skills. Group them by category (e.g., Programming Languages, Tools, Soft Skills) for readability.' });

  const hasProjects = sectionsFound.some(s => ['project', 'portfolio'].includes(s));
  const projectsScore = hasProjects ? 1.5 : 0;
  const projectsMax = 1.5;
  sections.push({
    name: 'Projects',
    score: projectsScore,
    maxScore: projectsMax,
    passed: hasProjects,
    details: hasProjects ? 'Projects section found' : 'No projects section detected',
  });

  const hasCertifications = sectionsFound.some(s => ['certification', 'certificate', 'license'].includes(s));
  const certsScore = hasCertifications ? 1 : 0;
  const certsMax = 1;
  sections.push({
    name: 'Certifications & Awards',
    score: certsScore,
    maxScore: certsMax,
    passed: hasCertifications,
    details: hasCertifications ? 'Certifications or awards found' : 'No certifications or awards detected',
  });

  const lengthScore = (() => {
    if (wordCount >= 300 && wordCount <= 1000) return 2;
    if (wordCount >= 150 && wordCount < 300) return 1;
    if (wordCount > 1000) return 1;
    return 0;
  })();
  const lengthMax = 2;
  sections.push({
    name: 'Length & Depth',
    score: lengthScore,
    maxScore: lengthMax,
    passed: lengthScore >= 1,
    details: wordCount < 300 ? `Too short (${wordCount} words). Aim for 300-600 for entry-level, 600-1000 for experienced.` : wordCount > 1000 ? `Very long (${wordCount} words). Keep it concise: 1-2 pages ideal.` : `Good length (${wordCount} words)`,
  });
  if (wordCount < 300) suggestions.push({ category: 'important', title: 'Expand your CV content', description: `Your CV has ${wordCount} words. Add more detail about your experiences, projects, and skills to reach at least 300 words.` });
  if (wordCount > 1000) suggestions.push({ category: 'nice-to-have', title: 'Consider condensing your CV', description: 'Most recruiters spend 6-8 seconds scanning a CV. Prioritize the most relevant information.' });

  const actionVerbScore = actionVerbsFound >= 5 ? 2 : actionVerbsFound >= 3 ? 1.5 : actionVerbsFound >= 1 ? 1 : 0;
  const actionVerbMax = 2;
  sections.push({
    name: 'Action Verbs',
    score: actionVerbScore,
    maxScore: actionVerbMax,
    passed: actionVerbsFound >= 3,
    details: `${actionVerbsFound} action verbs found (target: 5+). Examples: achieved, developed, led, managed.`,
  });
  if (actionVerbsFound < 3) suggestions.push({ category: "important", title: "Use more action verbs", description: "Use action verbs like Developed, Increased, Managed, Implemented instead of responsible for." });

  const metricsScore = metricsFound >= 5 ? 2 : metricsFound >= 3 ? 1.5 : metricsFound >= 1 ? 1 : 0;
  const metricsMax = 2;
  sections.push({
    name: 'Quantifiable Metrics',
    score: metricsScore,
    maxScore: metricsMax,
    passed: metricsFound >= 3,
    details: `${metricsFound} metrics/numbers found. Include percentages, revenue figures, team sizes, etc.`,
  });
  if (metricsFound < 3) suggestions.push({ category: "important", title: "Add quantifiable achievements", description: "Use numbers to show impact like 25 percent increase instead of improved. Include metrics in your bullet points." });

  const totalScore = sections.reduce((sum, s) => sum + s.score, 0);
  const maxScore = sections.reduce((sum, s) => sum + s.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  let grade: string;
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B+';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C+';
  else if (percentage >= 50) grade = 'C';
  else if (percentage >= 40) grade = 'D';
  else grade = 'F';

  if (sectionsFound.length < 4) {
    suggestions.push({ category: 'important', title: 'Use clear section headings', description: 'Make sure your sections are clearly labeled with standard headings like "Work Experience," "Education," "Skills" so recruiters and ATS can easily parse your CV.' });
  }

  suggestions.sort((a, b) => {
    const order = { critical: 0, important: 1, 'nice-to-have': 2 };
    return order[a.category] - order[b.category];
  });

  return {
    score: totalScore,
    maxScore,
    grade,
    sections,
    suggestions,
    stats: {
      wordCount,
      characterCount,
      estimatedReadingTime,
      actionVerbsFound,
      metricsFound,
      hasEmail,
      hasPhone,
      hasLinkedIn,
      sectionsFound,
    },
  };
}
