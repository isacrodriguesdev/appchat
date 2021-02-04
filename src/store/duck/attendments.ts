import { Action } from "Types"

const initialState = {
  departments: [],
  attendants: [],
  loading: false
}

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'attendments/REQUEST_DEPARTAMENTS':
      return {
        ...state,
        loading: true
      }
    case 'attendments/SUCCESS_DEPARTAMENTS':
      return {
        ...state,
        departments: action.payload,
        loading: false
      }
    case 'attendments/REQUEST_ATTENDANTS':
      return {
        ...state,
        loading: true
      }
    case 'attendments/SUCCESS_ATTENDANTS':
      return {
        ...state,
        attendants: action.payload,
        loading: false
      }
    default:
      return state
  }
}

export function getDepartments() {
  return {
    type: 'attendments/REQUEST_DEPARTAMENTS',
  }
}

export function getAttendants(departmentId: number) {
  return {
    type: 'attendments/REQUEST_ATTENDANTS',
    payload: departmentId
  }
}
