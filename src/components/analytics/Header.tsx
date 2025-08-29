import { Award, GitBranch, TrendingUp, Users } from "lucide-react"
import Link from "next/link";
import { Button } from "../ui/button";

const Header = ({headerData}) => {
      // Mock data for the dashboard
  const analyticsData = {
    totalApplicants: headerData.totalApplicants,
    avgGithubContributions: headerData.avgGithubContributions,
    avgHackathons: headerData.avgHackathons,
    devsportParticipation: headerData.devsportParticipation
  };


  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Applicant Analytics</h1>
              <span className="text-sm text-gray-500">{headerData.jobTitle}</span>
            </div>
            <Link href="/dashboard">
              <Button
                className="whitespace-nowrap"
                >
                ← Back to Dashboard
              </Button>
              </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.totalApplicants}</p>
                <p className="text-sm text-gray-500">Candidates applied for this position</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. GitHub Contributions</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.avgGithubContributions.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Win Rate: 0%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <GitBranch className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Hackathons</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.avgHackathons}</p>
                <p className="text-sm text-gray-500">Average participation per candidate</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DevSport Participation</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.devsportParticipation}%</p>
                <p className="text-sm text-gray-500">of applicants have DevSport profiles</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
