'use client';

import { useState } from 'react';
import { getCommunityPosts } from '@/lib/data';
import { CommunityPost } from '@/types';
import { Users, MessageSquare, ArrowUp, Filter, Plus, Search } from 'lucide-react';

const categories = [
  { key: 'all', label: 'All Posts' },
  { key: 'celebration', label: '🎉 Celebrations' },
  { key: 'advice', label: '💡 Advice' },
  { key: 'question', label: '❓ Questions' },
  { key: 'vent', label: '🫂 Vent' },
];

export default function CommunityPage() {
  const posts = getCommunityPosts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Support</h1>
          <p className="mt-1 text-gray-600">Youre not alone in this journey. Share, connect, and grow together.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Community Guidelines</h3>
            <ul className="mt-2 space-y-1 text-sm text-green-700">
              <li>Be supportive and respectful of everyones journey</li>
              <li>Share constructive advice, not just criticism</li>
              <li>Celebrate wins together - every offer counts!</li>
              <li>Your vulnerability helps others feel less alone</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const [upvoted, setUpvoted] = useState(false);

  const categoryColors: Record<string, string> = {
    celebration: 'bg-green-100 text-green-700',
    advice: 'bg-blue-100 text-blue-700',
    question: 'bg-purple-100 text-purple-700',
    vent: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setUpvoted(!upvoted)}
            className={`p-2 rounded-lg transition-colors ${
              upvoted ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <ArrowUp className="h-5 w-5" />
          </button>
          <span className={`text-sm font-medium ${upvoted ? 'text-primary-600' : 'text-gray-600'}`}>
            {post.upvotes + (upvoted ? 1 : 0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{post.author}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${categoryColors[post.category]}`}>
              {post.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
          
          <div className="flex items-center gap-4 mt-4">
            <button className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <MessageSquare className="h-4 w-4" />
              {post.replies} replies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
