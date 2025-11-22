import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../api/client';
import { ORDER_STATUSES } from '../constants/order';

export function useOrderTracking(orderId: string | undefined) {
  const [pollingInterval, setPollingInterval] = useState(3000);

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');

      const response = await fetchClient.GET('/api/v1/orders/{id}/customer-view', {
        params: { path: { id: orderId } },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch order');
      }

      return response.data;
    },
    enabled: !!orderId,
    refetchInterval: pollingInterval,
  });

  useEffect(() => {
    if (data?.status) {
      if (data.status === ORDER_STATUSES.PLACED) {
        setPollingInterval(3000);
      } else if (data.status === ORDER_STATUSES.ACCEPTED) {
        setPollingInterval(30000);
      } else if (
        data.status === ORDER_STATUSES.COMPLETED ||
        data.status === ORDER_STATUSES.CANCELLED
      ) {
        setPollingInterval(0);
      } else {
        setPollingInterval(15000);
      }
    }
  }, [data?.status]);

  return { data, isLoading, error };
}
