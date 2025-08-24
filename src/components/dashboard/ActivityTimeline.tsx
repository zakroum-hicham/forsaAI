import { 
  CheckCircle, 
  UserPlus, 
  Mail, 
  FileText, 
  ThumbsUp 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ActivityTimeline({ activities }: { activities: any[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'new_candidate':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-amber-500" />;
      case 'evaluation':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'decision':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div className="p-2 rounded-full bg-secondary">
              {getIcon(activity.type)}
            </div>
            <div className="w-0.5 h-full bg-gray-200 mt-2" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium">{activity.title}</h4>
              <time className="text-sm text-muted-foreground">
                {activity.time}
              </time>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {activity.description}
            </p>
            {activity.meta && (
              <div className="mt-2 flex gap-2">
                {activity.meta.map((meta: any) => (
                  <Badge 
                    key={meta.text} 
                    variant={meta.variant || 'secondary'}
                  >
                    {meta.text}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}