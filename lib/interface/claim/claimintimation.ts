export interface PolicyResult {
  policyNumber: string
  documentNumber: string
  effectiveDate: string
  expiryDate: number
  insuredPartyName: string
  branchCode: string
  documentType: number
  status: boolean
  riskTypeSelected: string,
  class: string,
  classId: string,
  sumInsured: number,
  
}
export interface IntimationForm {
  // Party
  partyType: 'Individual' | 'Corporate'
  partyName: string
  email: string

  // Intimation dates
  intimationDate: string
  intimationDateNepali: string
  intimationTime: string
  intimationReceivedDate: string
  intimationReceivedDateNepali: string
  intimationSource: string
  intimatedBy: string
  contactNumber: string
  estimatedLoss: string
  advises: string[]

  // Motor form
  bypassOccuranceDateValidation: boolean
  occuranceDate: string
  occuranceDateNepali: string
  natureLoss: string
  incidentReason: string
  damageExtend: string
  province: string
  district: string
  municipality: string
  ward: string
  nepalStreet: string
  vehicleModel: string
  subModel: string
  chasisNumber: string
  engineNumber: string
  registrationNumber: string
  manufactureYear: string
  isBasicRecovery: boolean
  isConstructiveLoss: boolean
  isCashLoss: boolean
  isTotalClaimLoss: boolean
  isTheft: boolean
  isKfkTraced: boolean
  isKfkNotTraced: boolean
  isKnockForKnock: boolean
  isKnockForKnockIn: boolean | null
  kfkRemarks: string
  kfkReferenceNumber: string
  assignedUser: string
}
export interface ClaimIntimationDto {
  policyNumber: string
  documentNumber: string
  policyIssuanceId?: string
  classId?: string
  partyCode?: string
  typeOfParty: 'Individual' | 'Corporate'
  partyName: string
  partyEmail?: string
  partyPhone?: string
  partyAddress?: string
  effectiveDate?: string
  expiryDate?: string
  intimationDate: string
  intimationDateNepali?: string
  intimationTime?: string
  intimationNumber?: string
  intimatedBy: string
  intimationSource: string
  contactNumber: string
  numberOfClaimants?: number
  estimatedLoss?: number
  branchCode: string
  policyBranchCode?: string
  uwYear?: string
  claimYear?: string
  sumInsured?: number
  isCashLossBasis?: boolean
  isTheft?: boolean
  isTotalLoss?: boolean
  isCashLessPolicy?: boolean
  isIndividual?: boolean
  assignedId?: string
  assignedFullName?: string
  hospitalTitle?: string
  isKnockForKnock?: boolean
  isKnockForKnockIn?: boolean
  kfkRemarks?: string
  advise?: string
  companyReferenceNumber?: string
  riskTypeSelected?: string
  portfolio?: string
  claimantIntimatedJson?: string
}