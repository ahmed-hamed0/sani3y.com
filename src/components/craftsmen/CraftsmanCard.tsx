
import { Link } from 'react-router-dom';
import { Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Craftsman } from '@/types';
import { CraftsmanRating } from '@/components/reviews/CraftsmanRating';

interface CraftsmanCardProps {
  craftsman: Craftsman;
}

const CraftsmanCard = ({ craftsman }: CraftsmanCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={craftsman.avatar || '/placeholder.svg'}
              alt={craftsman.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            />
            {craftsman.availability && (
              <span className="absolute bottom-0 left-0 bg-green-500 p-1 rounded-full">
                <Check className="h-3 w-3 text-white" />
              </span>
            )}
          </div>
          <div className="mr-4">
            <h3 className="text-lg font-semibold">{craftsman.name}</h3>
            <p className="text-primary">{craftsman.specialty}</p>
          </div>
        </div>
        
        <div className="mb-3">
          <CraftsmanRating 
            craftsmanId={craftsman.id} 
            initialRating={craftsman.rating} 
          />
        </div>
        
        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <MapPin className="h-4 w-4 ml-1" />
          <span>{craftsman.location.city}، {craftsman.location.governorate}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{craftsman.bio}</p>
        
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link to={`/craftsman/${craftsman.id}`}>عرض الملف الشخصي</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to={`/post-job?craftsman=${craftsman.id}`}>طلب خدمة</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanCard;
