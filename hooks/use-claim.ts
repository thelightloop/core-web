import { useQuery } from '@tanstack/react-query'
import { claimIntimationApis } from '@/lib/api'

export const claimKeys = {
  all: ['claim'] as const,
  intimation: (id: string) => [...claimKeys.all, 'intimation', id] as const,
}

export function useGetPolicyBasicInfoByDocumentNumber(id: string) {
  return useQuery({
    queryKey: claimKeys.intimation(id),
    queryFn: () => claimIntimationApis.getPolicyBasicInfoByDocumentNumber(id),
    enabled: false, // fired manually via refetch() on search button click
  })
}
