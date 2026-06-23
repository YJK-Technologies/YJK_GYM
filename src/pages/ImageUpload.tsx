
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: (string | null)[];
  onImagesChange: (images: (string | null)[]) => void;
  maxImages?: number;
  label?: string;

  onFilesChange?: (files: (File | null)[]) => void;
}

const ImageUpload = ({ images, onImagesChange, maxImages = 3, label = "Project Images", onFilesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadImage = async (file: File, index: number) => {
    setUploading(index);

    try {
      const base64String = await convertToBase64(file);

      const newImages = [...images];
      newImages[index] = base64String;
      onImagesChange(newImages);

      // NEW
      if (onFilesChange) {
        const files = Array(maxImages).fill(null);
        files[index] = file;
        onFilesChange(files);
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    onImagesChange(newImages);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      uploadImage(file, index);
    }
  };

  const getGridLayout = () => {
    if (maxImages === 1) return "grid-cols-1 w-full"; // Full space occupied 
    if (maxImages === 2) return "grid-cols-2 w-full gap-4"; // Left & Right evenly split
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-4"; // 3 items alignment structured responsive matrix
  };

  return (
    <div className="space-y-4">
      <Label>{label} (up to {maxImages})</Label>
      <div className={`grid ${getGridLayout()}`}>
        {Array.from({ length: maxImages }).map((_, index) => (
          <div key={index} className="relative">
            {images[index] ? (
              <div className="relative group">
                <img
                  src={images[index]!}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, index)}
                  className="hidden"
                  id={`image-upload-${index}`}
                />
                <Label
                  htmlFor={`image-upload-${index}`}
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                  {uploading === index ? (
                    <div className="animate-spin">
                      <Upload className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <>
                      <Image className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Image</span>
                    </>
                  )}
                </Label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
