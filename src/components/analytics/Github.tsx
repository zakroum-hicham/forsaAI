import { Code, TrendingUp, Trophy, Users } from "lucide-react";

const GitHub = () => {
  return (
    <div className="space-y-6">
            {/* Recruitment Quality Indicators */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recruitment Quality Score</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">A+</div>
                  <div className="text-sm text-gray-600">Overall GitHub Quality</div>
                  <div className="text-xs text-gray-500 mt-1">Top 15% of all applicant pools</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-gray-600">Industry Match Score</div>
                  <div className="text-xs text-gray-500 mt-1">Strong frontend focus alignment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">94%</div>
                  <div className="text-sm text-gray-600">Active Contributors</div>
                  <div className="text-xs text-gray-500 mt-1">Recent commits within 30 days</div>
                </div>
              </div>
            </div>

            {/* Key Recruitment Insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Senior-Level Candidates</h3>
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">78</div>
                <div className="text-sm text-green-600 mt-1">3+ years experience</div>
                <div className="text-xs text-gray-500 mt-1">32% of total applicants</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Team Leaders</h3>
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-green-600 mt-1">10+ contributors managed</div>
                <div className="text-xs text-gray-500 mt-1">Strong leadership potential</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Enterprise Ready</h3>
                  <Code className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-green-600 mt-1">Production experience</div>
                <div className="text-xs text-gray-500 mt-1">Large-scale projects</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Innovation Leaders</h3>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">34</div>
                <div className="text-sm text-green-600 mt-1">Early tech adopters</div>
                <div className="text-xs text-gray-500 mt-1">Cutting-edge frameworks</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Match Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend Skills Match</h3>
                <p className="text-gray-600 mb-4">Alignment with job requirements</p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">React.js</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Required</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">87% match</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{width: '87%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">214 candidates have production React experience</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">TypeScript</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Preferred</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">73% match</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{width: '73%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">180 candidates use TypeScript regularly</div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Next.js</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Preferred</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">45% match</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">111 candidates have Next.js projects</div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">Testing (Jest/Cypress)</span>
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Nice to Have</span>
                      </div>
                      <span className="text-sm text-yellow-600 font-medium">38% match</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{width: '38%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">94 candidates show testing experience</div>
                  </div>
                </div>
              </div>

              {/* Experience Level Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Experience Level Insights</h3>
                <p className="text-gray-600 mb-4">Based on repository complexity and contribution patterns</p>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-900">Junior (0-2 years)</div>
                        <div className="text-sm text-gray-600">45 candidates</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">18%</div>
                      <div className="text-xs text-red-600">⚠️ May need mentoring</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-900">Mid-Level (3-5 years)</div>
                        <div className="text-sm text-gray-600">124 candidates</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">50%</div>
                      <div className="text-xs text-green-600">✅ Ready to contribute</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium text-gray-900">Senior (5+ years)</div>
                        <div className="text-sm text-gray-600">78 candidates</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">32%</div>
                      <div className="text-xs text-green-600">🚀 Can lead initiatives</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Hiring Recommendation</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Strong senior-level representation. Consider fast-tracking the top 32% for technical interviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Top Candidates by GitHub Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Candidates by GitHub Score</h3>
                  <p className="text-gray-600">Ranked by contribution quality, project complexity, and skill match</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Export List</button>
                  <button className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Schedule Interviews</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GitHub Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Strengths</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recent Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-bold text-green-700">#1</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Sarah Chen</div>
                        <div className="text-sm text-gray-600">@sarahc-dev</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-green-600">95</div>
                          <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Exceptional</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React Expert</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">TypeScript</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Team Lead</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">47 commits this week</div>
                        <div className="text-xs text-green-600">Very active</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm">
                          Interview
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-bold text-blue-700">#2</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Alex Rodriguez</div>
                        <div className="text-sm text-gray-600">@alexr-frontend</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-blue-600">89</div>
                          <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Excellent</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">Next.js</span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">JavaScript</span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Testing</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">32 commits this week</div>
                        <div className="text-xs text-green-600">Active</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="font-bold text-blue-700">#3</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Maria Silva</div>
                        <div className="text-sm text-gray-600">@maria-dev</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-blue-600">84</div>
                          <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Very Good</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Vue.js</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Node.js</span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">GraphQL</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">28 commits this week</div>
                        <div className="text-xs text-yellow-600">Moderate</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  );
};
export default GitHub;