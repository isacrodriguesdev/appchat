import { getHost, config } from "../../config"
import axios from "axios"
import socketio from "socket.io-client"
import React, { createContext, useContext, useState, useEffect, Fragment } from "react"
import device from "react-native-device-info"
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"
import { UseAuthProps } from "Types"
import jwtDecode from "jwt-decode"

const AuthContext = createContext<UseAuthProps>({
  // @ts-ignore
  socket: socketio,
  signed: false,
  error: null,
  user: {},
  decoded: {},
  singIn: (login: string, password: string) => { },
  logout: () => { },
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: any) {

  const [loading, setLoading] = useState(true)
  const [signed, setSigned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socket, setSocket] = useState<SocketIOClient.Socket>(socketio)
  const [user, setUser] = useState({})
  const [decoded, setDecoded] = useState({})

  useEffect(() => {
    isLogged()
  }, [])

  async function getDevice() {
    const device_system = await device.getSystemName()
    const device_name = await device.getDeviceName()

    return { device_name, device_system }
  }

  // verificar se o usúario esta autenticado
  async function isLogged() {

    try {

      let token: any = await AsyncStorage.getItem("@token")

      if (token) {

        const user: any = await AsyncStorage.getItem("@user")
        const decoded: any = jwtDecode(token)


        setSocket(
          socketio.connect(getHost(), {
            secure: config.hostSecure,
            query: {
              token: token.split(" ")[1]
            }
          })
        )

        axios.defaults.headers.authorization = token

        setUser(JSON.parse(user))
        setDecoded(decoded)
        setLoading(false)
        setSigned(true)

        return

      }

    } catch (error) {
      console.log("isLogged error", error)
    }

    setLoading(false)

  }

  // autenticar
  async function singIn(login: string, password: string) {

    // API Request
    try {

      const phone = await getDevice()

      const response = await axios.post("/login", {
        login,
        password,
        ...phone
      })

      let responseUser = {
        id: response.data.user.userId,
        name: response.data.user.userName,
        photo: response.data.user.userPic,
        number: response.data.user.userNumber,
        branchId: response.data.user.userBranchId,
        groupChannel: response.data.user.userGroupChannel,
        departmentName: response.data.user.userDepartment,
        departmentId: response.data.user.userDepartmentId,
        login: response.data.user.userLogin,
        deviceId: response.data.user.userDeviceId,
        deviceName: response.data.user.userDeviceName,
        deviceSystem: response.data.user.userDeviceSystem,
      }

      setLoading(true)
      setUser(responseUser)

      const token: string = 'Bearer ' + response.data.token
      const stringUser: string = JSON.stringify(responseUser)

      if (token) {

        await AsyncStorage.setItem("@token", token)
        await AsyncStorage.setItem("@user", stringUser)
        axios.defaults.headers.authorization = token

        setSocket(
          socketio.connect(getHost(), {
            secure: config.hostSecure,
            query: {
              token: token.split(" ")[1]
            }
          })
        )

        setLoading(false)
        setSigned(true)
        setError("")
      }
    } catch ({ response }) {

      if (response && response.data && response.data.error) {
        setError(response.data.error)
        setLoading(false)
        return
      }

      setError("Ocorreu um erro entre em contato com o administrador")
    }
  }

  async function logout() {

    setLoading(true)
    await AsyncStorage.clear()
    await AsyncStorage.removeItem("@token")
    delete axios.defaults.headers.authorization
    socket.disconnect()

    setLoading(false)
    setSigned(false)
  }

  // Animação de tela de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#561b8a" />
      </View>
    )
  }

  return (
    <AuthContext.Provider value={{ singIn, logout, signed, error, socket, user, decoded }}>
        {children}
    </AuthContext.Provider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  }
})
