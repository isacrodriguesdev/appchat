import React, { useEffect, useMemo, useRef, useState } from "react"
import Toast from "react-native-toast-message"
import { connect } from "react-redux"
import { View, StyleSheet, Dimensions, TouchableNativeFeedback, ScrollView, TouchableOpacity, Image, TouchableWithoutFeedback, Text, ImageBackground, BackHandler, Modal, Alert } from "react-native"
import OneSignal from "../../services/notification"
import Sound from 'react-native-sound'
// imports
// types
// components
import Header from "./Header"
// actions
import * as contactActions from '../../store/duck/contacts'
import * as chatActions from '../../store/duck/chat'
import { useAuth } from "../../contexts/auth"
import axios from "axios"
import { font } from "../../app"
import { NavigationProp } from "@react-navigation/native";
import Animated, { multiply, interpolateColors } from "react-native-reanimated"
import { height, width } from "../../app/window"
import Page from "./Page"
import Rendering from "~/components/Rendering"
import { UseAuthProps } from "Types"

interface StateProps {
  navigation: NavigationProp<any>
  listOpened: any[]
  listPending: any[]
  listClosed: any[]
  loading: boolean
  selectedOption: string
  currentParticipant: any
  profileImage: any
}

interface DispatchProps {
  addContactInOpened(contact: any): void
  addContactInPending(contact: any): void
  addContactInClosed(contact: any): void
  removeContactInOpened(contact: any): void
  removeContactInPending(contact: any): void
  removeContactInClosed(contact: any): void
  getContactsOpen(): void
  getContactsClosed(): void
  getContactsPending(): void
  setCurrentParticipant(participant: any, serviceStatus: string): void
  setMessage(message: any): void
  updateMessage(message: any): void
  updateTotalMessages(message: any): void
  updateLoadContacts(pagination: any): void
  openProfileImage(object: any): void
}

type Props = StateProps & DispatchProps

function Home(props: Props) {

  let scrollRef: any = useRef()

  const { socket, user, logout }: UseAuthProps = useAuth()

  // const [errSocket, setErrSocket] = useState<string>("")
  // const [pageLimit, setPageLimit] = useState(10)
  // const [pageOffset, setPageOffset] = useState(10)
  const [totalConversations, setTotalConversations] = useState(0)
  const [page, setPage] = useState(0)
  const [movedScroll, setMovedScroll] = useState(false)
  const [sound] = useState(
    new Sound('xiomi2.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return
      }
    })
  )
  const animatedTabValue = useRef(new Animated.Value(0)).current
  // const animatedModalValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    setTotalConversations(
      props.listOpened.filter(({ unread_messages }) => unread_messages !== 0).length
    )
  }, [props.listOpened])

  useEffect(() => {

    if (props.profileImage.show)
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    }
  }, [props.profileImage.show])

  useEffect(() => {

    if (movedScroll === true)
      return

    switch (page) {
      case 1:
        scrollRef.current._component.scrollTo({ x: 0, animated: true })
        break
      case 2:
        scrollRef.current._component.scrollTo({ x: width * 1, animated: true })
        break
      case 3:
        scrollRef.current._component.scrollTo({ x: width * 2, animated: true })
        break
      default:
        break
    }

    setMovedScroll(false)

  }, [page])


  function sendSuccessToast(message: string, title: string) {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: title,
      text2: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 15,
      bottomOffset: 40,
    })
  }

  useEffect(() => {

    onEventListeners()

    props.getContactsOpen()
    props.getContactsClosed()
    props.getContactsPending()
    // sound.release()

    return () => {
      OneSignal.configure().removeEventListener("ids", onIds)
      props.navigation.removeListener("focus", () => null)
      props.navigation.removeListener("blur", () => null)
      // sound.reset()
      socket.removeAllListeners()
    }
  }, [])

  function onSendMessageApp(message: any) {
    props.setMessage(message)
  }

  function onMessageSentSuccessfully(response: any) {

    if(response.message.type !== "chat") 
      props.updateMessage({ ...response.message, hash: response.file.hash })
  }

  function onError(error: any) {
    // if (err === "Account already in use") "Essa conta já esta sendo usada em outro dispositivo",
    console.log(error)
  }

  function onAppError(error: any) {
    if (error.type === "transferred_attendant") {
      props.navigation.goBack()
      Alert.alert(
        props.currentParticipant.name, error.message,
        [{ text: 'Entendi' }],
        { cancelable: false }
      )
    }
    else if (error.type === "transferred_department") {
      props.navigation.goBack()
      Alert.alert(
        props.currentParticipant.name, error.message,
        [{ text: 'Entendi', style: "default" }],
        { cancelable: false }
      )
    }
  }

  function handleBackButtonClick() {
    if (props.profileImage.show)
      props.openProfileImage({ show: false })

    return props.profileImage.show
  }

  async function onEventListeners() {

    socket.on("logout", logout)
    socket.on("message_sent_successfully", onMessageSentSuccessfully)

    socket.on("error", onError)
    socket.on("@error", onAppError)

    props.navigation.addListener("focus", async () => {
      socket.on("send_message_app", onSendMessageApp)
    })

    props.navigation.addListener("blur", () => {
      socket.removeListener("send_message_app", onSendMessageApp)
    })

    socket.on("remove_provider_attendance_app", (contact: any) => {

      console.log("remove")
      props.removeContactInOpened(contact)
      props.removeContactInClosed(contact)
      props.removeContactInPending(contact)
    })

    socket.on("provider_attendance_transfer", (contact: any) => {

      const hasAttendant = !!contact.attendant_id
      const serviceIsOpen = contact.status === "open"

      if (hasAttendant && serviceIsOpen) {
        console.log("transfer #1")
        props.setCurrentParticipant(contact, "opened")
        props.addContactInOpened(contact)
      } else {
        console.log("transfer #2")
        props.setCurrentParticipant(contact, "opened")
        props.addContactInPending(contact)
      }
    })

    socket.on("provider_attendance_app", (contact: any) => {

      console.log("provider")

      const hasAttendant = !!contact.attendant_id
      const serviceIsOpen = contact.status === "open"

      // algum atendente pegou o atendimento
      if (hasAttendant && serviceIsOpen) {
        console.log("#1")
        props.setCurrentParticipant(contact, "provided")
        props.removeContactInClosed(contact)
        props.removeContactInPending(contact)
      }
      // um atendimento foi aberto pelo usuario
      else if (!hasAttendant && serviceIsOpen) {
        console.log("#2")
        props.setCurrentParticipant(contact, "opened")
        props.addContactInPending(contact)

        sound.play((success) => {
          if (success)
            sound.stop()
        })
      }
      // o atendimento foi encerrado pelo atendente ou pelo usuario
      else if (!hasAttendant && !serviceIsOpen) {
        console.log("#3")
        props.setCurrentParticipant(contact, "closed")
        props.removeContactInOpened(contact)
        props.removeContactInPending(contact)
        props.addContactInClosed(contact)
      }
    })

    OneSignal.configure().addEventListener("ids", onIds)
  }

  async function onIds(device: any) {
    try {
      await axios.put("/notification", { deviceId: device.userId })
    } catch (error) {
      console.log("deviceId", error)
    }
  }

  function navigationPageNumber(index: number) {
    setMovedScroll(false)
    setPage(index)
  }

  const totalContactsPending = useMemo(() => props.listPending.length, [props.listPending])
  const hasContactsPending = useMemo(() => !!props.listPending.length, [props.listPending])

  // return useMemo(() => {

    return (
      <React.Fragment>

        <Header user={user} />
        <View style={styles.container}>
          <View style={{ paddingTop: 15, paddingHorizontal: 10 }}>
            <View style={styles.selectContainer}>
              <View style={styles.selectContainerButtonAnimated}>
                <Animated.View style={[{
                  transform: [{
                    translateX: animatedTabValue.interpolate({
                      inputRange: [0, multiply(width, 3)],
                      outputRange: [0, width],
                      extrapolate: Animated.Extrapolate.CLAMP,
                    })
                  }]
                }]}>
                  <View style={[styles.selelectButtonAnimated]} />
                </Animated.View>
              </View>
              <TouchableOpacity style={[styles.buttonSelect]} activeOpacity={0.5}
                onPress={() => {
                  navigationPageNumber(1)
                }}>
                {/* @ts-ignore */}
                <Animated.Text style={[styles.buttonSelectText, {
                  color: interpolateColors(animatedTabValue, {
                    inputRange: [0, multiply(width, 1)],
                    outputColorRange: ["#5d5dd5", "black"],
                  })
                }]}>
                  Abertos
                </Animated.Text>
                <Rendering render={totalConversations}>
                  {/* @ts-ignore */}
                  <Animated.View style={[styles.totalSupplyContainer, {
                    backgroundColor: interpolateColors(animatedTabValue, {
                      inputRange: [0, multiply(width, 1)],
                      outputColorRange: ["#5d5dd5", "black"],
                    }),
                  }]}>
                    <Text style={[styles.totalSupplyText]}>
                      {totalConversations}
                    </Text>
                  </Animated.View>
                </Rendering>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.buttonSelect]} activeOpacity={0.5} onPress={() => {
                navigationPageNumber(2)
              }}>
                {/* @ts-ignore */}
                <Animated.Text style={[styles.buttonSelectText, {
                  color: interpolateColors(animatedTabValue, {
                    inputRange: [0, width, multiply(width, 2)],
                    outputColorRange: ["black", "#5d5dd5", "black"],
                  })
                }]}>
                  Aguardando
                  </Animated.Text>

                <Rendering render={hasContactsPending}>
                  <Animated.View style={[styles.totalSupplyContainer,
                  // @ts-ignore
                  {
                    backgroundColor: interpolateColors(animatedTabValue, {
                      inputRange: [0, width, multiply(width, 2)],
                      outputColorRange: ["black", "#5d5dd5", "black"],
                    }),
                  }
                  ]}>
                    <Text style={[styles.totalSupplyText]}>
                      {totalContactsPending}
                    </Text>
                  </Animated.View>
                </Rendering>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.buttonSelect]} activeOpacity={0.5} onPress={() => {
                navigationPageNumber(3)
              }}>
                {/* @ts-ignore */}
                <Animated.Text style={[styles.buttonSelectText, {
                  color: interpolateColors(animatedTabValue, {
                    inputRange: [width, multiply(width, 2)],
                    outputColorRange: ["black", "#5d5dd5"],
                  })
                }]}>
                  Fechados
                </Animated.Text>
              </TouchableOpacity>

            </View>
          </View>

          <Animated.ScrollView
            ref={scrollRef}
            // setPageOffset(pageOffset + 10)
            // if (!props.loading && users.length >= pageLimit) {
            //   updateLoadContacts({
            //     page_limit: pageLimit,
            //     page_offset: pageOffset + 10,
            //     selected: props.selectedOption
            //   })
            // }
            scrollEventThrottle={16}
            onScroll={Animated.event([{
              nativeEvent: { contentOffset: { x: animatedTabValue } }
            }],
              { useNativeDriver: true })
            }
            onMomentumScrollEnd={e => {
              let contentOffsetX = Math.floor(e.nativeEvent.contentOffset.x)
              setMovedScroll(true)

              if (contentOffsetX === 0)
                setPage(1)
              else if (contentOffsetX === Math.floor(width))
                setPage(2)
              else if (contentOffsetX === Math.floor(width * 2))
                setPage(3)
            }}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            pagingEnabled={true}>
            <Page loading={props.loading} users={props.listOpened} navigation={props.navigation}
              onEndReached={() => { }}
            />
            <Page loading={props.loading} users={props.listPending} navigation={props.navigation}
              onEndReached={() => { }}
            />
            <Page loading={props.loading} users={props.listClosed} navigation={props.navigation}
              onEndReached={() => { }}
            />
          </Animated.ScrollView>

        </View>

        <Toast ref={(ref) => Toast.setRef(ref)} />

        <Modal transparent visible={props.profileImage.show} animationType="none" >
          <TouchableWithoutFeedback onPress={() => props.openProfileImage({ show: false })}>
            <View
              style={styles.profileImageContainer}>
              <ImageBackground
                resizeMode="contain"
                source={{ uri: props.profileImage.uri }}
                style={styles.profileImage}>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </React.Fragment>
    )
  // }, [
  //   props.listOpened,
  //   props.listPending,
  //   props.listClosed,
  //   props.loading,
  //   props.profileImage,
  //   totalConversations
  // ])

}
const mapStateToProps = (state: any) => ({
  listOpened: state.contacts.listOpened,
  listPending: state.contacts.listPending,
  listClosed: state.contacts.listClosed,
  loading: state.contacts.loading,
  currentParticipant: state.chat.currentParticipant,
  profileImage: state.contacts.profileImage
})

const mapDispatchToProps = {
  ...contactActions,
  ...chatActions
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    backgroundColor: "white",
    height: "88%",
    zIndex: 10,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  contactsListContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonFilterContacts: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: (Dimensions.get("screen").width / 3) - 5,
  },
  buttonFilterContactsText: {
    fontFamily: font.QuicksandSemiBold,
    color: "rgba(0,0,40,0.8)"
  },
  buttonSelect: {
    borderRadius: 100,
    width: width / 3,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    zIndex: 2,
  },
  buttonSelectText: {
    fontFamily: font.MontserratBold,
    // color: "black",
    zIndex: 9999999,
    fontSize: 11,
    textTransform: "uppercase"
  },
  selectContainer: {
    elevation: 0,
    borderRadius: 100,
    width: "100%",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // backgroundColor: "#eeeef2",
  },
  selectContainerButtonAnimated: {
    borderRadius: 0,
    position: "absolute",
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
  },
  selelectButtonAnimated: {
    backgroundColor: "#5d5dd5",
    width: (width / 3) - 20,
    height: 2.5,
    zIndex: 1,
    borderRadius: 100,
    // alignItems: "center",
    // justifyContent: "center",
    top: 15
  },
  totalSupplyContainer: {
    // position: "absolute",
    width: 17,
    height: 17,
    borderRadius: 100,
    backgroundColor: "#5d5dd5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    right: 0,
    // left: 0
  },
  totalSupplyText: {
    color: 'white',
    fontSize: 10,
    bottom: 0.5,
    fontFamily: font.RobotoMedium,
  },
  profileImageContainer: {
    flex: 1,
    position: "absolute",
    zIndex: 99999999,
    height: height,
    width: width,
    elevation: 20,
    backgroundColor: "black"
  },
  profileImage: {
    elevation: 2,
    height: height,
    width: width,
  },
})