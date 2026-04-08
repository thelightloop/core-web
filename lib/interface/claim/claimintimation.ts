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
  dateOfLoss: string
  causeOfLoss: string
  placeOfLoss: string
  estimatedLoss: string
  description: string
  contactPerson: string
  contactNumber: string
  relationship: string
}