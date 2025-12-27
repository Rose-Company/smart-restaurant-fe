import { fetcher } from "../../../../lib/fetcher";
import type { ModifierGroup, ModifierOption } from "../types/modifier.types";

export interface ModifierGroupResponse {
  id: number;
  name: string;
  description: string;
  selection_type: "Single Select" | "Multi Select";
  requirement: "Required" | "Optional";
  options?: ModifierOptionResponse[];
}

export interface ModifierOptionResponse {
  id: number;
  name: string;
  price_adjustment: number;
}

export interface CreateModifierGroupRequest {
  name: string;
  description: string;
  selection_type: "Single Select" | "Multi Select";
  requirement: "Required" | "Optional";
}

export interface UpdateModifierGroupRequest {
  name?: string;
  description?: string;
  selection_type?: "Single Select" | "Multi Select";
  requirement?: "Required" | "Optional";
}

export interface CreateModifierOptionRequest {
  name: string;
  price_adjustment: number;
}

export interface UpdateModifierOptionRequest {
  name?: string;
  price_adjustment?: number;
}

function mapModifierGroupResponseToModifierGroup(response: ModifierGroupResponse): ModifierGroup {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    selectionType: response.selection_type,
    requirement: response.requirement,
    options: response.options?.map(opt => ({
      id: String(opt.id),
      name: opt.name,
      priceAdjustment: opt.price_adjustment,
    })) || [],
  };
}

export const modifierGroupApi = {
  list: async (): Promise<ModifierGroup[]> => {
    const response = await fetcher<ModifierGroupResponse[]>("/admin/menu/modifier-groups");
    return response.map(mapModifierGroupResponseToModifierGroup);
  },

  create: async (data: CreateModifierGroupRequest): Promise<ModifierGroup> => {
    const response = await fetcher<ModifierGroupResponse>("/admin/menu/modifier-groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return mapModifierGroupResponseToModifierGroup(response);
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
    const response = await fetcher<ModifierOptionResponse>(
      `/admin/menu/modifier-groups/${groupId}/options`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return {
      id: String(response.id),
      name: response.name,
      priceAdjustment: response.price_adjustment,
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
    };
  },

  deleteOption: async (optionId: number): Promise<void> => {
    await fetcher(`/admin/menu/modifier-options/${optionId}`, {
      method: "DELETE",
    });
  },
};

