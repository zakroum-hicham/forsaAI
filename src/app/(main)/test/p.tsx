"use client"
import { useState, useEffect } from 'react';

interface GitHubUserData {
  name: string;
  login: string;
  avatarUrl: string;
  bio: string;
  repositories: {
    totalCount: number;
  };
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  url: string;
  createdAt: string;
  contributionsCollection: {
    totalCommitContributions: number;
    restrictedContributionsCount: number;
    totalRepositoriesWithContributedCommits: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: {
        contributionDays: {
          contributionCount: number;
          date: string;
        }[];
      }[];
    };
  };
  topRepositories: {
    nodes: {
      name: string;
      url: string;
      description: string;
      stargazerCount: number;
      forkCount: number;
      primaryLanguage: {
        name: string;
        color: string;
      } | null;
      updatedAt: string;
    }[];
  };
  repositoriesContributedTo: {
    totalCount: number;
  };
  starredRepositories: {
    totalCount: number;
  };
}

interface LanguageStats {
  [language: string]: {
    count: number;
    color: string;
  };
}

interface StreakInfo {
  current: number;
  longest: number;
}

const GitHubGraphQLDashboard = ({session}) => {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [topLanguages, setTopLanguages] = useState<LanguageStats>({});
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // GraphQL query to fetch all required data
        const query = `
          query getUserData($login: String!) {
            user(login: $login) {
              name
              login
              avatarUrl
              bio
              repositories(ownerAffiliations: OWNER, privacy: PUBLIC) {
                totalCount
              }
              followers {
                totalCount
              }
              following {
                totalCount
              }
              url
              createdAt
              contributionsCollection {
                totalCommitContributions
                restrictedContributionsCount
                totalRepositoriesWithContributedCommits
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
              topRepositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
                nodes {
                  name
                  url
                  description
                  stargazerCount
                  forkCount
                  primaryLanguage {
                    name
                    color
                  }
                  updatedAt
                }
              }
              repositoriesContributedTo(includeUserRepositories: false) {
                totalCount
              }
              starredRepositories {
                totalCount
              }
            }
          }
        `;

        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { login: "zakroum-hicham" || '' },
          }),
        });

        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}`);
        }

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        // console.log(result.data);

        setUserData(result.data.user);
        
        // Calculate language stats from top repositories
        const langStats: LanguageStats = {};
        result.data.user.topRepositories.nodes.forEach((repo: any) => {
          if (repo.primaryLanguage) {
            const langName = repo.primaryLanguage.name;
            langStats[langName] = {
              count: (langStats[langName]?.count || 0) + 1,
              color: repo.primaryLanguage.color
            };
          }
        });
        setTopLanguages(langStats);
        
        // Calculate streaks from contribution data
        const streaks = calculateStreaks(result.data.user.contributionsCollection.contributionCalendar.weeks);
        setStreakInfo(streaks);
        
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchGitHubData();
    }
  }, [session]);

  // Calculate streaks from contribution data
  const calculateStreaks = (weeks: any[]): StreakInfo => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Get all contribution days in a flat array
    const allDays = weeks.flatMap((week: any) => week.contributionDays);
    
    // Sort by date (newest first)
    allDays.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate current streak
    for (const day of allDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    for (const day of allDays) {
      if (day.contributionCount > 0) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    
    // Check if the last streak was the longest
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    
    return { current: currentStreak, longest: longestStreak };
  };

  if (!session) {
    return <div className="p-4 text-center">Please sign in to view your GitHub data.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">GitHub Developer Dashboard</h1>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        {userData && (
          <>
            {/* Profile Header */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:flex-shrink-0 p-8">
                  <img
                    className="h-32 w-32 rounded-full border-4 border-blue-500"
                    src={userData.avatarUrl}
                    alt={`${userData.name || userData.login}'s avatar`}
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold">{userData.name || userData.login}</h2>
                    {userData.name && (
                      <span className="ml-3 text-gray-400">({userData.login})</span>
                    )}
                  </div>
                  
                  {userData.bio && (
                    <p className="text-lg mb-6 italic">"{userData.bio}"</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{userData.repositories.totalCount}</div>
                      <div className="text-gray-400">Repositories</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{userData.followers.totalCount}</div>
                      <div className="text-gray-400">Followers</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{userData.following.totalCount}</div>
                      <div className="text-gray-400">Following</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{userData.starredRepositories.totalCount}</div>
                      <div className="text-gray-400">Stars</div>
                    </div>
                  </div>
                  
                  <a
                    href={userData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    View on GitHub
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Total Contributions</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {userData.contributionsCollection.contributionCalendar.totalContributions} in this year
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Longest Streak</h3>
                <p className="text-3xl font-bold text-green-400">
                  {streakInfo.longest} days
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Current Streak</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {streakInfo.current} days
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Contributed To</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {userData.repositoriesContributedTo.totalCount} repos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Repositories */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Top Repositories</h2>
                <div className="space-y-4">
                  {userData.topRepositories.nodes.sort((a, b) => b.stargazerCount - a.stargazerCount).map((repo) => (
                    <div key={repo.name} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                              {repo.name}
                            </a>
                          </h3>
                          {repo.description && (
                            <p className="text-sm text-gray-300 mt-1">{repo.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {repo.primaryLanguage && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: `${repo.primaryLanguage.color}20`, color: repo.primaryLanguage.color }}
                            >
                              {repo.primaryLanguage.name}
                            </span>
                          )}
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{repo.stargazerCount}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                            </svg>
                            <span>{repo.forkCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Distribution */}
              <div className="bg-gray-800 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4">Language Distribution</h2>
                <div className="space-y-3">
                  {Object.entries(topLanguages)
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([language, data]) => (
                      <div key={language} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: data.color }}
                          ></div>
                          <span className="text-sm">{language}</span>
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${(data.count / Math.max(...Object.values(topLanguages).map(l => l.count))) * 100}%`,
                                backgroundColor: data.color
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{data.count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubGraphQLDashboard;