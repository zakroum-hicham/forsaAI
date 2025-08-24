'use client';

import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function SkillMatchRadar({ 
  skills, 
  size = 100 
}: { 
  skills: { skill: string; match: number }[];
  size?: number;
}) {
  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
          <Radar
            name="Match"
            dataKey="match"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}