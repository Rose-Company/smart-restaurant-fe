import { fetcher } from "../../../../lib/fetcher";
import type { ModifierGroup, ModifierOption } from "../types/modifier.types";

export interface ModifierGroupResponse {
  id: number;
  name: string;
  description: string;
  selection_type: "single" | "multiple";
  is_required: boolean;
  status: "active" | "inactive";
  options?: ModifierOptionResponse[];
}

export interface ModifierOptionResponse {
  id: number;
  name: string;
  price_adjustment: number;
  status: "active" | "inactive";
}

export interface CreateModifierGroupRequest {
  name: string;
  description: string;
  selection_type: "single" | "multiple";
  is_required: boolean;
  status: "active" | "inactive";
}

export interface UpdateModifierGroupRequest {
  name?: string;
  description?: string;
  selection_type?: "single" | "multiple";
  is_required?: boolean;
  min_selections?: number;
  max_selections?: number;
  display_order?: number;
  status?: "active" | "inactive";
}

export interface CreateModifierOptionRequest {
  name: string;
  price_adjustment: number;
  status: "active" | "inactive";
}

export interface UpdateModifierOptionRequest {
  name?: string;
  price_adjustment?: number;
  status?: "active" | "inactive";
}

function mapModifierGroupResponseToModifierGroup(response: ModifierGroupResponse): ModifierGroup {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    selectionType: response.selection_type,
    is_required: response.is_required,
    status: response.status,
    options: response.options?.map(opt => ({
      id: String(opt.id),
      name: opt.name,
      priceAdjustment: opt.price_adjustment,
      status: opt.status,
    })) || [],
  };
}

export const modifierGroupApi = {
  list: async (): Promise<ModifierGroup[]> => {
    const response = await fetcher<any>("/admin/menu/modifier-groups");
    return response.data.items.map((modifierGroup) => mapModifierGroupResponseToModifierGroup(modifierGroup));
  },

  create: async (data: CreateModifierGroupRequest): Promise<ModifierGroup> => {
    const response = await fetcher<any>("/admin/menu/modifier-groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log('[modifierGroupApi] create response:', response);
    const modifierGroup = response.data || response;
    console.log('[modifierGroupApi] mapped group:', modifierGroup);
    return mapModifierGroupResponseToModifierGroup(modifierGroup);
  },

  update: async (id: number, data: UpdateModifierGroupRequest): Promise<ModifierGroup> => {
    const response = await fetcher<ModifierGroupResponse>(`/admin/menu/modifier-groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return mapModifierGroupResponseToModifierGroup(response);
  },

  delete: async (id: number): Promise<void> => {
    await fetcher(`/admin/menu/modifier-groups/${id}`, {
      method: "DELETE",
    });
  },

  addOption: async (groupId: number, data: CreateModifierOptionRequest): Promise<ModifierOption> => {
    if (!data.name || !data.name.trim()) {
      throw new Error('Option name is required');
    }
    if (!data.status || (data.status !== 'active' && data.status !== 'inactive')) {
      throw new Error('Option status must be "active" or "inactive"');
    }
    
    const requestData: CreateModifierOptionRequest = {
      name: data.name.trim(),
      price_adjustment: data.price_adjustment || 0,
      status: data.status,
    };
    
    console.log('[modifierGroupApi] addOption request:', requestData);
    
    const response = await fetcher<ModifierOptionResponse>(
      `/admin/menu/modifier-groups/${groupId}/options`,
      {
        method: "POST",
        body: JSON.stringify(requestData),
      }
    );
    return {
      id: String(response.id),
      name: response.name,
      priceAdjustment: response.price_adjustment,
      status: response.status,
    };
  },

  updateOption: async (optionId: number, data: UpdateModifierOptionRequest): Promise<ModifierOption> => {
    const response = await fetcher<ModifierOptionResponse>(
      `/admin/menu/modifier-options/${optionId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return {
      id: String(response.id),
      name: response.name,
      priceAdjustment: response.price_adjustment,
      status: response.status,
    };
  },

  deleteOption: async (optionId: number): Promise<void> => {
    await fetcher(`/admin/menu/modifier-options/${optionId}`, {
      method: "DELETE",
    });
  },
};


