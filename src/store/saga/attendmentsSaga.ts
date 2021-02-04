import { Action } from 'Types'
import { put, select } from 'redux-saga/effects'
import axios from 'axios'

export function* asyncGetDepartments() {
  try {
    const departments = yield axios.get("/departments")

    yield put({
      type: 'attendments/SUCCESS_DEPARTAMENTS',
      payload: departments.data
    })

  } catch (error) {
  }
}

export function* asyncGetAttendants(action: Action) {
  try {
    const attendants = yield axios.get(`/attendants/${action.payload}`)

    yield put({
      type: 'attendments/SUCCESS_ATTENDANTS',
      payload: attendants.data
    })

  } catch (error) {

  }
}