import { http } from "../../utils/axious/useAxios"
import { ClaimIntimationDto } from "../../interface/claim/claimintimation"

export const claimIntimationApis = {
  //for basic info for policy detail section before intimate
  getPolicyBasicInfoByDocumentNumber: async (documentNumber: string) => {
    const { data } = await http.get<unknown>(
      `/api/UnderwritingDataForIntimation/GetPolicyBasicInfoByDocumentNumber`,
      { params: { documentNumber } }
    )
    return data
  },
  //for full info for claim intimation
  getPolicyDetailForIntimation: async (documentNumber: string) => {
    const { data } = await http.get<unknown>(
      `/api/UnderwritingDataForIntimation/GetPolicyDetailForIntimation`,
      { params: { documentNumber } }
    )
    return data
  },
  createIntimation: async (dto: ClaimIntimationDto) => {
    const { data } = await http.post<unknown>(
      `/api/ClaimIntimation/CreateIntimation`,
      dto
    )
    return data
  },
}


