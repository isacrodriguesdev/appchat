import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Vibration
} from 'react-native'
// imports
import SendIcon from '~/components/icons/Send'
import ClipIcon from "~/components/icons/Clip"
import { font } from '../../app'
// types
// actions
// components
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { connect } from 'react-redux'
import * as contactActions from '../../store/duck/contacts'
import * as chatActions from '../../store/duck/chat'
import { useAuth } from '../../contexts/auth'
import Loading from '~/components/Loading'
import DocumentPicker from 'react-native-document-picker'
import { NavigationProp } from '@react-navigation/native'
import RNFS from "react-native-fs"
import { sendMessageFile, sendMessageText } from './actions/message'
import Permission from "~/app/permissions"
import md5 from 'md5'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Rendering from '~/components/Rendering'
import Animated, { Extrapolate, Value, Easing } from 'react-native-reanimated'
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import * as Indicators from 'react-native-indicators';


interface InputStateProps {
  navigation: NavigationProp<any>
  currentParticipant: any
}

interface InputDispatchProps {
  setModalReopenService(): void
  setModalGetService(): void
  setMessage(message: any): void
}

type Props = InputStateProps & InputDispatchProps

const audioRecorderPlayer = new AudioRecorderPlayer()

function Input(props: Props) {

  const animatedRecorderValue = useRef(new Value(0)).current
  const animatedRecorderMicPositionValue = useRef(new Value(0)).current

  const context = useAuth()

  const [recorderDuration, setRecorderDuration] = useState({
    recordSecs: 0,
    recordTime: "0:00"
  })
  const [recorderStarted, setRecorderStarted] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [isSendPermission, setSendPermission] = useState<boolean>(false)

  async function getDocumentFile() {

    await Permission.externalStorage()

    try {
      const document = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.zip,
          DocumentPicker.types.images,
        ],
      })

      const id = new Date()
      const hash = md5(id.toString())

      props.setMessage({
        type: "chat",
        message: "",
        sender: "attendant",
        sending: true,
        hash
      })

      RNFS.readFile(document.uri, "base64")
        .then(async (file) => {

          const { currentParticipant } = props
          const params = { context, currentParticipant, message, document, file, hash }

          sendMessageFile(params)
          setMessage("")

        }).catch(console.log)

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err
      }
    }
  }

  const sendMessage = useCallback(async function () {
    if (!isSendPermission)
      return

    const { currentParticipant } = props

    sendMessageText({ context, currentParticipant }).me(message)

    props.setMessage({
      type: 'chat',
      message: message,
      sender: "attendant",
    })

    setMessage("")
    setSendPermission(false)
  }, [props.currentParticipant, message])


  const stopRecorder = async function (exclude: boolean = false) {

    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()
    console.log({
      recordSecs: 0
    })

    if (exclude) return

    RNFS.readFile(result, "base64")
      .then(async file => {

        const id = new Date()
        const hash = md5(id.toString())

        const document: any = {
          name: md5(new Date().toString()),
          type: "audio/mp4"
        }

        const { currentParticipant } = props
        const params = { context, currentParticipant, document, file, message, hash, duration: recorderDuration.recordSecs }

        sendMessageFile(params)

        props.setMessage({
          type: "chat",
          message: "",
          sender: "attendant",
          sending: true,
          hash
        })

        setMessage("")

      }).catch(console.log)
  }

  const startRecorder = async function () {

    await Permission.externalStorage()
    await Permission.recordAudio()

    try {
      const result = await audioRecorderPlayer.startRecorder()

      audioRecorderPlayer.addRecordBackListener((e: any) => {
        setRecorderDuration({
          recordSecs: e.current_position,
          recordTime: audioRecorderPlayer.mmssss(
            Math.floor(e.current_position),
          ),
        })
        return
      })
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  function startAnimatedRecorder(value: number) {

    if (value !== 0) setRecorderStarted(true)

    Animated.timing(animatedRecorderValue, {
      toValue: value,
      duration: 60,
      easing: Easing.ease,
    }).start(() => {
      if (value === 0)
        setRecorderStarted(false)
    })
  }

  const onHandlerStateChange = function (e: PanGestureHandlerStateChangeEvent) {

    let actived = false
    let { translationX } = e.nativeEvent
    translationX = Math.abs(translationX)

    if (e.nativeEvent.state === State.ACTIVE && e.nativeEvent.oldState === State.UNDETERMINED)
      actived = true

    if (e.nativeEvent.state === State.END && !actived && translationX >= 0 && translationX < 80) {
      startAnimatedRecorder(0)
      Animated.timing(animatedRecorderMicPositionValue, {
        toValue: 0, duration: 60, easing: Easing.ease,
      }).start()
      console.log("🌐 sending audio")
      stopRecorder()
      return
    }

    if (e.nativeEvent.oldState === State.ACTIVE) {
      if (translationX >= 80) {
        console.log("❌ cancel audio")
        startAnimatedRecorder(0)
        stopRecorder(true)
        Animated.timing(animatedRecorderMicPositionValue, {
          toValue: 0, duration: 60, easing: Easing.ease,
        }).start()
      }
    }
  }

  const hasTypingMessage = useMemo(() => message.length, [message])

  function ButtomHasNoAttendant() {
    if (props.currentParticipant.status === "close")
      return (
        <TouchableNativeFeedback onPress={props.setModalReopenService}>
          <View style={[styles.entryActionsContainer, {
            justifyContent: "center", paddingVertical: 22
          }]}>
            <MaterialIcon name="present-to-all" size={22} color="#00cc44" />
            <Text style={styles.buttonAttendmentText}>Reabrir atendimento</Text>
          </View>
        </TouchableNativeFeedback>
      )
    else if (props.currentParticipant.status === "open")
      return (
        <TouchableNativeFeedback onPress={props.setModalGetService}>
          <View style={[styles.entryActionsContainer, {
            justifyContent: "center", paddingVertical: 22
          }]}>
            <MaterialIcon name="chat" size={22} color="#5d5dd5" />
            <Text style={[styles.buttonAttendmentText, { color: "#5d5dd5", bottom: 2 }]}>Pegar atendimento</Text>
          </View>
        </TouchableNativeFeedback>
      )
    else
      return (
        <View style={[styles.entryActionsContainer, {
          justifyContent: "center", paddingVertical: 22
        }]}>
          <Indicators.MaterialIndicator size={25} />
        </View>
      )
  }

  if (props.currentParticipant.serviceStatus === "provided")
    return (
      <View style={[styles.entryActionsContainer, {
        justifyContent: "center", paddingVertical: 22
      }]}>
        <MaterialIcon name="info" size={22} color="#ff4d4d" />
        <Text style={[styles.buttonAttendmentText, { color: "#ff4d4d", bottom: 1, fontSize: 15 }]}>Atendimento em andamento</Text>
      </View>
    )
  else if (!props.currentParticipant.attendant_id)
    return (
      ButtomHasNoAttendant()
    )
  else if (props.currentParticipant.attendant_id && props.currentParticipant.status === "open")
    return (
      <View style={styles.entryActionsContainer}>

        <Rendering render={!recorderStarted}>
          <Animated.View style={[styles.entryTextAndClipContainer, {
            opacity: animatedRecorderValue.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0],
              extrapolate: Extrapolate.CLAMP
            })
          }]}>
            <TextInput
              placeholder="Escreva sua mensagem"
              placeholderTextColor="rgba(0,0,0,.5)"
              style={styles.inputText}
              onChangeText={(text) => setMessage(text.trimStart())}
              onChange={({ nativeEvent }) => {
                if (nativeEvent.text.trim().length === 0) setSendPermission(false)
                else setSendPermission(true)
              }}
              value={message}
              multiline={true}
            />

            <TouchableOpacity onPress={getDocumentFile} style={[{ padding: 5, borderRadius: 100 }]}>
              <ClipIcon height={18} width={18} fill="rgba(0,0,0,.5)" />
            </TouchableOpacity>
          </Animated.View>
        </Rendering>

        <Rendering render={recorderStarted}>
          <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
            <Indicators.PulseIndicator size={25} color="#ff6666" style={{
              marginRight: 10,
              flex: 0
            }} />
            <Text style={{ fontSize: 16, bottom: 1 }}>{recorderDuration.recordTime}</Text>
          </View>
        </Rendering>

        <View style={[{ zIndex: 99999 }, recorderStarted ? { flex: 1 } : {}]}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (hasTypingMessage) sendMessage()
            }}
            onPressIn={() => {
              if (!hasTypingMessage) {
                console.log("🔴 recording")
                Vibration.vibrate(50, false)
                startAnimatedRecorder(100)
                startRecorder()
              }
            }}>
            <PanGestureHandler
              enabled={!hasTypingMessage}
              onGestureEvent={
                Animated.event([{
                  nativeEvent: {
                    translationX: animatedRecorderMicPositionValue
                  }
                }], { useNativeDriver: true })
              }
              onHandlerStateChange={onHandlerStateChange}>

              <Animated.View
                style={[
                  recorderStarted ? { borderColor: "rgba(0,0,0,.1)", borderWidth: 4 } : {},
                  styles.sendButtonAction, { marginLeft: styles.entryActionsContainer.paddingHorizontal, alignSelf: "flex-end" },
                  // @ts-ignore
                  {
                    width: animatedRecorderValue.interpolate({
                      inputRange: [0, 100],
                      outputRange: [45, 65],
                      extrapolate: Extrapolate.CLAMP
                    }),
                    height: animatedRecorderValue.interpolate({
                      inputRange: [0, 100],
                      outputRange: [45, 65],
                      extrapolate: Extrapolate.CLAMP
                    })
                  }, {
                    transform: [{
                      translateX: animatedRecorderMicPositionValue.interpolate({
                        inputRange: [-100, 0],
                        outputRange: [-100, 0],
                        extrapolate: Extrapolate.CLAMP
                      })
                    }]
                  }
                ]}>
                {
                  hasTypingMessage ?
                    <SendIcon style={{ left: 1 }} width={17} height={17} fill="#fff" />
                    :
                    <MaterialIcon name="mic" size={22} color="white" />
                }

              </Animated.View>
            </PanGestureHandler>
          </TouchableWithoutFeedback>
        </View>

        <Rendering render={recorderStarted}>
          <View style={{
            position: "absolute",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%"
          }}>
            <Animated.View style={[
              {
                alignItems: "center",
                flexDirection: "row",
              }, {
                opacity: animatedRecorderMicPositionValue.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [0, 1],
                  extrapolate: Extrapolate.CLAMP
                }),
                transform: [{
                  translateX: animatedRecorderMicPositionValue.interpolate({
                    inputRange: [-100, 0],
                    outputRange: [-100, -60],
                    extrapolate: Extrapolate.CLAMP
                  })
                }]
              }
            ]}>
              <MaterialIcon name="chevron-left" size={18} style={{ top: 0.8 }} />
              <Text>Deslize para cancelar</Text>
            </Animated.View>
          </View>
        </Rendering>
      </View>
    )
  else
    return (
      <View style={[styles.entryActionsContainer, {
        justifyContent: "center", paddingVertical: 22
      }]}>
        <Loading />
      </View>
    )
}

const mapStateToProps = (state: any) => ({
  currentParticipant: state.chat.currentParticipant
})

const mapDispatchToProps = {
  ...chatActions,
  ...contactActions
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(memo(Input))

const styles = StyleSheet.create({
  microphoneAndSentContainer: {
    borderRadius: 100,
    elevation: 2
  },
  entryActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 65,
    width: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "white",
    // backgroundColor: "#ececf3",
    elevation: 20
  },

  entryTextAndClipContainer: {
    backgroundColor: "#f7f7f8",
    paddingHorizontal: 12,
    marginHorizontal: 0,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    flex: 1
  },

  inputText: {
    flex: 1,
    marginRight: 0,
    color: 'black',
    fontFamily: font.OpenSansSemiBold,
    marginLeft: 0,
    fontSize: 13,
    top: 1
  },
  sendButtonAction: {
    // position: "absolute",
    backgroundColor: "#5d5dd5",
    // padding: 13,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    // marginLeft: 10,
    // elevation: 2,
    zIndex: 2000,
  },
  buttonAttendmentText: {
    fontSize: 16,
    fontFamily: font.RobotoMedium,
    textTransform: "uppercase",
    color: "#32cd4c",
    marginLeft: 8
  }
})
