"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  MapPin, 
  Calendar,
  Github, 
  ExternalLink,
  Users,
  GitFork,
  Star,
  Activity,
  Code2,
  GraduationCap,
  Trophy,
  Briefcase,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CandidateProfileDataType } from '@/lib/applicationAnalytics/services';


const CandidateProfile = ({data }:{data: CandidateProfileDataType}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const router = useRouter();

  // data?.github?.topRepositories?.forEach((repo: any) => {
  //   if (repo.primaryLanguage) {
  //     const langName = repo.primaryLanguage.name;

  //     // Initialize or update the language data for the repo's primary language
  //     languageData[langName] = {
  //       count: (languageData[langName]?.count || 0) + 1,
  //       color: repo.primaryLanguage.color || null, // Use null if no color is available
  //     };
  //   }
  // });
  // const totalCountLanguages = Object.values(languageData).reduce(
  //   (sum, langData) => sum + langData.count, 0
  // );
  // const repositories = data?.github?.topRepositories;

  const totalCountLanguages = Object.values(data?.github?.languageData ?? {}).length;
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-gray-100">
                <AvatarImage src={data?.github?.avatarUrl ?? ''} alt={data?.github?.name} />
                <AvatarFallback className="bg-red-500 text-white text-xl font-semibold">{data?.github?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{data?.github?.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{data?.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      Applied
                    </Badge>
                    <span className="text-sm text-gray-500">on {new Date(data?.appliedOn ?? '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="hackathons" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Hackathons
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{data?.firstName + " " + data?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{data?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Education</label>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{data?.institution || "No University"}</p>
                        <p className="text-sm text-gray-600">{data?.fieldOfStudy || "No Major"}, Class of {data?.graduationYear || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profiles & Links */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Profiles & Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={"https://github.com/" + data?.github?.login} className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={data?.portfolioUrl ? data?.portfolioUrl : "#"} className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Portfolio
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={data?.linkedinUrl ? data?.linkedinUrl : "#"} className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Cover Letter */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>0:49 / 0:34</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Button size="sm" variant="outline">
                    <Activity className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Progress value={75} className="h-2" />
                  </div>
                  <span className="text-sm text-gray-500">0:34</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GitHub Tab */}
          <TabsContent value="github" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={data?.github?.avatarUrl ?? ''} alt={data?.github?.login} />
                    <AvatarFallback className="bg-red-500 text-white">{data?.github?.login?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{data?.github?.name}</CardTitle>
                    <p className="text-sm text-gray-600">@{data?.github?.login}</p>
                    {data?.github?.bioHTML && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: data?.github?.bioHTML }}
                      />
                    )}
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{data?.github?.location || "No Location"}</span>
                      {
                        data?.github?.githubCreatedAt && (
                          <>
                            <Calendar className="w-3 h-3 ml-2" />
                            <span>Joined {new Date(data?.github?.githubCreatedAt).toLocaleDateString()}</span>
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* GitHub Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data?.github?.repositoriesCount}</div>
                    <div className="text-sm text-gray-600">Repositories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data?.github?.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data?.github?.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data?.github?.totalContributions || 0}</div>
                    <div className="text-sm text-gray-600">Contributions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{data?.github?.longestStreak}</div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                  </div>
                </div>

                <Separator />

                {/* Languages & Technologies */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    Languages & Technologies
                  </h3>
                  <div className="space-y-3">
                    {
                      Object.entries(data?.github?.languageData || {}).map(([langName, langData]) => (
                        <div key={langName} className="flex items-center gap-3">
                          <div className="w-24 text-sm font-medium text-gray-700">
                            {langName}
                          </div>
                          <div className="flex-1">
                           <Progress
                              value={Math.round((langData.count / totalCountLanguages) * 100)}
                              max={100}
                              className="h-2"
                              style={{ '--progress-color': langData.color ?? '' }}
                              indicatorColor="bg-[var(--progress-color)]"
                            />   
                          </div>
                          <div className={`w-12 text-sm text-right`}>
                            {Math.round((langData.count / totalCountLanguages) * 100)}%
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <Separator />

                {/* Contribution Activity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Contribution Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Most Active Day</div>
                      <div className="font-semibold">{data?.github?.contributionStats?.mostActiveDay}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Weekly Average</div>
                      <div className="font-semibold">{data?.github?.contributionStats?.weeklyAverage} contributions</div>
                    </div>
                  </div>
                  
                  {/* Activity Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{data?.github?.contributionStats?.contributionsPerDay}</div>
                      <div className="text-sm text-gray-600">Contributions / Day</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{data?.github?.contributionStats?.activeDaysPerWeek}</div>
                      <div className="text-sm text-gray-600">Active Days / Week</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{data?.github?.contributionStats?.currentStreak}</div>
                      <div className="text-sm text-gray-600">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{data?.github?.contributionStats?.pullRequests}</div>
                      <div className="text-sm text-gray-600">Pull Requests</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Top Repositories */}
                <div className="space-y-4">
                  {data?.github?.repositories?.sort((a, b) => b.stargazerCount - a.stargazerCount).slice(0, 3).map((repo, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6 pl-16">
                        {/* Repository Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <a
                                href={repo.url ?? ''}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors group-hover:text-blue-600"
                              >
                                {repo.name}
                              </a>
                              <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">{repo.description}</p>
                          </div>
                        </div>

                        {/* Repository Stats */}
                        <div className="flex flex-wrap items-center gap-6 mb-4 text-sm">
                          {repo.primaryLanguage && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: repo.primaryLanguage.color ??''}}
                              />
                              <span className="text-gray-700 font-medium">{repo.primaryLanguage.name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1.5 text-gray-600 hover:text-yellow-600 transition-colors">
                            <Star className="w-4 h-4" />
                            <span className="font-semibold">{repo.stargazerCount}</span>
                            <span className="text-xs">stars</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
                            <GitFork className="w-4 h-4" />
                            <span className="font-semibold">{repo.forkCount}</span>
                            <span className="text-xs">forks</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs">Created {new Date(repo.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Additional Languages */}
                        {repo.languages?.edges?.length > 1 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Languages:</span>
                              {repo.languages.edges.slice(0, 4).map(({ node }, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-xs text-gray-700 border"
                                >
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: node.color ??''}}
                                  />
                                  {node.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {repo.repositoryTopics?.nodes?.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Topics:</span>
                            {repo.repositoryTopics.nodes.map((topicNode, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                              >
                                {topicNode.topic.name}
                              </span>
                            ))}
                            
                          </div>
                        )}
                      </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Hackathons
                </CardTitle>
                <CardDescription>
                  Competitive programming and hackathon participation history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hackathon data available</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className='flex justify-between'>
              <Button
                onClick={() => router.back()}
                className="whitespace-nowrap"
              >
                ← Back to Applications
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-100 focus:ring-red-500"
                >
                  Reject
                </Button>

                <Button
                  variant="outline"
                  aria-label="Move application to interview"
                  className="text-green-600 border-green-600 hover:bg-green-100 focus:ring-green-500"
                >
                  Move to Interview
                </Button>
              </div>
            </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateProfile;