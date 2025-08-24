import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getDashboardData() {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Mock data - replace with actual database queries
  return {
    totalCandidates: 142,
    newCandidatesToday: 12,
    openPositions: 8,
    urgentPositions: 3,
    aiMatches: 24,
    newMatches: 5,
    successRate: 78,
    successRateChange: 4.2,
    
    pipelineData: [
      { stage: 'Sourcing', candidates: 45 },
      { stage: 'Screening', candidates: 32 },
      { stage: 'Entretien', candidates: 18 },
      { stage: 'Offre', candidates: 8 },
      { stage: 'Embauche', candidates: 5 },
    ],
    
    aiRecommendations: [
      {
        id: '1',
        name: 'Alexandre Dubois',
        title: 'Développeur Fullstack',
        position: 'Ingénieur Frontend',
        department: 'Produit',
        avatar: null,
        matchScore: 92,
        topSkills: ['React', 'TypeScript', 'Node.js'],
        skillMatch: [
          { skill: 'React', match: 95 },
          { skill: 'TypeScript', match: 92 },
          { skill: 'Redux', match: 88 },
          { skill: 'Next.js', match: 85 },
          { skill: 'GraphQL', match: 78 },
        ]
      },
      {
        id: '2',
        name: 'Sophie Martin',
        title: 'Data Scientist',
        position: 'ML Engineer',
        department: 'R&D',
        avatar: null,
        matchScore: 87,
        topSkills: ['Python', 'TensorFlow', 'Data Analysis'],
        skillMatch: [
          { skill: 'Python', match: 95 },
          { skill: 'Machine Learning', match: 90 },
          { skill: 'PyTorch', match: 85 },
          { skill: 'Data Visualization', match: 80 },
          { skill: 'SQL', match: 75 },
        ]
      },
      {
        id: '3',
        name: 'Thomas Leroy',
        title: 'DevOps Engineer',
        position: 'SRE',
        department: 'Infrastructure',
        avatar: null,
        matchScore: 84,
        topSkills: ['AWS', 'Kubernetes', 'Docker'],
        skillMatch: [
          { skill: 'AWS', match: 92 },
          { skill: 'Kubernetes', match: 88 },
          { skill: 'CI/CD', match: 85 },
          { skill: 'Terraform', match: 82 },
          { skill: 'Monitoring', match: 78 },
        ]
      }
    ],
    
    recentActivities: [
      {
        id: '1',
        type: 'new_candidate',
        title: 'Nouveau candidat ajouté',
        description: 'Jean Dupont a été ajouté au pipeline',
        time: 'Il y a 10 min',
        meta: [{ text: 'Développeur Frontend', variant: 'default' }]
      },
      {
        id: '2',
        type: 'email',
        title: 'Email envoyé',
        description: 'Invitation à un entretien envoyée à Marie Curie',
        time: 'Il y a 45 min',
        meta: [{ text: 'Calendrier' }]
      },
      {
        id: '3',
        type: 'evaluation',
        title: 'Évaluation technique',
        description: 'Évaluation GitHub complétée pour Pierre Durand',
        time: 'Il y a 2 heures',
        meta: [{ text: 'Score: 87%', variant: 'success' }]
      },
      {
        id: '4',
        type: 'decision',
        title: 'Décision finale',
        description: 'Offre acceptée par Thomas Martin',
        time: 'Il y a 4 heures',
        meta: [{ text: 'Ingénieur Backend', variant: 'success' }]
      }
    ],
    
    topSkills: [
      { name: 'React', count: 15, growth: 12 },
      { name: 'Node.js', count: 12, growth: 8 },
      { name: 'Python', count: 10, growth: 15 },
      { name: 'AWS', count: 9, growth: 20 },
      { name: 'TypeScript', count: 8, growth: 18 },
    ]
  };
}