
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ClientInfoCardProps {
  client: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    avatar?: string;
    governorate?: string;
    city?: string;
    created_at?: string;
    rating?: number;
    id?: string;
  };
}

export const ClientInfoCard = ({ client }: ClientInfoCardProps) => {
  if (!client) return null;
  
  // Support both name formats (full_name from DB or name from processed data)
  const displayName = client?.full_name || client?.name || "عميل";
  const avatarUrl = client?.avatar_url || client?.avatar || "";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>معلومات العميل</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {displayName ? displayName[0] : "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{displayName}</h3>
            <p className="text-sm text-muted-foreground">
              {client?.governorate && client?.city ? 
                `${client.governorate} - ${client.city}` : 
                client?.governorate || "غير محدد"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <span className="text-sm text-muted-foreground">عضو منذ</span>
          <span className="text-sm">
            {client?.created_at ? 
              formatDistanceToNow(parseISO(client.created_at), { 
                addSuffix: false, 
                locale: ar 
              }) : "غير معروف"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
