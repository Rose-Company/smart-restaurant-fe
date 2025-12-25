import React, { useState } from 'react';
import { X, Upload, Star, Trash2, Plus, Edit } from 'lucide-react';
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
import { cn } from '../../../../lib/utils';
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

  if (!isOpen) return null;

  const STATUS: {
    value: 'Available' | 'Sold Out' | 'Unavailable'
    border: string
    bg: string
    hover: string
    text: string
    dot: string
    ring: string
    radioBorder: string
  }[] = [
      {
        value: 'Available',
        border: 'border-green-400',
        bg: 'bg-green-50',
        hover: 'hover:bg-green-50/50',
        text: '!text-green-700',
        dot: 'bg-green-500',
        ring: 'ring-green-400',
        radioBorder: '!border-green-700',
      },
      {
        value: 'Sold Out',
        border: 'border-red-400',
        bg: 'bg-red-50',
        hover: 'hover:bg-red-50/50',
        text: '!text-red-700',
        dot: 'bg-red-500',
        ring: 'ring-red-400',
        radioBorder: '!border-red-700',
      },
      {
        value: 'Unavailable',
        border: 'border-gray-300',
        bg: 'bg-gray-50',
        hover: 'hover:bg-gray-50',
        text: '!text-gray-600',
        dot: 'bg-gray-400',
        ring: 'ring-gray-400',
        radioBorder: '!border-gray-600',
      },
    ]



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
    setImages(
      images.map((img) => ({
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

  const addModifierGroup = () => {
    const newModifier: ModifierGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Modifier Group',
      required: false,
    };
    setModifiers([...modifiers, newModifier]);
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
        [data-status="sold-out"] [data-slot="radio-group-indicator"] svg {
          fill: rgb(185, 28, 28) !important;
        }
        [data-status="available"] [data-slot="radio-group-indicator"] svg {
          fill: rgb(21, 128, 61) !important;
        }
        [data-status="unavailable"] [data-slot="radio-group-indicator"] svg {
          fill: rgb(75, 85, 99) !important;
        }
        [data-status="sold-out"] {
          background-color: #fef2f2 !important;
          border-color: #f87171 !important;
        }
        [data-status="available"] {
          background-color: #f0fdf4 !important;
          border-color: #4ade80 !important;
        }
        [data-status="unavailable"] {
          background-color: #f9fafb !important;
          border-color: #d1d5db !important;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-gray-900">Add New Menu Item</h2>
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
              <X className="w-5 h-5" />
            </Button>
          </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - General Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-900 mb-4">General Information</h3>

                  {/* Item Name */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="itemName" className="text-gray-700">
                      Item Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Grilled Salmon"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-300"
                      style={{
                        '--tw-ring-color': BRAND_COLOR,
                      } as React.CSSProperties & { '--tw-ring-color': string }}
                      onFocus={(e) => {
                        e.target.style.borderColor = BRAND_COLOR;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '';
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="description" className="text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your dish, ingredients, and special features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-gray-300 min-h-[120px] resize-none"
                      style={{
                        '--tw-ring-color': BRAND_COLOR,
                      } as React.CSSProperties & { '--tw-ring-color': string }}
                      onFocus={(e) => {
                        e.target.style.borderColor = BRAND_COLOR;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '';
                      }}
                    />
                  </div>

                  {/* Price and Prep Time */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-700">
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
                          className="pl-7 border-gray-300"
                          style={{
                            '--tw-ring-color': BRAND_COLOR,
                          } as React.CSSProperties & { '--tw-ring-color': string }}
                          onFocus={(e) => {
                            e.target.style.borderColor = BRAND_COLOR;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '';
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prepTime" className="text-gray-700">
                        Prep Time (min)
                      </Label>
                      <Input
                        id="prepTime"
                        type="number"
                        min="0"
                        placeholder="15"
                        value={preparationTime}
                        onChange={(e) => setPreparationTime(e.target.value)}
                        className="border-gray-300"
                        style={{
                          '--tw-ring-color': BRAND_COLOR,
                        } as React.CSSProperties & { '--tw-ring-color': string }}
                        onFocus={(e) => {
                          e.target.style.borderColor = BRAND_COLOR;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '';
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="category" className="text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger
                        className="border-gray-300"
                        style={{
                          '--tw-ring-color': BRAND_COLOR,
                        } as React.CSSProperties & { '--tw-ring-color': string }}
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
                          className="text-gray-900 cursor-pointer"
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
                  <div className="space-y-3">
                    <Label className="text-gray-700">Status</Label>
                    <RadioGroup
                      value={status}
                      onValueChange={(value) =>
                        setStatus(value as 'Available' | 'Sold Out' | 'Unavailable')
                      }
                      className="space-y-2"
                    >
                      {STATUS.map((item) => {
                        const selected = status === item.value
                        const isAvailable = item.value === 'Available'
                        const isSoldOut = item.value === 'Sold Out'
                        const isUnavailable = item.value === 'Unavailable'

                        return (
                          <Label
                            key={item.value}
                            htmlFor={`status-${item.value}`}
                            data-status={selected ? (isAvailable ? 'available' : isSoldOut ? 'sold-out' : 'unavailable') : undefined}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                              selected && isAvailable && "!border-green-400 !bg-green-50 ring-1 ring-green-400 !text-green-700",
                              selected && isSoldOut && "!border-red-400 !bg-red-50 ring-1 ring-red-400 !text-red-700",
                              selected && isUnavailable && "!border-gray-300 !bg-gray-50 ring-1 ring-gray-400 !text-gray-600",
                              !selected && "border-gray-200 text-gray-900",
                              !selected && isAvailable && "hover:bg-green-50/50",
                              !selected && isSoldOut && "hover:bg-red-50/50",
                              !selected && isUnavailable && "hover:bg-gray-50"
                            )}
                            style={selected ? {
                              backgroundColor: isAvailable ? '#f0fdf4' : isSoldOut ? '#fef2f2' : '#f9fafb',
                              borderColor: isAvailable ? '#4ade80' : isSoldOut ? '#f87171' : '#d1d5db',
                            } : undefined}
                          >
                            <RadioGroupItem
                              value={item.value}
                              id={`status-${item.value}`}
                              className={cn(
                                selected && isAvailable && "!border-green-700 !text-green-700",
                                selected && isSoldOut && "!border-red-700 !text-red-700",
                                selected && isUnavailable && "!border-gray-600 !text-gray-600",
                                !selected && "border-gray-400 text-gray-600"
                              )}
                            />

                            <span
                              className={cn(
                                "flex-1 font-medium",
                                selected && isAvailable && "!text-green-700",
                                selected && isSoldOut && "!text-red-700",
                                selected && isUnavailable && "!text-gray-600",
                                !selected && "text-gray-900"
                              )}
                            >
                              {item.value}
                            </span>
                            <span className={cn("w-3 h-3 rounded-full", item.dot)} />
                          </Label>
                        )
                      })}
                    </RadioGroup>

                  </div>


                </div>
              </div>

              {/* Right Column - Media & Extras */}
              <div className="space-y-6">
                {/* Photos Section */}
                <div>
                  <h3 className="text-gray-900 mb-4">Photos</h3>

                  {/* Upload Zone */}
                  {/* Upload Zone */}
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                      border: '2px dashed #d1d5db',
                      borderColor: BRAND_COLOR,
                    }}
                    className={`
                    relative z-10
                    flex flex-col items-center justify-center
                    rounded-2xl
                    px-8 py-20 text-center transition-all
                    ${isDragging
                        ? 'bg-green-50 scale-[1.01]'
                        : 'hover:bg-green-50/50'
                      }
                `}
                  >


                    <Upload className="w-20 h-20 mb-6 text-gray-400 mt-2" />

                    <p className="text-2xl font-semibold text-gray-900 mb-1">
                      Drag & drop images here
                    </p>
                    <p className="text-base text-gray-500 mb-6">or</p>

                    <Button
                      type="button"
                      variant="outline"
                      className="px-8 py-2.5 text-base font-medium"
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

                    <p className="text-sm text-gray-500 mt-6 mb-2">
                      PNG, JPG up to 10MB
                    </p>
                  </div>


                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {/* Primary Image */}
                      {images
                        .filter((img) => img.isPrimary)
                        .map((img) => (
                          <div key={img.id} className="relative group">
                            <div
                              className="relative rounded-lg overflow-hidden border-2 cursor-pointer"
                              style={{ borderColor: BRAND_COLOR }}
                            >
                              <img
                                src={img.url}
                                alt="Primary"
                                className="w-full h-48 object-cover"
                              />
                              <div
                                className="absolute top-2 left-2 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                                style={{ backgroundColor: BRAND_COLOR }}
                              >
                                <Star className="w-4 h-4 fill-white" />
                                Primary
                              </div>
                              {/* Delete button in center on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeImage(img.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 text-red-600 w-12 h-12 rounded-full p-0"
                                >
                                  <Trash2 className="w-6 h-6" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Other Images */}
                      {images.filter((img) => !img.isPrimary).length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {images
                            .filter((img) => !img.isPrimary)
                            .map((img) => (
                              <div key={img.id} className="relative group">
                                <div
                                  className="relative rounded-lg overflow-hidden border border-gray-200 transition-colors cursor-pointer"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = BRAND_COLOR;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '';
                                  }}
                                >
                                  <img
                                    src={img.url}
                                    alt="Thumbnail"
                                    className="w-full h-24 object-cover"
                                  />
                                  {/* Overlay with Star and Delete button */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setPrimaryImage(img.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-green-50 w-8 h-8 rounded-full p-0"
                                      style={{ color: BRAND_COLOR }}
                                    >
                                      <Star className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(img.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 text-red-600 w-8 h-8 rounded-full p-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modifiers Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900">Modifiers</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addModifierGroup}
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
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Group
                    </Button>
                  </div>
                  {modifiers.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No modifier groups attached</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Click "Add Group" to attach modifiers like size or toppings
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {modifiers.map((modifier) => (
                        <div
                          key={modifier.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-colors"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = BRAND_COLOR;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                          }}
                        >
                          <div className="flex-1">
                            <p className="text-gray-900">{modifier.name}</p>
                            <p className="text-sm text-gray-500">
                              {modifier.required ? 'Required' : 'Optional'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${BRAND_COLOR}1a`;
                                e.currentTarget.style.color = BRAND_COLOR;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                                e.currentTarget.style.color = '';
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeModifierGroup(modifier.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Example Modifier Groups */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900 mb-2">
                      💡 Example Modifier Groups:
                    </p>
                    <div className="space-y-1 text-sm text-blue-700">
                      <p>• Size (Small, Medium, Large) - Required</p>
                      <p>• Toppings (Extra Cheese, Mushrooms, etc.) - Optional</p>
                      <p>• Cooking Level (Rare, Medium, Well Done) - Required</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex items-center justify-end gap-4 flex-shrink-0">
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

