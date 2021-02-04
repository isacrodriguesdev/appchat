
export interface Message {
  id: number
  attendant_id: number
  attendment_id: number
  branch_id: number
  channel: string
  contact_id: number
  message: string
  sender: "attendant" | "client" | "system"
  created_at: Date
  type: string
  file?: string
  file_duration?: number
  hash?: string
}

export interface ChatState {
  currentParticipant: any
  messages: Message[]
  imagesList: any[]
  imagesOpened: boolean
  error: boolean
  loadingStart: boolean
  loadingProcess: boolean
}