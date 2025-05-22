
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { egyptianGovernorates } from '@/data/egyptianGovernorates';
import { citiesByGovernorate as egyptianCities } from '@/data/egyptianCities';
import { CraftsmenSearchForm } from './CraftsmenSearchForm';
import { craftsmanSpecialties } from '@/data/craftsman-specialties';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CraftsmenFiltersProps {
  onFilterChange: (filters: any) => void;
  filters: any;
  specialties: string[];
  onSearch: (term: string) => void;
}

export const CraftsmenFilters = ({ onFilterChange, filters, specialties, onSearch }: CraftsmenFiltersProps) => {
  const [governorates, setGovernorates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([]);
  
  useEffect(() => {
    // تأكد من عدم وجود قيم فارغة في المحافظات
    setGovernorates(egyptianGovernorates.filter(gov => gov && gov.trim() !== ''));
    // تأكد من عدم وجود قيم فارغة في التخصصات
    setAvailableSpecialties(craftsmanSpecialties.filter(specialty => specialty && specialty.trim() !== ''));
  }, []);
  
  // Update cities when governorate changes
  useEffect(() => {
    if (filters.governorate === 'all') {
      setCities([]);
      return;
    }
    
    // Find cities for the selected governorate
    const governorateCities = egyptianCities[filters.governorate] || [];
    // Filter out empty strings
    setCities(governorateCities.filter(city => city && city.trim() !== ''));
    
    // Reset city selection when governorate changes
    if (filters.city !== 'all') {
      onFilterChange({ ...filters, city: 'all' });
    }
  }, [filters.governorate]);
  
  const handleSpecialtyChange = (value: string) => {
    onFilterChange({ ...filters, specialty: value });
  };
  
  const handleGovernorateChange = (value: string) => {
    onFilterChange({ ...filters, governorate: value, city: 'all' });
  };
  
  const handleCityChange = (value: string) => {
    onFilterChange({ ...filters, city: value });
  };
  
  const handleRatingChange = (value: number[]) => {
    onFilterChange({ ...filters, rating: value[0] });
  };
  
  const handleOnlineOnlyChange = (checked: boolean) => {
    onFilterChange({ ...filters, onlineOnly: checked });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <CraftsmenSearchForm onSearch={onSearch} />
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        {/* Specialty Filter */}
        <div>
          <Label htmlFor="specialty">التخصص</Label>
          <Select
            value={filters.specialty}
            onValueChange={handleSpecialtyChange}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="اختر التخصص" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {availableSpecialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Governorate Filter */}
        <div>
          <Label htmlFor="governorate">المحافظة</Label>
          <Select 
            value={filters.governorate}
            onValueChange={handleGovernorateChange}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="اختر المحافظة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {governorates.map((governorate) => (
                <SelectItem key={governorate} value={governorate}>
                  {governorate}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* City Filter */}
        <div>
          <Label htmlFor="city">المدينة</Label>
          <Select
            value={filters.city}
            onValueChange={handleCityChange}
            disabled={filters.governorate === 'all' || cities.length === 0}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Rating Filter */}
        <div>
          <Label>التقييم</Label>
          <div className="flex items-center justify-between mt-2 mb-1">
            <span className="text-sm">{filters.rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-lg ${i < filters.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <Slider
            defaultValue={[filters.rating]}
            value={[filters.rating]}
            max={5}
            step={1}
            onValueChange={handleRatingChange}
          />
        </div>
        
        {/* Online Only Filter */}
        <div className="flex items-center justify-between">
          <Label htmlFor="onlineOnly">متاحين الآن فقط</Label>
          <Switch
            id="onlineOnly"
            checked={filters.onlineOnly}
            onCheckedChange={handleOnlineOnlyChange}
          />
        </div>
      </div>
    </div>
  );
};
