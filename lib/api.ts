import { http } from "./useAxios"

export const claimIntimationApis = {
  //for basic info for policy detail section before intimate
  getPolicyBasicInfoByDocumentNumber: async (documentNumber: string) => {
    const { data } = await http.get<unknown>(
      `/api/ClaimIntimation/GetPolicyBasicInfoByDocumentNumber`,
      { params: { documentNumber } }
    )
    return data
  },
  //for full info for claim intimation
  getPolicyDetailForIntimation: async (documentNumber: string) => {
    const { data } = await http.get<unknown>(
      `/api/ClaimIntimation/GetPolicyDetailForIntimation`,
      { params: { documentNumber } }
    )
    return data
  },
}


