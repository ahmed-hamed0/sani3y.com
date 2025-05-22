
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface CraftsmanInfoCardProps {
  craftsman: {
    id?: string;
    name?: string;
    full_name?: string;
    avatar_url?: string;
    avatar?: string;
    specialty?: string;
    rating?: number;
  };
}

export const CraftsmanInfoCard = ({ craftsman }: CraftsmanInfoCardProps) => {
  if (!craftsman?.id) return null;
  
  // Support both name formats (full_name from DB or name from processed data)
  const displayName = craftsman?.full_name || craftsman?.name || "صنايعي";
  const avatarUrl = craftsman?.avatar_url || craftsman?.avatar || "";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>الصنايعي المكلف</CardTitle>
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
              {craftsman?.specialty || "غير محدد"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button 
          variant="outline"
          size="sm"
          asChild
        >
          <Link to={`/craftsman/${craftsman.id}`} className="flex items-center">
            <User className="ml-1 h-4 w-4" />
            عرض الملف الشخصي
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
