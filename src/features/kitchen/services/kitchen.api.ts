import { KitchenOrdersResponse, BulkUpdateItemStatusResponse, UpdateOrderStatusResponse, OrderDetailResponse } from '../types/kitchen.types';
import { fetcher } from '../../../lib/fetcher';

type KitchenOrdersParams = {
	page?: number;
	page_size?: number;
	table_id?: number;
	sort?: string;
	category?: string;
};

export const kitchenApi = {
	list: (params?: KitchenOrdersParams) => {
		const query = new URLSearchParams(
			Object.entries(params || {}).reduce(
				(acc, [k, v]) =>
					v !== undefined && v !== '' && v !== 'all'
						? { ...acc, [k]: String(v) }
						: acc,
				{}
			)
		).toString();

		const url = `/orders${query ? `?${query}` : ''}`;
		return fetcher<KitchenOrdersResponse>(url);
	},

	detail: async (orderId: string | number) => {
		const response = await fetcher<OrderDetailResponse>(`/orders/${orderId}`);
		return response.data || response;
	},

	updateStatus: async (orderId: string | number, status: string) => {
		const response = await fetcher<UpdateOrderStatusResponse>(`/orders/${orderId}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ status }),
		});
		return response.data || response;
	},

	markItemDone: async (orderId: string | number, itemId: string | number) => {
		const response = await fetcher(`/orders/${orderId}/items/${itemId}`, {
			method: 'PATCH',
			body: JSON.stringify({ status: 'done' }),
		});
		return response.data || response;
	},

	bulkUpdateItemStatus: async (orderIds: number[], status: string) => {
		const response = await fetcher<BulkUpdateItemStatusResponse>('/orders/items/status', {
			method: 'PATCH',
			body: JSON.stringify({ order_ids: orderIds, status }),
		});
		return response.data || response;
	},
};
