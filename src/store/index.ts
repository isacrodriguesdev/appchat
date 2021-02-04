import { combineReducers, applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
// sagas
import rootSaga from './sagas'
// reducers
import contacts from './duck/contacts'
import chat from './duck/chat'
import attendments from './duck/attendments'

const saga = createSagaMiddleware();

const rootReducer = combineReducers({
   contacts,
   chat,
   attendments
})

// const persistConfig = {
//    key: 'root',
//    blacklist: ['contacts'],
//    storage: AsyncStorage,
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(rootReducer, applyMiddleware(saga))
// let persistor = persistStore(store)

saga.run(rootSaga)

export { store }
