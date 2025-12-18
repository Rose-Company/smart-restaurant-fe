import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Input } from '../../../../components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/forms/select';
import { Switch } from '../../../../components/ui/forms/switch';
import { Slider } from '../../../../components/ui/forms/slider';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/forms/form';

// Validation schema
const addTableSchema = z.object({
  tableNumber: z
    .string()
    .min(2, 'Table number must be at least 2 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Only letters, numbers, and hyphens allowed')
    .trim(),
  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1 person')
    .max(20, 'Capacity cannot exceed 20 people'),
  zone: z.enum(['Main Hall', 'VIP', 'Patio']),
  isActive: z.boolean(),
});

type AddTableFormValues = z.infer<typeof addTableSchema>;

interface AddTableDialogProps {
  onClose: () => void;
  onAdd: (table: {
    tableNumber: string;
    capacity: number;
    zone: string;
    status: 'Active' | 'Inactive';
  }) => void;
}

export function AddTableDialog({ onClose, onAdd }: AddTableDialogProps) {
  const form = useForm<AddTableFormValues>({
    resolver: zodResolver(addTableSchema),
    defaultValues: {
      tableNumber: '',
      capacity: 4,
      zone: 'Main Hall',
      isActive: true,
    },
  });

  const onSubmit = (data: AddTableFormValues) => {
    onAdd({
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      zone: data.zone,
      status: data.isActive ? 'Active' : 'Inactive',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#27ae60] rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-gray-900">Add New Table</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-6">
              {/* Table Name/Number */}
              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Table Name/Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., T-13, VIP-01, P-05"
                        className="mt-2 border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Enter a unique identifier for the table
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity Slider */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-gray-700">
                        Seating Capacity
                      </FormLabel>
                      <span className="text-sm bg-[#2c3e50] text-white px-3 py-1 rounded-full">
                        {field.value} {field.value === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(values: number[]) => field.onChange(values[0])}
                        min={1}
                        max={20}
                        step={1}
                        className="mt-3 [&_[data-slot=slider-range]]:bg-[#27ae60] [&_[data-slot=slider-thumb]]:border-[#27ae60] [&_[data-slot=slider-thumb]]:ring-[#27ae60]/20"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 person</span>
                      <span>20 people</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location/Zone */}
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Location/Zone
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-2 border-gray-300 focus:border-[#27ae60] focus:ring-[#27ae60]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Main Hall">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Main Hall</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="VIP">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>VIP</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Patio">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Patio</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs text-gray-500">
                      Select the dining area where this table is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel className="text-gray-700 cursor-pointer">
                            Table Status
                          </FormLabel>
                          <FormDescription className="text-xs text-gray-500 mt-1">
                            {field.value
                              ? 'Table is active and ready for use'
                              : 'Table is currently inactive'}
                          </FormDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm ${field.value ? 'text-gray-400' : 'text-gray-700'
                              }`}
                          >
                            Inactive
                          </span>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-[#27ae60]"
                            />
                          </FormControl>
                          <span
                            className={`text-sm ${field.value ? 'text-[#27ae60]' : 'text-gray-400'
                              }`}
                          >
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#27ae60] hover:bg-[#229954] text-white shadow-lg shadow-[#27ae60]/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create & Generate QR
              </Button>
            </div>
          </form>
        </Form>

        {/* Info Footer */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-blue-700">
              💡 A unique QR code will be generated automatically for this table after creation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}