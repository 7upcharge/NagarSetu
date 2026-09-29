'use client';

import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { Category } from '../../types';
import { IssueCard } from '../../components/IssueCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Garbage',
  'Roads',
  'Water',
  'Streetlights',
  'Drainage',
  'Safety',
  'Public Property'
];

export default function IssuesPage() {
  const {
    issues,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useCivic();

  // Filter issues
  const filtered = issues.filter((issue) => {
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      issue.title.toLowerCase().includes(q) ||
      issue.location.toLowerCase().includes(q) ||
      issue.description.toLowerCase().includes(q) ||
      issue.keywords.some((k) => k.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  // Sort issues
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
    if (sortBy === 'affected') return b.peopleAffected - a.peopleAffected;
    if (sortBy === 'supported') return b.communityReports - a.communityReports;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'resolved') {
      const aResolved = a.status === 'resolved' || a.status === 'community_verified' ? 1 : 0;
      const bResolved = b.status === 'resolved' || b.status === 'community_verified' ? 1 : 0;
      return bResolved - aResolved;
    }
    return b.priorityScore - a.priorityScore;
  });

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div className="border-b border-stone-200 pb-5 space-y-2">
        <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          Civic Directory
        </span>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          Community Issues
        </h1>
        <p className="text-sm text-stone-600">
          Explore and support active neighborhood complaints aggregated into collective civic signals.
        </p>
      </div>

      {/* Search & Sort Toolbar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, location, or title..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
            <span className="text-xs font-medium text-stone-600 font-mono">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="priority">Priority (Highest first)</option>
              <option value="affected">Most Affected</option>
              <option value="supported">Most Supported</option>
              <option value="newest">Recently Reported</option>
              <option value="resolved">Recently Resolved</option>
            </select>
          </div>
        </div>

        {/* Category Filters Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-amber-400 font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-stone-600 font-mono">
        <span>Showing {sorted.length} civic issues</span>
        {selectedCategory !== 'All' && <span>Filtered by: {selectedCategory}</span>}
      </div>

      {/* Issue Cards Grid */}
      {sorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((issue, index) => (
            <IssueCard key={issue.id} issue={issue} rankIndex={sortBy === 'priority' ? index : undefined} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl p-12 text-center space-y-3">
          <p className="text-stone-700 font-medium text-base">No issues match your current filters.</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try resetting your search query or selecting "All" categories to view all active community reports.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-stone-900 text-amber-400 text-xs font-semibold rounded"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
