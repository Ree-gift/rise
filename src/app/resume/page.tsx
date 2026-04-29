'use client';

import { useState, useCallback } from 'react';
import { FileText, Upload, X, CheckCircle, AlertTriangle, Info, ArrowUp, ArrowDown, Download, Database, RefreshCw } from 'lucide-react';
import { extractTextFromFile, analyzeCV, CVAnalysis } from '@/lib/cv-analyzer';
import { getSupabase } from '@/lib/supabase';

const gradeColors: Record<string, string> = {
  A: 'from-green-500 to-emerald-600',
  'B+': 'from-lime-500 to-green-600',
  B: 'from-blue-500 to-cyan-600',
  'C+': 'from-yellow-500 to-orange-600',
  C: 'from-orange-500 to-amber-600',
  D: 'from-red-500 to-pink-600',
  F: 'from-red-600 to-red-800',
};

const gradeDescriptions: Record<string, string> = {
  A: 'Excellent! Your CV is well-crafted and ATS-friendly.',
  'B+': 'Great CV! A few tweaks could make it outstanding.',
  B: 'Good CV! Focus on the suggestions below to improve.',
  'C+': 'Decent start, but needs significant improvements.',
  C: 'Below average. Major revisions recommended.',
  D: 'Needs a lot of work. Follow the suggestions carefully.',
  F: 'Critical issues found. Consider a major overhaul.',
};

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  }, []);

  const processFile = async (selectedFile: File) => {
    const validTypes = ['text/plain', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(txt|pdf)$/i)) {
      setError('Please upload a .txt or .pdf file');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }
    setFile(selectedFile);
    setError('');
    setAnalysis(null);

    try {
      setIsAnalyzing(true);
      const extractedText = await extractTextFromFile(selectedFile);
      setText(extractedText);
      const result = analyzeCV(extractedText);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze CV');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!analysis || !file) return;
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }
    try {
      setUploadStatus('uploading');
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('cv_analyses')
        .insert({
          file_name: file.name,
          score: analysis.score,
          max_score: analysis.maxScore,
          grade: analysis.grade,
          word_count: analysis.stats.wordCount,
          suggestions: JSON.stringify(analysis.suggestions),
          analysis: JSON.stringify(analysis),
          created_at: new Date().toISOString(),
        });
      if (dbError) throw dbError;
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setUploadStatus('error');
    }
  };

  const handleReset = () => {
    setFile(null);
    setText('');
    setAnalysis(null);
    setError('');
    setUploadStatus('idle');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer</h1>
        <p className="mt-1 text-gray-600">Upload your CV to get a score and personalized improvement suggestions</p>
      </div>

      {!file ? (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white hover:border-primary-400'
          }`}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your CV</h3>
          <p className="text-gray-500 mb-6">Drag and drop your file here, or click to browse</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer font-medium">
            <FileText className="h-5 w-5" />
            Choose File
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="mt-4 text-sm text-gray-400">Supports .txt and .pdf files (max 5MB)</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToSupabase}
                disabled={uploadStatus === 'uploading' || !analysis}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {uploadStatus === 'idle' && <><Database className="h-4 w-4" /> Save to Cloud</>}
                {uploadStatus === 'uploading' && 'Saving...'}
                {uploadStatus === 'success' && <><CheckCircle className="h-4 w-4" /> Saved!</>}
                {uploadStatus === 'error' && <><AlertTriangle className="h-4 w-4" /> Error</>}
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <RefreshCw className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Analyzing your CV...</p>
            </div>
          )}

          {analysis && (
            <>
              <div className={`bg-gradient-to-r ${gradeColors[analysis.grade]} rounded-2xl p-8 text-white text-center`}>
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 mb-4">
                  <span className="text-4xl font-bold">{analysis.grade}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Score: {analysis.score.toFixed(1)} / {analysis.maxScore} ({Math.round((analysis.score / analysis.maxScore) * 100)}%)
                </h2>
                <p className="text-white/80">{gradeDescriptions[analysis.grade]}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Word Count', value: analysis.stats.wordCount.toString() },
                  { label: 'Reading Time', value: analysis.stats.estimatedReadingTime },
                  { label: 'Action Verbs', value: analysis.stats.actionVerbsFound.toString() },
                  { label: 'Metrics Found', value: analysis.stats.metricsFound.toString() },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Breakdown</h3>
                <div className="space-y-4">
                  {analysis.sections.map((section, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-40 shrink-0">
                        <p className="text-sm font-medium text-gray-900">{section.name}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              section.passed ? 'bg-green-500' : section.score > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.round((section.score / section.maxScore) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span className={`text-sm font-medium ${
                          section.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {section.passed ? <CheckCircle className="h-4 w-4 inline" /> : <X className="h-4 w-4 inline" />}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">{analysis.sections.map(s => s.details).join(' | ')}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, i) => {
                    const icons = {
                      critical: <AlertTriangle className="h-5 w-5 text-red-600" />,
                      important: <Info className="h-5 w-5 text-yellow-600" />,
                      'nice-to-have': <Info className="h-5 w-5 text-blue-600" />,
                    };
                    const bgColors = {
                      critical: 'border-red-200 bg-red-50',
                      important: 'border-yellow-200 bg-yellow-50',
                      'nice-to-have': 'border-blue-200 bg-blue-50',
                    };
                    const badgeColors = {
                      critical: 'bg-red-100 text-red-700',
                      important: 'bg-yellow-100 text-yellow-700',
                      'nice-to-have': 'bg-blue-100 text-blue-700',
                    };
                    return (
                      <div key={i} className={`p-4 rounded-lg border ${bgColors[suggestion.category]}`}>
                        <div className="flex items-start gap-3">
                          {icons[suggestion.category]}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${badgeColors[suggestion.category]}`}>
                                {suggestion.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
