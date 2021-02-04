import React, { Fragment, memo, useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import Toast from "react-native-toast-message"
import { useAuth } from '../../../contexts/auth'
import colors from '../../../../theme'
import font from "../../../app/font"

import UserIcon from "~/components/icons/UserFilled"
import SecurityCodeIcon from "~/components/icons/SecurityCodeFilled"

const LoginScreen = ({ navigation }) => {

  const { singIn, error } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onLoginPressed = () => {
    singIn(username, password)
  }

  return (

    <View style={styles.container}>
      <View style={[styles.header, { marginBottom: styles.login.bottom / 2 }]}>
        <View>
          <Text style={{
            color: "white",
            fontSize: 25,
            fontFamily: font.PoppinsSemiBold
          }}>Divulga Amigo</Text>
        </View>
      </View>

      <View style={[styles.login, { paddingTop: styles.login.bottom }]}>
        <View>
          <Text style={{
            color: "black",
            fontSize: 25,
            fontFamily: font.PoppinsSemiBold
          }}>Login</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <UserIcon width={20} height={20} fill="rgba(0,0,50,0.4)" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              placeholderTextColor="rgba(0,0,50,0.4)"
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.input}>
            <SecurityCodeIcon width={20} height={20} fill="rgba(0,0,50,0.4)" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.textInput}
              placeholderTextColor="rgba(0,0,50,0.4)"
              placeholder="Senha de acesso"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        <ScrollView>
          <Text style={{
            fontFamily: font.PoppinsRegular,
            color: "red"
          }}>{error}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
          <Text style={styles.buttonText}>Entrar na conta</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // flex: 1,
    // height: 140,
    backgroundColor: colors.primaryColor,
    height: "28%",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  login: {
    // flex: 2,
    width: "100%",
    backgroundColor: "white",
    bottom: 45,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30
  },
  form: {
    paddingVertical: 30
  },
  input: {
    paddingVertical: 4,
    marginVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#a7bef1",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  textInput: {
    fontSize: 16,
    fontFamily: font.QuicksandBold,
    width: "100%"
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 100,
    marginHorizontal: 20,
    backgroundColor: colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: font.PoppinsSemiBold,
    top: 2
  }
})

export default memo(LoginScreen)