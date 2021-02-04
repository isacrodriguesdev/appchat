import { getHost } from './config'
import axios from "axios"
import {AppRegistry} from "react-native"
import App from "./App"
import {name as appName} from "./app.json"

axios.defaults.baseURL = getHost()

AppRegistry.registerComponent(appName, () => App)
