import { DocumentPickerResponse } from "react-native-document-picker";

interface SendMessageFile {
  context: {
    user: any
    decoded: any
    socket: SocketIOClient.Socket
  },
  currentParticipant: any
  document: DocumentPickerResponse
  file: string
  message: any
  hash: string
  duration?: number
}

interface SendMessageText {
  context: {
    user: any
    decoded: any
    socket: SocketIOClient.Socket
  },
  currentParticipant: any
}

export function sendMessageFile({ context, currentParticipant, document, file, message, hash, duration }: SendMessageFile) {

  let content: any = {
    sender: {
      name: context.user.userName,
      number: context.decoded.branchNumber,
    },
    participant: {
      number: currentParticipant.number
    },
    file: {
      name: document.name,
      data: `data:${document.type};base64,${file}`,
      file: file,
      hash
    },
    message: {
      attendment_id: currentParticipant.id,
      contact_id: currentParticipant.contact_id,
      channel: currentParticipant.channel,
      attendant_id: context.user.id,
      branch_id: context.decoded.branchId,
      message: message.trimStart() ? message.trimStart() : document.name,
      type: document.type,
      sender: "attendant",
    }
  }

  if(duration)
    content.message.file_duration = duration / 1000

  context.socket.emit("send_message_app", content)

}

function messageMe(params: any) {

  params.context.socket.emit("send_message_app", {
    sender: {
      name: params.context.user.name,
      number: params.context.decoded.branchNumber,
    },
    participant: {
      number: params.currentParticipant.number,
      name: params.currentParticipant.name
    },
    message: {
      attendment_id: params.currentParticipant.id,
      contact_id: params.currentParticipant.contact_id,
      channel: params.currentParticipant.channel,
      attendant_id: params.context.user.id,
      branch_id: params.context.decoded.branchId,
      type: 'chat',
      message: params.message,
      sender: "attendant",
    }
  })
}

function messageBoot(params: any) {

  params.context.socket.emit("send_message_app", {
    sender: {
      name: params.context.user.name,
      number: params.context.decoded.branchNumber,
    },
    participant: {
      number: params.currentParticipant.number,
      name: params.currentParticipant.name
    },
    message: {
      attendment_id: params.currentParticipant.id,
      contact_id: params.currentParticipant.contact_id,
      channel: params.currentParticipant.channel,
      attendant_id: params.context.user.id,
      branch_id: params.context.decoded.branchId,
      type: 'chat',
      message: params.message,
      sender: "system",
    }
  })
}

export function sendMessageText(params: SendMessageText) {

  return {
    me(message: string) {
      message = message.trimStart()
      messageMe({...params, message})
    },
    boot(message: string) {
      message = message.trimStart()
      messageBoot({...params, message})
    }
  }
}