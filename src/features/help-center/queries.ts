import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getHelpCenters,
  updateHelpCenter
} from './services';

import type {
  HelpCenter,
  HelpCenterDetail,
  HelpCenterMutationResponse,
  HelpCenterListResponse,
  HelpCenterFormData
} from './types';

interface HelpCenterQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  status?: boolean;
}

export const HelpCenterKeys = {
  all: ['help-center'] as const,
  list: (params: HelpCenterQueryParams) => [...HelpCenterKeys.all, 'list', params] as const,
  detail: (id: string) => [...HelpCenterKeys.all, 'detail', id] as const,
};

export function useHelpCenters(params: HelpCenterQueryParams) {
  return useQuery<HelpCenterListResponse, Error>({
    queryKey: HelpCenterKeys.list(params),
    queryFn: () => getHelpCenters(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useUpdateHelpCenter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<HelpCenter> }) =>
      updateHelpCenter(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: HelpCenterKeys.all, exact: false });
      toast.success('Help center berhasil diubah');
    },
    onError: () => {
      toast.error('Gagal mengubah Help center');
    },
  });
}
