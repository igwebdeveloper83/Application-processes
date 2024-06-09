export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  steps?: IStep[]
  result?: 'Reject' | 'Offer'
}

export interface IStep {
  name: string
  date: null | Date
  comment: string
}
