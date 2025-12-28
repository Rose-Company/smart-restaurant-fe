import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Star, Trash2, Plus, Edit, ExternalLink, Search } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Input } from '../../../../components/ui/forms/input';
import { Label } from '../../../../components/ui/forms/label';
import { Textarea } from '../../../../components/ui/forms/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/forms/select';
import { Switch } from '../../../../components/ui/forms/switch';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../../../components/ui/forms/radio-group';
import type {
  MenuItem,
  UploadedImage,
  ModifierGroup,
} from '../../types/menu.types';

// Brand color constant to avoid Tailwind arbitrary value issues
const BRAND_COLOR = '#27ae60';
const BRAND_COLOR_HOVER = '#229954';

interface AddMenuItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<MenuItem, 'id' | 'lastUpdate' | 'imageUrl'>) => void;
}

export function AddMenuItemDialog({
  isOpen,
  onClose,
  onAddItem,
}: AddMenuItemDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [category, setCategory] = useState('');
  const [chefRecommended, setChefRecommended] = useState(false);
  const [status, setStatus] = useState<
    'Available' | 'Sold Out' | 'Unavailable'
  >('Available');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [modifiers, setModifiers] = useState<ModifierGroup[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const attachDropdownRef = useRef<HTMLDivElement>(null);

  // Available modifier groups (from global groups)
  const availableGroups: ModifierGroup[] = [
    {
      id: 'size',
      name: 'Size Selection',
      required: true,
      selectionType: 'Single',
      optionsPreview: 'Small (+$0), Medium (+$2), Large (+$4)',
    },
    {
      id: 'toppings',
      name: 'Extra Toppings',
      required: false,
      selectionType: 'Multi',
      optionsPreview: 'Cheese, Bacon, Mushrooms...',
    },
    {
      id: 'sugar',
      name: 'Sugar Level',
      required: false,
      selectionType: 'Single',
      optionsPreview: 'No Sugar, 25%, 50%, 75%, 100%',
    },
    {
      id: 'ice',
      name: 'Ice Level',
      required: false,
      selectionType: 'Single',
      optionsPreview: 'No Ice, Less Ice, Normal, Extra Ice',
    },
  ];

  // Filter available groups based on search
  const filteredGroups = availableGroups.filter(
    (group) =>
      !modifiers.some((m) => m.id === group.id) &&
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachDropdownRef.current &&
        !attachDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAttachDropdown(false);
        setSearchQuery('');
      }
    };

    if (showAttachDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachDropdown]);

  if (!isOpen) return null;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Resize image to max 800px width/height while maintaining aspect ratio
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;
            const maxSize = 800;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height / width) * maxSize;
                width = maxSize;
              } else {
                width = (width / height) * maxSize;
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to base64 with compression (0.85 quality)
            const resizedUrl = canvas.toDataURL('image/jpeg', 0.85);

            const newImage: UploadedImage = {
              id: Math.random().toString(36).substr(2, 9),
              url: resizedUrl,
              isPrimary: images.length === 0, // First image is primary
            };
            setImages((prev) => [...prev, newImage]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const setPrimaryImage = (id: string) => {
    setImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      })),
    );
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    // If we removed the primary image, make the first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some((img) => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    setImages(updatedImages);
  };

  const attachModifierGroup = (groupId: string) => {
    const groupToAttach = availableGroups.find((g) => g.id === groupId);
    if (groupToAttach && !modifiers.some((m) => m.id === groupId)) {
      setModifiers([...modifiers, groupToAttach]);
      setShowAttachDropdown(false);
      setSearchQuery('');
    }
  };

  const removeModifierGroup = (id: string) => {
    setModifiers(modifiers.filter((mod) => mod.id !== id));
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setPreparationTime('');
    setCategory('');
    setChefRecommended(false);
    setStatus('Available');
    setImages([]);
    setModifiers([]);
    setIsDragging(false);
    setHoveredImageId(null);
    setShowAttachDropdown(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!name || !category || !price) {
      alert('Please fill in required fields: Name, Category, and Price');
      return;
    }

    onAddItem({
      name,
      description,
      price: parseFloat(price) || 0,
      preparationTime: parseInt(preparationTime) || 0,
      category,
      chefRecommended,
      status,
      images,
      modifiers,
    });

    resetForm();
  };

  return (
    <>
      <style>{`
        .image-container:hover .delete-btn {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        .image-container:hover .image-overlay {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .thumbnail-container:hover .delete-btn {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        .thumbnail-container:hover .set-primary-btn {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .thumbnail-container:hover .image-overlay {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .thumbnail-container:hover {
          border-color: ${BRAND_COLOR} !important;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            width: '1152px',
            maxWidth: '95vw',
            height: '85vh',
            maxHeight: '772px'
          }}
        >
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-base font-normal text-gray-900">Add New Menu Item</h2>
              <p className="text-sm text-gray-600 mt-1">
                Create a new item for your restaurant menu
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - General Info */}
                <div className="space-y-5 min-w-0">
                  <div>
                    <h3 className="text-base font-normal text-gray-900 mb-5">General Information</h3>

                    {/* Item Name */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                        Item Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="itemName"
                        placeholder="e.g., Grilled Salmon"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                        className="border"
                        onFocus={(e) => {
                          e.target.style.borderColor = BRAND_COLOR;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5dc';
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your dish, ingredients, and special features..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                        className="border min-h-[120px] resize-none"
                        onFocus={(e) => {
                          e.target.style.borderColor = BRAND_COLOR;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5dc';
                        }}
                      />
                    </div>

                    {/* Price and Prep Time */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                          Price <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                            className="pl-7 border"
                            onFocus={(e) => {
                              e.target.style.borderColor = BRAND_COLOR;
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5dc';
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prepTime" className="text-sm font-medium text-gray-700">
                          Prep Time (min)
                        </Label>
                        <Input
                          id="prepTime"
                          type="number"
                          min="0"
                          placeholder="15"
                          value={preparationTime}
                          onChange={(e) => setPreparationTime(e.target.value)}
                          style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                          className="border"
                          onFocus={(e) => {
                            e.target.style.borderColor = BRAND_COLOR;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5dc';
                          }}
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger
                          style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                          className="border"
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Appetizer">Appetizer</SelectItem>
                          <SelectItem value="Main Course">Main Course</SelectItem>
                          <SelectItem value="Dessert">Dessert</SelectItem>
                          <SelectItem value="Beverage">Beverage</SelectItem>
                          <SelectItem value="Side Dish">Side Dish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Chef Recommended Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5" style={{ color: BRAND_COLOR }} />
                        <div>
                          <Label
                            htmlFor="chefRecommended"
                            className="text-sm font-medium text-gray-900 cursor-pointer"
                          >
                            Chef Recommended
                          </Label>
                          <p className="text-sm text-gray-600">
                            Highlight this item as a staff pick
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="chefRecommended"
                        checked={chefRecommended}
                        onCheckedChange={setChefRecommended}
                      />
                    </div>

                    {/* Status Radio Group */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Status</Label>
                      <RadioGroup
                        value={status}
                        onValueChange={(value) =>
                          setStatus(value as 'Available' | 'Sold Out' | 'Unavailable')
                        }
                        className="flex gap-3"
                      >
                        <Label
                          htmlFor="status-available"
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-gray-300 flex-1"
                          style={status === 'Available' ? {
                            borderColor: BRAND_COLOR,
                            backgroundColor: '#f0fdf4'
                          } : undefined}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="Available" id="status-available" />
                            <span className="text-sm font-medium text-gray-900">Available</span>
                          </div>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: '#00c950' }}
                          />
                        </Label>

                        <Label
                          htmlFor="status-sold-out"
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-gray-300 flex-1"
                          style={status === 'Sold Out' ? {
                            borderColor: '#ef4444',
                            backgroundColor: '#fef2f2'
                          } : undefined}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="Sold Out" id="status-sold-out" />
                            <span className="text-sm font-medium text-gray-900">Sold Out</span>
                          </div>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: '#fb2c36' }}
                          />
                        </Label>

                        <Label
                          htmlFor="status-unavailable"
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer transition-all hover:border-gray-300 flex-1"
                          style={status === 'Unavailable' ? {
                            borderColor: '#6b7280',
                            backgroundColor: '#f9fafb'
                          } : undefined}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="Unavailable" id="status-unavailable" />
                            <span className="text-sm font-medium text-gray-900">Unavailable</span>
                          </div>
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: '#6a7282' }}
                          />
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Right Column - Media & Extras */}
                <div className="space-y-6 min-w-0">
                  {/* Photos Section */}
                  <div>
                    <h3 className="text-base font-normal text-gray-900 mb-4">Photos</h3>

                    {/* Upload Zone */}
                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{
                        border: '2px dashed #d1d5dc',
                        borderColor: isDragging ? BRAND_COLOR : '#d1d5dc',
                      }}
                      className={`
                    relative z-10
                    rounded-xl
                    transition-all
                    w-full
                    ${images.length > 0 ? 'px-4 py-4' : 'px-8 py-20'}
                    ${isDragging
                          ? 'bg-green-50'
                          : 'hover:bg-gray-50'
                        }
                `}
                    >
                      {/* Upload UI - Show only when no images */}
                      {images.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="w-12 h-12 mb-6 text-gray-400 mt-2" />

                          <p className="text-base font-normal text-gray-900 mb-1">
                            Drag & drop images here
                          </p>
                          <p className="text-sm text-gray-500 mb-6">or</p>

                          <Button
                            type="button"
                            variant="outline"
                            className="px-6 py-2 text-sm font-medium"
                            style={{
                              borderColor: BRAND_COLOR,
                              color: BRAND_COLOR,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${BRAND_COLOR}1a`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '';
                            }}
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Browse Files
                          </Button>

                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileInput}
                            className="hidden"
                            style={{ display: 'none' }}
                          />

                          <p className="text-xs text-gray-500 mt-6 mb-2">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}

                      {/* Image Previews - Show when images exist */}
                      {images.length > 0 && (
                        <div className="space-y-3 w-full overflow-hidden">
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileInput}
                            className="hidden"
                            style={{ display: 'none' }}
                          />

                          {/* Primary Image */}
                          {images
                            .filter((img) => img.isPrimary)
                            .map((img) => (
                              <div
                                key={img.id}
                                className="relative w-full mb-3 image-container"
                              >
                                <div
                                  className="relative rounded-lg overflow-hidden cursor-pointer w-full"
                                  style={{ 
                                    border: `2px solid ${BRAND_COLOR}`,
                                    borderColor: BRAND_COLOR
                                  }}
                                >
                                  <img
                                    src={img.url}
                                    alt="Primary"
                                    className="w-full h-48 object-cover"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                  />
                                  {/* Overlay - Gray mờ khi hover */}
                                  <div
                                    className="image-overlay absolute inset-0 pointer-events-none"
                                    style={{
                                      backgroundColor: 'rgba(0, 0, 0, 0)',
                                      zIndex: 10,
                                      transition: 'background-color 0.2s ease-in-out'
                                    }}
                                  />

                                  {/* Delete button - Top Right - Chỉ hiển thị khi hover */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      removeImage(img.id);
                                    }}
                                    className="delete-btn absolute top-2 right-2 w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                                    style={{
                                      backgroundColor: 'white',
                                      color: '#ef4444',
                                      opacity: 0,
                                      visibility: 'hidden',
                                      pointerEvents: 'none',
                                      zIndex: 50,
                                      border: 'none',
                                      cursor: 'pointer',
                                      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#fef2f2';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'white';
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {/* Star Icon - Center - Always visible - Outside overflow container */}
                                <div
                                  className="absolute rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: BRAND_COLOR,
                                    width: '40px',
                                    height: '40px',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 30,
                                    display: 'flex',
                                    visibility: 'visible',
                                    opacity: 1,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    pointerEvents: 'none'
                                  }}
                                >
                                  <Star 
                                    className="w-5 h-5"
                                    style={{ 
                                      fill: '#ffffff', 
                                      color: '#ffffff',
                                      width: '20px',
                                      height: '20px'
                                    }} 
                                  />
                                </div>
                              </div>
                            ))}

                          {/* Other Images - Grid */}
                          {images.filter((img) => !img.isPrimary).length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                              {images
                                .filter((img) => !img.isPrimary)
                                .map((img) => (
                                  <div
                                    key={img.id}
                                    className="relative overflow-hidden thumbnail-container"
                                  >
                                    <div
                                      className="relative rounded-lg overflow-hidden border cursor-pointer w-full transition-colors"
                                      style={{
                                        borderColor: '#e5e7eb'
                                      }}
                                    >
                                      <img
                                        src={img.url}
                                        alt="Thumbnail"
                                        className="w-full h-24 object-cover"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                      />

                                      {/* Overlay - Gray mờ khi hover */}
                                      <div
                                        className="image-overlay absolute inset-0 pointer-events-none"
                                        style={{
                                          backgroundColor: 'rgba(0, 0, 0, 0)',
                                          zIndex: 10,
                                          transition: 'background-color 0.2s ease-in-out'
                                        }}
                                      />

                                      {/* Delete button - Top Right - Màu đỏ - Chỉ hiển thị khi hover */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          removeImage(img.id);
                                        }}
                                        className="delete-btn absolute top-1 right-1 w-6 h-6 rounded-full p-0 shadow-sm flex items-center justify-center"
                                        style={{
                                          backgroundColor: 'white',
                                          color: '#ef4444',
                                          opacity: 0,
                                          visibility: 'hidden',
                                          pointerEvents: 'none',
                                          zIndex: 50,
                                          border: 'none',
                                          cursor: 'pointer',
                                          transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#fef2f2';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = 'white';
                                        }}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>

                                      {/* Set Primary button - Center on hover */}
                                      <div
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        style={{ zIndex: 50 }}
                                      >
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setPrimaryImage(img.id);
                                          }}
                                          className="set-primary-btn w-8 h-8 rounded-full p-0 flex items-center justify-center"
                                          style={{
                                            backgroundColor: 'white',
                                            color: BRAND_COLOR,
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'opacity 0.2s ease-in-out'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f0fdf4';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'white';
                                          }}
                                        >
                                          <Star className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* Add More Button */}
                          <div className="flex justify-end pt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              style={{
                                borderColor: BRAND_COLOR,
                                color: BRAND_COLOR,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${BRAND_COLOR}1a`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                              }}
                              onClick={() => document.getElementById('file-upload')?.click()}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add More
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modifiers Section */}
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-normal text-gray-900">Modifiers</h3>
                      <a
                        href="#"
                        className="text-sm flex items-center gap-1"
                        style={{ color: BRAND_COLOR }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          // Navigate to Manage Global Groups page
                        }}
                      >
                        Manage Global Groups
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Attach Existing Group Button with Dropdown */}
                    <div className="relative mb-4" ref={attachDropdownRef}>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        style={{
                          borderColor: BRAND_COLOR,
                          color: BRAND_COLOR,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${BRAND_COLOR}1a`;
                        }}
                        onMouseLeave={(e) => {
                          if (!showAttachDropdown) {
                            e.currentTarget.style.backgroundColor = '';
                          }
                        }}
                        onClick={() => setShowAttachDropdown(!showAttachDropdown)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Attach Existing Group
                      </Button>

                      {/* Dropdown Menu */}
                      {showAttachDropdown && (
                        <div
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                          style={{ maxHeight: '300px', overflowY: 'auto' }}
                        >
                          {/* Search Bar */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="Search modifier groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 px-8 py-2"
                                style={{ backgroundColor: '#f3f3f5', borderColor: '#d1d5dc' }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = BRAND_COLOR;
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#d1d5dc';
                                }}
                              />
                            </div>
                          </div>

                          {/* Group List */}
                          <div className="py-2">
                            {filteredGroups.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No groups found
                              </div>
                            ) : (
                              filteredGroups.map((group) => (
                                <button
                                  key={group.id}
                                  type="button"
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                  onClick={() => attachModifierGroup(group.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {group.name}
                                      </p>
                                      {group.optionsPreview && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          {group.optionsPreview}
                                        </p>
                                      )}
                                    </div>
                                    {group.selectionType && (
                                      <span
                                        className="px-2 py-1 rounded-full text-xs font-medium"
                                        style={{
                                          backgroundColor:
                                            group.selectionType === 'Single'
                                              ? '#dbeafe'
                                              : '#e9d5ff',
                                          color:
                                            group.selectionType === 'Single'
                                              ? '#1e40af'
                                              : '#6b21a8',
                                        }}
                                      >
                                        {group.selectionType === 'Single'
                                          ? 'Single'
                                          : 'Multi'}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                          
                        </div>
                      )}
                    </div>

                    {/* Attached Groups List */}
                    {modifiers.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          No modifier groups attached
                        </p>
                        <p className="text-sm text-gray-400">
                          Click "Attach Existing Group" to add customization options
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {modifiers.map((modifier) => (
                          <div
                            key={modifier.id}
                            className="relative p-4 border rounded-lg"
                            style={{
                              borderColor: BRAND_COLOR,
                            }}
                          >
                            {/* Header with badges */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {modifier.name}
                                </h4>
                                {/* Required/Optional Badge */}
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: modifier.required
                                      ? '#fee2e2'
                                      : '#f3f4f6',
                                    color: modifier.required ? '#dc2626' : '#6b7280',
                                  }}
                                >
                                  {modifier.required ? 'Required' : 'Optional'}
                                </span>
                                {/* Selection Type Badge */}
                                {modifier.selectionType && (
                                  <span
                                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor:
                                        modifier.selectionType === 'Single'
                                          ? '#dbeafe'
                                          : '#e9d5ff',
                                      color:
                                        modifier.selectionType === 'Single'
                                          ? '#1e40af'
                                          : '#6b21a8',
                                    }}
                                  >
                                    {modifier.selectionType === 'Single'
                                      ? 'single'
                                      : 'multi'}
                                  </span>
                                )}
                              </div>
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeModifierGroup(modifier.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Options Preview */}
                            {modifier.optionsPreview && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-600 mb-1">Options:</p>
                                <p className="text-xs text-gray-500">
                                  {modifier.optionsPreview}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 border-t border-gray-200 flex items-center justify-end gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="text-white"
              style={{ backgroundColor: BRAND_COLOR }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_COLOR_HOVER;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_COLOR;
              }}
            >
              Save Item
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

