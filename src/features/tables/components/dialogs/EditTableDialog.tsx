import { useForm } from 'react-hook-form';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { Button } from '../../../../components/ui/misc/button';
import { Input } from '../../../../components/ui/forms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/forms/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/forms/form';
import type { Table } from '../../types/table.types';

// Validation schema
const editTableSchema = z.object({
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
  status: z.enum(['Active', 'Occupied', 'Inactive']),
});

type EditTableFormValues = z.infer<typeof editTableSchema>;

interface EditTableDialogProps {
  table: Table;
  onClose: () => void;
  onSave: (table: Table) => void;
}

export function EditTableDialog({ table, onClose, onSave }: EditTableDialogProps) {
  const form = useForm<EditTableFormValues>({
    resolver: zodResolver(editTableSchema),
    defaultValues: {
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      zone: table.zone as 'Main Hall' | 'VIP' | 'Patio',
      status: table.status,
    },
  });

  const onSubmit = (data: EditTableFormValues) => {
    // Create updated table object
    const updatedTable: Table = {
      ...table,
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      zone: data.zone,
      status: data.status,
    };

    // If changing to Occupied status and no order data exists, add mock data
    if (data.status === 'Occupied' && !updatedTable.orderData) {
      updatedTable.orderData = {
        activeOrders: 1,
        totalBill: 0,
      };
    }

    // If changing to Active or Inactive, remove order data
    if (data.status !== 'Occupied') {
      delete updatedTable.orderData;
    }

    onSave(updatedTable);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Edit Table</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-4">
              {/* Table Number */}
              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="mt-1.5"
                        placeholder="e.g., T-01, VIP-01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="20"
                        className="mt-1.5"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Zone */}
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Main Hall">Main Hall</SelectItem>
                        <SelectItem value="VIP">VIP</SelectItem>
                        <SelectItem value="Patio">Patio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#27ae60] hover:bg-[#229954] text-white"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}