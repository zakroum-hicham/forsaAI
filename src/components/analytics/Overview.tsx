import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Candidates from './Candidates';
import { CandidateAnalyticsData } from '@/lib/applicationAnalytics/services';


const Overview = ({topCandidates}:{topCandidates : CandidateAnalyticsData[]}) => {
    const statusData = [
    { name: 'Under Review', value: 45, color: '#3B82F6' },
    { name: 'Interview', value: 25, color: '#10B981' },
    { name: 'Rejected', value: 15, color: '#EF4444' },
    { name: 'Hired', value: 15, color: '#8B5CF6' }
    ];
    const topLanguages = [
    { name: 'JavaScript', percentage: 85, color: '#F7DF1E' },
    { name: 'Python', percentage: 72, color: '#3776AB' },
    { name: 'TypeScript', percentage: 68, color: '#3178C6' },
    { name: 'React', percentage: 65, color: '#61DAFB' },
    { name: 'Node.js', percentage: 58, color: '#339933' }
  ];
   const applicationTimelineData = [
    { date: 'Aug 1', applications: 12 },
    { date: 'Aug 5', applications: 18 },
    { date: 'Aug 10', applications: 25 },
    { date: 'Aug 15', applications: 31 },
    { date: 'Aug 20', applications: 28 },
    { date: 'Aug 25', applications: 35 },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
            ))}
            </div>
        </div>

        {/* Top Programming Languages */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Programming Languages</h3>
            <p className="text-sm text-gray-500 mb-6">Most popular languages among applicants</p>
            <div className="space-y-4">
            {topLanguages.map((lang, index) => (
                <div key={index}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: lang.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: lang.color, width: `${lang.percentage}%` }}
                    ></div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Application Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
            <p className="text-sm text-gray-500 mb-6">Number of applications received per day</p>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={applicationTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>

        {/* candidates  */}
        <div className="  lg:col-span-2">
          <Candidates candidateData={topCandidates} mode='top' title='Top Performing Candidates' description='Highest-rated candidates based on overall performance score' />
        </div>
      </div>
  );
};

export default Overview;
