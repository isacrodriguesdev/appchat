import { NavigationProp } from "@react-navigation/native";

export interface StateProps {
  attendants: any[]
  departments: any[]
  navigation: NavigationProp<any>
  currentParticipant: any
  route: any
  loadingProcess: boolean
  loadingStart: boolean
  messages: any[]
  selectedOption: string
  imagesList: any[]
  imagesOpened: boolean
}

export interface DispatchProps {
  addContactInOpened(contact: any): void
  addContactInClosed(contact: any): void
  removeContactInPending(contact: any): void
  removeContactInOpened(contact: any): void
  updateReadMessages(data: any): void
  getContacts(selected: string): void
  setMessage(data: any): void
  updateTotalMessages(data: any): void
  resetChat(): void
  updateLoadMessages(data: any): void
  getMessages(data: any): void
  closeImageMessage(): void
  setCurrentParticipant(participant: any): void
  clearTotalMessages(participant: any): void
  removeContactInClosed(contact: any): void
  getDepartments(): void
  getAttendants(departmentId: number): void
}
