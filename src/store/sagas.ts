import { takeLatest, all } from 'redux-saga/effects';
// actions saga
import * as contacts from './saga/contactsSaga';
import * as chat from './saga/chatSaga';
import * as attendmants from './saga/attendmentsSaga';

export default function* root() {
  yield all([
    // contacts
    takeLatest("contacts/REQUEST_GETED_CONTACTS_OPEN", contacts.asyncGetContactsOpen),
    takeLatest("contacts/REQUEST_GETED_CONTACTS_CLOSED", contacts.asyncGetContactsClosed),
    takeLatest("contacts/REQUEST_GETED_CONTACTS_PENDING", contacts.asyncGetContactsPending),

    takeLatest("contacts/ASYNC_UPDATED_USERS_CONTACTS_OPENED", contacts.asyncUpdateContactsOpened),
    takeLatest("contacts/ASYNC_UPDATED_USERS_CONTACTS_PENDING", contacts.asyncaddContactInPending),
    takeLatest("contacts/ASYNC_UPDATED_USERS_CONTACTS_CLOSED", contacts.asyncUpdateContactsClosed),

    takeLatest("contacts/ASYNC_REMOVED_USERS_CONTACTS_OPENED", contacts.asyncRemoveContactOpened),
    takeLatest("contacts/ASYNC_REMOVED_USERS_CONTACTS_PENDING", contacts.asyncremoveContactInPending),
    takeLatest("contacts/ASYNC_REMOVED_USERS_CONTACTS_CLOSED", contacts.asyncRemoveContactClosed),

    takeLatest("contacts/ASYNC_UPDATED_STATUS", contacts.asyncUpdateStatus),
    takeLatest("contacts/REQUEST_UPDATED_LOAD_CONTACTS", contacts.asyncUpdateLoadContacts),
    // chat
    takeLatest("chat/REQUEST_GETED_MESSAGES", chat.asyncGetMessages),
    takeLatest("chat/REQUEST_UPDATED_MESSAGES", chat.asyncSetMessage),
    takeLatest("chat/REQUEST_UPDATED_READ_MESSAGES", chat.asyncUpdateReadMessages),
    takeLatest("chat/REQUEST_UPDATED_LOAD_MESSAGES", chat.asyncUpdateLoadMessages),
    takeLatest("chat/ASYNC_SET_CURRENT_PARTICIPANT", chat.asyncSetCurrentParticipant),
    takeLatest("chat/REQUEST_MESSAGE_SENT_SUCCESSFULLY", chat.asyncUpdateMessage),
    // attendmants
    takeLatest("attendments/REQUEST_DEPARTAMENTS", attendmants.asyncGetDepartments),
    takeLatest("attendments/REQUEST_ATTENDANTS", attendmants.asyncGetAttendants)
  ])
}