import axios from 'axios'
import { Message } from 'global'
import { call, put, select } from 'redux-saga/effects'
import { Action } from 'Types'
import LastMessageController from '~/controllers/LastMessageController'

export function* asyncGetContactsOpen() {
  try {

    const response = yield axios.post("/attendments", {
      selected: "open",
      page_limit: 10,
      page_offset: 0
    })

    yield put({
      type: "contacts/SUCCESS_GETED_CONTACTS_OPEN",
      payload: response.data
    })

  } catch (error) {
    console.log(error)
  }
}

export function* asyncGetContactsPending() {
  try {
    const response = yield axios.post("/attendments", {
      selected: "pending",
      page_limit: 10,
      page_offset: 0,
    })

    yield put({
      type: "contacts/SUCCESS_GETED_CONTACTS_PENDING",
      payload: response.data
    })

  } catch (error) {
    console.log(error)
  }
}


export function* asyncGetContactsClosed() {
  try {
    const response = yield axios.post("/attendments", {
      selected: "close",
      page_limit: 10,
      page_offset: 0,
    })

    yield put({
      type: "contacts/SUCCESS_GETED_CONTACTS_CLOSED",
      payload: response.data
    })

  } catch (error) {
    console.log(error)
  }
}

export function* asyncUpdateContactsOpened(action: Action) {
  const state = yield select()

  try {
    yield put({
      type: "contacts/UPDATED_CONTACTS_OPENED",
      payload: [...state.contacts.listOpened, action.payload],
    })
  } catch (error) {
    console.log(error)
  }
}

export function* asyncaddContactInPending(action: Action) {

  const state = yield select()

  try {

    yield put({
      type: "contacts/REMOVE_CONTACTS_CLOSED",
      payload: [...state.contacts.listClosed, action.payload],
      contact_id: action.payload.contact_id
    })

    yield put({
      type: "contacts/UPDATED_CONTACTS_PENDING",
      payload: [...state.contacts.listPending, action.payload],
    })

  } catch (error) {
    console.log(error)
  }
}

export function* asyncUpdateContactsClosed(action: Action) {
  const state = yield select()
  try {
    yield put({
      type: "contacts/UPDATED_CONTACTS_CLOSED",
      payload: [...state.contacts.listClosed, action.payload],
    })
  } catch (error) {
    console.log(error)
  }
}

export function* asyncUpdateLoadContacts(action: Action) {

  const state = yield select()

  try {

    const response = yield axios.post("/attendments", {
      page_limit: action.payload.page_limit,
      page_offset: action.payload.page_offset,
      selected: action.payload.selected
    })

    yield put({
      type: 'contacts/SUCCESS_UPDATED_LOAD_CONTACTS',
      payload: {
        users: [...state.contacts.users, ...response.data]
      },
    })
  } catch (error) {
    yield put({
      type: 'chat/ERROR_UPDATED_LOAD_CONTACTS',
      payload: { error: true },
    })
  }
}

export function* asyncRemoveContactOpened(action: Action) {
  const state = yield select()
  try {
    yield put({
      type: "contacts/REMOVE_CONTACTS_OPENED",
      payload: [...state.contacts.listOpened, action.payload],
      contact_id: action.payload.contact_id
    })
  } catch (error) {
    console.log(error)
  }
}
export function* asyncremoveContactInPending(action: Action) {
  const state = yield select()
  try {
    yield put({
      type: "contacts/REMOVE_CONTACTS_PENDING",
      payload: [...state.contacts.listPending, action.payload],
      contact_id: action.payload.contact_id
    })
  } catch (error) {
    console.log(error)
  }
}
export function* asyncRemoveContactClosed(action: Action) {
  const state = yield select()
  try {
    yield put({
      type: "contacts/REMOVE_CONTACTS_CLOSED",
      payload: [...state.contacts.listClosed, action.payload],
      contact_id: action.payload.contact_id
    })
  } catch (error) {
    console.log(error)
  }
}

export function* asyncUpdateStatus(action: Action) {

  const state = yield select()
  let payload = action.payload
  const Message = new LastMessageController(payload)

  payload.last_message = Message.text

  try {
    yield put({
      type: "contacts/UPDATED_STATUS",
      payload: {
        list: state.contacts.listOpened.filter(({ contact_id }: any) => contact_id !== payload.contact_id),
        contact: state.contacts.listOpened.filter(({ contact_id }: any) => contact_id === payload.contact_id)[0],
        last_message: payload.last_message,
        last_messageAt: payload.created_at
      },
    })

  } catch (error) {
    console.log(error)
  }
}

// contacts/ASYNC_UPDATED_SELECTED_OPTION