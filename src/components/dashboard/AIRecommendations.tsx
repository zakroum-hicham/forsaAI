'use client';

import { 
  Brain, 
  User, 
  Briefcase, 
  Zap, 
  Lightbulb,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { AIRecommendationsProps, AIRecommendation } from '@/types/dashboard';

/**
 * Individual recommendation card component
 */
interface RecommendationCardProps {
  recommendation: AIRecommendation;
  index: number;
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const getIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'candidate':
        return <User className="h-5 w-5" />;
      case 'job':
        return <Briefcase className="h-5 w-5" />;
      case 'action':
        return <Zap className="h-5 w-5" />;
      case 'insight':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          text: 'text-yellow-800 dark:text-yellow-200',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400'
        };
      case 'low':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-800 dark:text-blue-200',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const priorityConfig = getPriorityColor(recommendation.priority);
  const typeLabels = {
    candidate: 'Candidate',
    job: 'Job',
    action: 'Action',
    insight: 'Insight'
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md cursor-pointer group ${priorityConfig.border}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with icon and priority */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${priorityConfig.bg}`}>
                <div className={priorityConfig.icon}>
                  {getIcon(recommendation.type)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[recommendation.type]}
                  </Badge>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${priorityConfig.bg} ${priorityConfig.text} border-none`}
                  >
                    {recommendation.priority.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {recommendation.title}
                </h3>
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {recommendation.description}
          </p>

          {/* Action button */}
          {recommendation.actionLabel && (
            <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto">
              <span className="text-sm">{recommendation.actionLabel}</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * AI Score component showing overall AI insights performance
 */
function AIScoreCard() {
  const aiScore = 87; // This would come from your AI analytics
  const insights = [
    { label: 'Candidates Matched', value: '23', trend: 'up' },
    { label: 'Time Saved', value: '4.2h', trend: 'up' },
    { label: 'Success Rate', value: '92%', trend: 'up' },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-500 rounded-md">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-gray-900 dark:text-white">
              AI Performance
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your AI assistant is performing excellently
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {aiScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            AI Effectiveness Score
          </div>
          <Progress value={aiScore} className="w-full h-2" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {insights.map((insight, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {insight.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {insight.label}
              </div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Quick Actions component
 */
function QuickActionsCard() {
  const actions = [
    {
      label: 'Review Top Candidates',
      description: '5 high-match candidates need review',
      icon: <User className="h-4 w-4" />,
      urgent: true,
    },
    {
      label: 'Schedule Interviews',
      description: '3 interviews pending scheduling',
      icon: <Clock className="h-4 w-4" />,
      urgent: false,
    },
    {
      label: 'Update Job Requirements',
      description: '2 jobs have outdated requirements',
      icon: <Briefcase className="h-4 w-4" />,
      urgent: false,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${action.urgent 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {action.urgent && <AlertTriangle className="h-4 w-4" />}
                {!action.urgent && action.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Main AIRecommendations component
 */
export default function AIRecommendations({ recommendations, loading }: AIRecommendationsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort recommendations by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      {/* AI Performance Score */}
      <AIScoreCard />

      {/* Main Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-500" />
                AI Recommendations
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Personalized insights to optimize your recruitment
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {recommendations.length} insights
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Recommendations Yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI insights will appear here as you add more jobs and candidates.
              </p>
            </div>
          ) : (
            sortedRecommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                index={index}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActionsCard />

      {/* AI Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500 rounded-md mt-1">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                💡 Pro Tip
              </h4>
              <p className="text-sm text-green-700 dark:text-green-200">
                The AI learns from your hiring decisions. Mark candidates as &quot;hired&quot; or &quot;rejected&quot; 
                to improve future recommendations and matching accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}