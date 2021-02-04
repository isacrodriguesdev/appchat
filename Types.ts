
export interface UseAuthProps {
  socket: SocketIOClient.Socket
  logout(): void
  singIn(login: string, password: string): void
  signed: boolean
  error: string | null
  user: any
  decoded: any
}

export interface Action {
  type: string
  payload: any
}