'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {  Users, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { PipelineFunnelProps } from '@/types/dashboard';

/**
 * Custom tooltip for the pipeline chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    payload: {
      stage: string;
      count: number;
      color: string;
      percentage: number;
      dropoffRate?: number;
    };
    value: number;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900 dark:text-white">{data.stage}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Candidates: <span className="font-medium">{data.count}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
        </p>
        {data.dropoffRate !== undefined && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Drop-off: <span className="font-medium">{data.dropoffRate.toFixed(1)}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
}

/**
 * Pipeline stage card component
 */
interface StageCardProps {
  stage: {
    stage: string;
    count: number;
    color: string;
    percentage: number;
    dropoffRate?: number;
  };
  index: number;
  totalStages: number;
}

function StageCard({ stage, index, totalStages }: StageCardProps) {
  const isFirst = index === 0;
  const isLast = index === totalStages - 1;

  return (
    <div className="flex items-center space-x-4">
      {/* Stage Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-w-[140px] text-center">
        <div 
          className="w-3 h-3 rounded-full mx-auto mb-2"
          style={{ backgroundColor: stage.color }}
        />
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {stage.stage}
        </h4>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {stage.count}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {stage.percentage.toFixed(1)}%
        </div>
        {stage.dropoffRate !== undefined && stage.dropoffRate > 0 && !isLast && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
              -{stage.dropoffRate.toFixed(1)}%
            </Badge>
          </div>
        )}
      </div>

      {/* Arrow */}
      {!isLast && (
        <div className="flex flex-col items-center text-gray-400 dark:text-gray-600">
          <TrendingDown className="h-5 w-5" />
          {stage.dropoffRate !== undefined && (
            <span className="text-xs mt-1">
              -{stage.dropoffRate.toFixed(0)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Main PipelineFunnel component
 */
export default function PipelineFunnel({ 
  pipeline, 
  availableJobs, 
  loading 
}: PipelineFunnelProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');
  const [selectedJobId, setSelectedJobId] = useState<string>(pipeline?.[0]?.jobId || '');
  const selectedJob = pipeline?.find(job => job.jobId === selectedJobId);
  console.log('Selected Job:', selectedJob);
  console.log('Pipeline Data:', pipeline);
  // Calculate enhanced pipeline data with drop-off rates and percentages
  const enhancedPipelineData = selectedJob?.stages.map((stage, index) => {
    const percentage = selectedJob.totalCandidates > 0 
      ? (stage.count / selectedJob.totalCandidates) * 100 
      : 0;
    
    let dropoffRate = 0;
    if (index > 0) {
      const previousStage = selectedJob.stages[index - 1];
      dropoffRate = previousStage.count > 0 
        ? ((previousStage.count - stage.count) / previousStage.count) * 100 
        : 0;
    }

    return {
      ...stage,
      percentage,
      dropoffRate: index > 0 ? dropoffRate : undefined,
    };
  }) || [];

  // Identify bottlenecks (stages with high drop-off rates)
  const bottlenecks = enhancedPipelineData
    .filter(stage => stage.dropoffRate !== undefined && stage.dropoffRate > 50)
    .map(stage => stage.stage);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Recruitment Pipeline
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Candidate flow through hiring stages
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Job Selector */}
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {availableJobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
                className="text-xs px-3 py-1"
              >
                Chart
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="text-xs px-3 py-1"
              >
                Cards
              </Button>
            </div>
          </div>
        </div>

        {/* Pipeline Summary */}
        {pipeline && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedJob?.totalCandidates} Total Candidates
                </span>
              </div>
              {bottlenecks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-600 dark:text-red-400">
                    Bottleneck at: {bottlenecks.join(', ')}
                  </span>
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {selectedJob?.jobTitle}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!pipeline ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Pipeline Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select a job to view its recruitment pipeline
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {viewMode === 'chart' ? (
              // Chart View
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enhancedPipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="stage" 
                      tick={{ fontSize: 12 }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {enhancedPipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              // Cards View
              <div className="overflow-x-auto">
                <div className="flex items-center justify-start space-x-2 min-w-max px-4">
                  {enhancedPipelineData.map((stage, index) => (
                    <StageCard
                      key={stage.stage}
                      stage={stage}
                      index={index}
                      totalStages={enhancedPipelineData.length}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pipeline Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Pipeline Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Conversion Rate:
                  </span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {selectedJob?.stages.length > 1 && selectedJob?.stages[0].count > 0
                      ? ((selectedJob?.stages[selectedJob?.stages.length - 1].count / selectedJob?.stages[0].count) * 100).toFixed(1)
                      : 0}%
                    of candidates reach final stage
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Biggest Drop:
                  </span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {/* check if enhancedPipelineData.stage && (fixes the problem)  */}
                    {enhancedPipelineData.stage && enhancedPipelineData?.reduce((max, stage) => 
                      (stage.dropoffRate || 0) > (max.dropoffRate || 0) ? stage : max, 
                      enhancedPipelineData[0]
                    ).stage} stage
                  </p>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Recommendation:
                  </span>
                  <p className="text-blue-800 dark:text-blue-200">
                    {bottlenecks.length > 0 
                      ? `Focus on improving ${bottlenecks[0]} process`
                      : 'Pipeline is performing well'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}