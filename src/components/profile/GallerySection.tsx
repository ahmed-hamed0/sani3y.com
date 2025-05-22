
import { useState, useRef } from 'react';
import { uploadGalleryImage, removeGalleryImage } from '@/lib/profile/image-upload';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GallerySectionProps {
  profile: any;
}

const GallerySection = ({ profile }: GallerySectionProps) => {
  const { user, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user?.id) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast("حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
      return;
    }

    setIsUploading(true);
    try {
      const { success, url, error } = await uploadGalleryImage(user.id, file);
      if (success && url) {
        toast("تم إضافة الصورة بنجاح");
        refreshProfile();
      } else if (error) {
        toast("خطأ في تحميل الصورة: " + error.message, {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("خطأ في تحميل الصورة", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!user?.id) return;
    
    setIsDeleting(imageUrl);
    try {
      const { success, error } = await removeGalleryImage(user.id, imageUrl);
      if (success) {
        toast("تم حذف الصورة بنجاح");
        refreshProfile();
      } else if (error) {
        toast("خطأ في حذف الصورة: " + error.message, {
          style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("خطأ في حذف الصورة", {
        style: { backgroundColor: 'rgb(220, 38, 38)', color: 'white' }
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Get gallery images from profile
  const galleryImages = profile?.gallery || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">معرض الأعمال</h3>
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            {isUploading ? (
              <>جاري التحميل...</>
            ) : (
              <>
                <Upload className="h-4 w-4 ml-2" />
                إضافة صورة
              </>
            )}
          </Button>
        </div>
      </div>

      {galleryImages.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">لا توجد صور في معرض الأعمال</p>
          <p className="text-sm text-muted-foreground">أضف صوراً لأعمالك لتحسين فرصك في الحصول على وظائف</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image: string, index: number) => (
            <div key={index} className="relative group border rounded-md overflow-hidden">
              <AspectRatio ratio={4/3}>
                <img 
                  src={image} 
                  alt={`معرض أعمال ${index + 1}`}
                  className="object-cover h-full w-full"
                />
              </AspectRatio>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(image)}
                  disabled={isDeleting === image}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-muted-foreground">
          * الحد الأقصى لحجم الصورة 5 ميجابايت
        </p>
      </div>
    </div>
  );
};

export default GallerySection;
