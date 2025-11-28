import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../api/client';

export function useBills(params: { statuses?: ('OPEN' | 'CLOSED')[] } = {}) {
  return $api.useQuery('get', '/api/v1/bills', {
    params: {
      query: {
        statuses: params.statuses,
        sortDirection: 'DESC',
        sortBy: 'OPENED_AT',
        size: 100,
      },
    },
  });
}

export function useBill(id: string) {
  return $api.useQuery('get', '/api/v1/bills/{id}', {
    params: {
      path: { id },
    },
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = $api.useMutation('post', '/api/v1/bills/open', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/bills'] });
    },
  });

  return { mutateAsync, ...rest };
}

export function useCloseBill() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = $api.useMutation('post', '/api/v1/bills/{id}/close', {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get', '/api/v1/bills'] });
      queryClient.invalidateQueries({
        queryKey: [
          'get',
          '/api/v1/bills/{id}',
          { params: { path: { id: variables.params.path.id } } },
        ],
      });
    },
  });

  return { mutateAsync, ...rest };
}

export function useRemoveItem() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = $api.useMutation('post', '/api/v1/bills/{id}/remove-items', {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'get',
          '/api/v1/bills/{id}',
          { params: { path: { id: variables.params.path.id } } },
        ],
      });
    },
  });

  return { mutateAsync, ...rest };
}
