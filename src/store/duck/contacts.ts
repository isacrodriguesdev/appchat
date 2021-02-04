import { Action } from "../../../Types"

const initialState = {
  listOpened: [],
  listPending: [],
  listClosed: [],
  profileImage: {
    show: false,
    uri: ""
  },
  error: null,
  loading: true,
  selectedOption: "open"
}

export default function reducer(state = initialState, action: Action) {

  const { type, payload } = action

  switch (type) {
    case "contacts/OPENED_IMAGE_CONTACT":
      return {
        ...state,
        profileImage: payload
      }
    case "contacts/REQUEST_GETED_CONTACTS_OPEN":
      return {
        ...state,
        loading: true
      }
    case "contacts/SUCCESS_GETED_CONTACTS_OPEN":
      return {
        ...state,
        loading: false,
        listOpened: payload.sort((a: any, b: any) => {
          return new Date(a.last_message_at).getTime() > new Date(b.last_message_at).getTime() ? -1 : 1
        })
      }

    case "contacts/REQUEST_GETED_CONTACTS_PENDING":
      return {
        ...state,
        loading: true
      }
    case "contacts/SUCCESS_GETED_CONTACTS_PENDING":
      return {
        ...state,
        loading: false,
        listPending: payload.sort((a: any, b: any) => a.last_message_at === b.last_message_at)
      }

    case "contacts/REQUEST_GETED_CONTACTS_CLOSED":
      return {
        ...state,
        loading: true
      }
    case "contacts/SUCCESS_GETED_CONTACTS_CLOSED":
      return {
        ...state,
        loading: false,
        listClosed: payload.sort((a: any, b: any) => a.last_message_at === b.last_message_at)
      }

    case "contacts/UPDATED_CONTACTS_OPENED":
      return {
        ...state,
        listOpened: payload.sort((a: any, b: any) => a.last_message_at === b.last_message_at),
      }
    case "contacts/UPDATED_CONTACTS_PENDING":
      return {
        ...state,
        listPending: payload.sort((a: any, b: any) => a.last_message_at === b.last_message_at),
      }
    case "contacts/UPDATED_CONTACTS_CLOSED":
      return {
        ...state,
        listClosed: payload.sort((a: any, b: any) => a.last_message_at === b.last_message_at),
      }

    case "contacts/REMOVE_CONTACTS_OPENED":
      return {
        ...state,
        // @ts-ignore
        listOpened: state.listOpened.filter((user: any) => user.contact_id !== action.contact_id),
      }
    case "contacts/REMOVE_CONTACTS_PENDING":
      return {
        ...state,
        // @ts-ignore
        listPending: state.listPending.filter((user: any) => user.contact_id !== action.contact_id),
      }
    case "contacts/REMOVE_CONTACTS_CLOSED":
      return {
        ...state,
        // @ts-ignore
        listClosed: state.listClosed.filter((user: any) => user.contact_id !== action.contact_id)
      }

    case 'contacts/REQUEST_UPDATED_LOAD_CONTACTS':
      return {
        ...state,
        loading: true,
        error: false,
      }

    case 'contacts/SUCCESS_UPDATED_LOAD_CONTACTS':
      return {
        ...state,
        users: action.payload.users,
        error: false,
        loading: false
      }
    case "contacts/UPDATED_LAST_MESSAGE":
      return {
        ...state,
        listOpened: [
          {
            ...payload.contact,
            unread_messages: payload.contact.unread_messages += 1,
            last_message: payload.last_message,
            last_message_at: payload.last_messageAt,
            last_message_type: payload.last_message_type
          },
          ...payload.list,
        ]
      }
    case "contacts/UPDATED_STATUS":
      return {
        ...state,
        listOpened: state.listOpened.map((user: any) => {
          return user.contact_id === action.payload.contact.contact_id ? {
            ...user,
            unread_messages: 0,
            last_message: payload.last_message,
            last_message_at: payload.last_messageAt
          } : user
        })
      }
    default:
      return state
  }
}

// GET
export function getContactsOpen() {
  return {
    type: "contacts/REQUEST_GETED_CONTACTS_OPEN",
  }
}
export function getContactsPending() {
  return {
    type: "contacts/REQUEST_GETED_CONTACTS_PENDING",
  }
}
export function getContactsClosed() {
  return {
    type: "contacts/REQUEST_GETED_CONTACTS_CLOSED",
  }
}

// UPDATE
export function addContactInOpened(contact: any) {
  return {
    type: "contacts/ASYNC_UPDATED_USERS_CONTACTS_OPENED",
    payload: contact
  }
}
export function addContactInPending(contact: any) {
  return {
    type: "contacts/ASYNC_UPDATED_USERS_CONTACTS_PENDING",
    payload: contact
  }
}
export function addContactInClosed(contact: any) {
  return {
    type: "contacts/ASYNC_UPDATED_USERS_CONTACTS_CLOSED",
    payload: contact
  }
}

// REMOVE
export function removeContactInOpened(contact: any) {
  return {
    type: "contacts/ASYNC_REMOVED_USERS_CONTACTS_OPENED",
    payload: contact
  }
}
export function removeContactInPending(contact: any) {
  return {
    type: "contacts/ASYNC_REMOVED_USERS_CONTACTS_PENDING",
    payload: contact
  }
}
export function removeContactInClosed(contact: any) {
  return {
    type: "contacts/ASYNC_REMOVED_USERS_CONTACTS_CLOSED",
    payload: contact
  }
}

export function updateLoadContacts(contact: any) {
  return {
    type: "contacts/REQUEST_UPDATED_LOAD_CONTACTS",
    payload: contact
  }
}

export function updateTotalMessages(message: any) {
  return {
    type: "contacts/ASYNC_UPDATED_TOTAL_MESSAGES_CONTACTS",
    payload: message,
  }
}

export function openProfileImage({ show, uri }: any) {
  return {
    type: "contacts/OPENED_IMAGE_CONTACT",
    payload: {
      show: show,
      uri: uri
    },
  }
}
