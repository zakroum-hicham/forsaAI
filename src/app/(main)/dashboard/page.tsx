import { 
  Users, 
  Briefcase, 
  Star, 
  Activity, 
  Search,
  Filter,
  Plus,
  Bell,
  ChevronDown,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import PipelineChart from '@/components/dashboard/PipelineChart';
import SkillMatchRadar from '@/components/dashboard/SkillMatchRadar';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardData } from '@/app/actions/dashboard';
import SignOutButton from '@/components/SignOutButton';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const dashboardData = await getDashboardData();
  // console.log('Da', user);
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bonjour {user.firstName}, voici votre activité récente
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback>
               {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-muted-foreground">{user.company || 'Sans entreprise'}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
            {/* Log Out Button */}
          <SignOutButton />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Candidats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{dashboardData.newCandidatesToday} aujourd'hui</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Postes ouverts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.openPositions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">{dashboardData.urgentPositions} urgents</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Correspondances IA</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.aiMatches}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{dashboardData.newMatches} nouvelles</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={dashboardData.successRateChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {dashboardData.successRateChange >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.successRateChange)}% depuis hier
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Pipeline Visualization */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pipeline de recrutement</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Progression des candidats à travers votre processus
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Voir détails
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PipelineChart data={dashboardData.pipelineData} />
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations de l'IA</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top candidats correspondant à vos postes ouverts
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Compétences</TableHead>
                    <TableHead className="text-right">Score IA</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.aiRecommendations.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={candidate.avatar || undefined} />
                            <AvatarFallback>
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-muted-foreground">{candidate.title}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{candidate.position}</div>
                        <div className="text-sm text-muted-foreground">{candidate.department}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {candidate.topSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="font-bold">{candidate.matchScore}%</div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <SkillMatchRadar 
                                  skills={candidate.skillMatch} 
                                  size={40} 
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Détail des correspondances de compétences</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Voir profil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button className="h-24 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Nouveau poste</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="secondary">
                <Search className="h-6 w-6" />
                <span>Rechercher candidats</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="secondary">
                <Filter className="h-6 w-6" />
                <span>Filtres avancés</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Importer candidats</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <p className="text-sm text-muted-foreground">
                Événements des dernières 24 heures
              </p>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={dashboardData.recentActivities} />
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Compétences en demande</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top 5 des compétences recherchées
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topSkills.map((skill, index) => (
                  <div key={skill.name} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="ml-4 space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {skill.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {skill.count} postes ouverts
                      </p>
                    </div>
                    <div className="font-medium">
                      +{skill.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}