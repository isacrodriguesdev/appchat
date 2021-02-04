import { Message, ChatState } from "global"
import { Action } from "../../../Types"

const initialState: ChatState = {
  currentParticipant: {},
  messages: [],
  imagesList: [],
  imagesOpened: false,
  error: false,
  loadingStart: false,
  loadingProcess: false
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'chat/UPDATE_ACTIVE_PARTICIPANT':
      return {
        ...state,
        currentParticipant: action.payload,
      }
    case 'chat/SUCCESS_MESSAGE_SENT_SUCCESSFULLY':
      return {
        ...state,
        messages: state.messages.map((message: Message) => {
          if (message.hash === action.payload.hash) {
            return { ...action.payload, sending: false }
          }
          return message
        }),
        loadingStart: false,
        loadingProcess: false,
        error: false,
      }
    case 'chat/REQUEST_GETED_MESSAGES':
      return {
        ...state,
        error: false,
        loadingStart: true
      }
    case 'chat/SUCCESS_GETED_MESSAGES':
      return {
        ...state,
        messages: action.payload.messages.sort((a: any, b: any) => a.id < b.id),
        error: false,
        loadingStart: false
      }
    case 'chat/ERROR_GETED_MESSAGES':
      return {
        ...state,
        error: action.payload.error,
        loadingStart: false,
      }
    case 'chat/REQUEST_UPDATED_LOAD_MESSAGES':
      return {
        ...state,
        loadingProcess: true,
        error: false,
      }
    case 'chat/SUCCESS_UPDATED_LOAD_MESSAGES':
      return {
        ...state,
        messages: action.payload.messages,
        error: false,
        loadingProcess: false
      }
    case 'chat/SUCCESS_UPDATED_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        error: false,
        loadingProcess: false,
      }
    case 'chat/ADD_LIST_IMAGE_MESSAGE':
      return {
        ...state,
        imagesList: [...new Map([
          action.payload, ...state.imagesList.sort((a: Message, b: Message) => a.created_at < b.created_at ? 1 : -1)
        ].map(item => [item.id, item])).values()]
      }
    case 'chat/OPEN_LIST_IMAGE_MESSAGE':
      return {
        ...state,
        imagesOpened: true,
      }
    case 'chat/CLOSE_LIST_IMAGE_MESSAGE':
      return {
        ...state,
        imagesOpened: false,
      }
    case 'chat/RESET_CHAT':
      return initialState
    default:
      return state
  }
}

// UPDATE_ACTIVE_PARTICIPANT
export function setCurrentParticipant(participant: any, serviceStatus: string) {
  return {
    type: 'chat/ASYNC_SET_CURRENT_PARTICIPANT',
    payload: { ...participant, serviceStatus },
  }
}

export function addImageMessage(item: any) {
  return {
    type: 'chat/ADD_LIST_IMAGE_MESSAGE',
    payload: item,
  }
}

export function openImageMessage() {
  return {
    type: 'chat/OPEN_LIST_IMAGE_MESSAGE',
  }
}

export function closeImageMessage() {
  return {
    type: 'chat/CLOSE_LIST_IMAGE_MESSAGE',
  }
}

export function getMessages(data: any) {
  return {
    type: 'chat/REQUEST_GETED_MESSAGES',
    payload: data,
  }
}

export function setMessage(message: Message) {
  return {
    type: 'chat/REQUEST_UPDATED_MESSAGES',
    payload: message,
  }
}

export function updateMessage(response: any) {
  return {
    type: 'chat/REQUEST_MESSAGE_SENT_SUCCESSFULLY',
    payload: {
      message: response
    },
  }
}

export function updateLoadMessages(data: any) {
  return {
    type: 'chat/REQUEST_UPDATED_LOAD_MESSAGES',
    payload: data
  }
}

export function updateReadMessages(data: any) {
  return {
    type: 'chat/REQUEST_UPDATED_READ_MESSAGES',
    payload: data
  }
}

export function resetChat() {
  return {
    type: 'chat/RESET_CHAT',
  }
}