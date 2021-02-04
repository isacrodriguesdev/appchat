import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import JwtDecode from 'jwt-decode'
import { put, select } from 'redux-saga/effects'

export function* asyncSetCurrentParticipant(action) {

  const state = yield select()

  if (Object.keys(state.chat.currentParticipant).length === 0) {
    yield put({
      type: 'chat/UPDATE_ACTIVE_PARTICIPANT',
      payload: action.payload
    })
  }
  else if (state.chat.currentParticipant.channel === action.payload.channel) {
    yield put({
      type: 'chat/UPDATE_ACTIVE_PARTICIPANT',
      payload: action.payload
    })
  }
}

export function* asyncGetMessages(action) {

  try {

    const data = {
      contact_id: action.payload.contact_id,
      attendment_id: action.payload.attendment_id,
      page_limit: 25,
      page_offset: 0
    }

    const response = yield axios.post("/messages", data)

    yield put({
      type: 'chat/SUCCESS_GETED_MESSAGES',
      payload: {
        messages: response.data
      },
    })
  } catch (error) {
    yield put({
      type: 'chat/ERROR_GETED_MESSAGES',
      payload: { error: true },
    })
  }
}

export function* asyncUpdateMessage({ payload }) {

  console.log("asyncUpdateMessage", payload.message)
  const state = yield select()

  yield put({
    type: 'chat/SUCCESS_MESSAGE_SENT_SUCCESSFULLY',
    payload: payload.message
  })

  yield put({
    type: "contacts/UPDATED_LAST_MESSAGE",
    payload: {
      list: state.contacts.listOpened.filter(({ contact_id }) => contact_id !== payload.message.contact_id),
      contact: state.contacts.listOpened.filter(({ contact_id }) => contact_id === payload.message.contact_id)[0],
      last_message: payload.message.message,
      last_messageAt: payload.message.created_at,
      last_message_type: payload.message.type
    },
  })
}

export function* asyncSetMessage(action) {

  const state = yield select()

  let payload = {
    id: Date.now(),
    attendment_id: state.chat.currentParticipant.attendment_id,
    branch_id: state.chat.currentParticipant.branch_id,
    contact_id: state.chat.currentParticipant.contact_id,
    channel: state.chat.currentParticipant.channel,
    created_at: new Date(),
    ...action.payload,
  }

  // if (payload.type === "chat")
  //   payload.message = payload.message
  // else if (["image"].includes(payload.type) || payload.type.split("/")[0] === "image")
  //   payload.message = "Você recebeu uma imagem"
  // else if (["ptt", "audio"].includes(payload.type) || payload.type.split("/")[0] === "audio")
  //   payload.message = "Mensagem de voz"
  // else if (payload.type.split("/"))
  //   payload.message = "Você recebeu um documento"
  // else
  //   payload.message = payload.message

  yield put({
    type: 'chat/SUCCESS_UPDATED_MESSAGES',
    payload: [payload, ...state.chat.messages],
  })

  yield put({
    type: "contacts/UPDATED_LAST_MESSAGE",
    payload: {
      list: state.contacts.listOpened.filter(({ contact_id }) => contact_id !== payload.contact_id),
      contact: state.contacts.listOpened.filter(({ contact_id }) => contact_id === payload.contact_id)[0],
      last_message: payload.message,
      last_messageAt: payload.created_at,
      last_message_type: payload.type
    },
  })
}


export function* asyncUpdateLoadMessages(action) {

  const state = yield select()

  try {

    const response = yield axios.post("/messages", {
      contact_id: action.payload.contact_id,
      attendment_id: action.payload.attendment_id,
      page_limit: action.payload.page_limit,
      page_offset: action.payload.page_offset
    })

    response.data = response.data.sort((a, b) => {
      return a.created_at < b.created_at
    })

    yield put({
      type: 'chat/SUCCESS_UPDATED_LOAD_MESSAGES',
      payload: {
        messages: [...state.chat.messages, ...response.data]
      },
    })
  } catch (error) {
    yield put({
      type: 'chat/ERROR_GETED_MESSAGES',
      payload: { error: true },
    })
  }
}

export function* asyncUpdateReadMessages({ payload }) {

  const state = yield select()
  let allContacts = [...state.contacts.listOpened, ...state.contacts.listPending, ...state.contacts.listClosed]

  let contact = allContacts.filter((opened) => {
    return opened.contact_id === payload.contact_id
  })[0]

  try {

    yield put({
      type: "contacts/UPDATED_STATUS",
      payload: {
        list: allContacts.filter(({ contact_id }) => contact_id !== payload.contact_id),
        contact: allContacts.filter((opened) => {
          return opened.contact_id === payload.contact_id
        })[0],
        last_message: contact.last_message ? contact.last_message : "",
        last_messageAt: payload.created_at
      },
    })

    // @reative

    yield axios.put("/messages", {
      contact_id: payload.contact_id,
      attendment_id: payload.attendment_id
    })

  } catch (error) {
    console.log(error)
  }

}
