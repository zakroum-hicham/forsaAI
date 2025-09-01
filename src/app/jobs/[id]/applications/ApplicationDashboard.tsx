"use client";
import React, { useState } from 'react';
import { Users, GitBranch, Award, TrendingUp, Calendar, Code } from 'lucide-react';
import Overview from '@/components/analytics/Overview';
import Candidates from '@/components/analytics/Candidates';
import GitHub from '@/components/analytics/Github';
import Header from '@/components/analytics/Header';
import { CandidateAnalyticsData, HeaderAnalyticsData } from '@/lib/applicationAnalytics/services';

const ApplicantAnalyticsDashboard = ({ headerData , candidateData,topCandidates }: { headerData: HeaderAnalyticsData; candidateData: CandidateAnalyticsData[]; topCandidates: CandidateAnalyticsData[]; }) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'github', label: 'GitHub', icon: GitBranch },
    { id: 'hackathons', label: 'Hackathons', icon: Award },
    { id: 'education', label: 'Education', icon: Code },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header headerData={headerData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex overflow-x-auto space-x-4 sm:space-x-6 lg:space-x-8 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {selectedTab === 'overview' && <Overview topCandidates={topCandidates} />}
          {selectedTab === 'candidates' && <Candidates candidateData={candidateData} />}
          {selectedTab === 'github' && <GitHub />}
          {/* Add future tab content as needed */}
        </div>
      </div>
    </div>
  );
};

export default ApplicantAnalyticsDashboard;
