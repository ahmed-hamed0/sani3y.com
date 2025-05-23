
import { Card } from '@/components/ui/card';

interface ReviewProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    created_at?: string;
    reviewer?: {
      name?: string;
      avatar?: string;
    };
  };
}

export const Review = ({ review }: ReviewProps) => {
  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {review.reviewer?.avatar ? (
            <img 
              src={review.reviewer.avatar} 
              alt={review.reviewer?.name || "مستخدم"} 
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              {review.reviewer?.name ? review.reviewer.name.charAt(0).toUpperCase() : 'م'}
            </div>
          )}
          <div className="mr-2">
            <p className="font-semibold">{review.reviewer?.name || 'مستخدم مجهول'}</p>
            <p className="text-sm text-gray-500">
              {review.created_at ? new Date(review.created_at).toLocaleDateString('ar-EG') : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-gray-700">{review.comment || 'لا يوجد تعليق'}</p>
    </Card>
  );
};
