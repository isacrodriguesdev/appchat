import React, { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react'
import { connect } from 'react-redux'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  ImageBackground,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  BackHandler,
  Modal,
  Alert,
} from 'react-native';
import * as contactActions from '../../store/duck/contacts'
import * as chatActions from '../../store/duck/chat'
import * as attendmentsActions from '../../store/duck/attendments'
// components
import Input from './Input'
import Message from './Message'
import { useAuth } from '../../contexts/auth'
import { height, width } from '../../app/window'
import Sound from 'react-native-sound';
import { UseAuthProps } from '../../../Types'
import font from '../../app/font';
import colors from '../../../theme';
import { StateProps, DispatchProps } from "./Props"
import * as Indicators from 'react-native-indicators';
import OneSignal from "../../services/notification"
import BackIcon from "~/components/icons/Back"
import CloseIcon from "~/components/icons/Close"
import Header from './Header'
import Animated from 'react-native-reanimated';
import ServiceNoticeModal from '~/components/ServiceNoticeModal';
import LinearGradient from 'react-native-linear-gradient';
import Attendant from './Attendant';
import Rendering from '~/components/Rendering';
import MenuOptions from './MenuOptions';
import { sendMessageText } from './actions/message';

type Props = StateProps & DispatchProps

interface ListMessagesProps {
  loadingStart: boolean
  loadingProcess: boolean
  messages: any[]
  refChatView: any
  pageLimit: number
  setPageOffset: React.Dispatch<React.SetStateAction<number>>
  updateLoadMessages(object: any): void
  participant: any
  pageOffset: number
}

function ListMessages (props: ListMessagesProps) {

  const allowedToPullMessages = useMemo(() => !props.loadingStart && !props.loadingProcess && props.messages.length > props.pageLimit, [
    props.loadingStart,
    props.loadingProcess,
    props.messages
  ])

  return (
    <FlatList
      removeClippedSubviews={true}
      initialNumToRender={10}
      ref={props.refChatView}
      showsVerticalScrollIndicator={false}
      inverted
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => {
        return props.loadingProcess ? (
          <View style={{ zIndex: 1000, top: 15 }}>
            <Indicators.MaterialIndicator size={25} color={colors.primaryColor} />
          </View>
        ) : null
      }}
      onEndReached={() => {
        if (allowedToPullMessages) {
          props.setPageOffset((prevState: number) => prevState + 10)
          props.updateLoadMessages({
            contact_id: props.participant.contact_id,
            attendment_id: props.participant.id,
            page_limit: props.pageLimit,
            page_offset: props.pageOffset
          })
        }
      }}
      style={styles.messagesContainer}
      data={props.messages}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        if (props.participant.channel === item.channel) {
          item = {
            ...item,
            participant: props.participant,
            received: item.sender !== "client"
          }

          if (item.message === "@closed_attendment@")
            return <Message {...item} notice="closed" message="Atendimento concluído" />
          else
            return <Message {...item} />
        }
        else return null
      }}
    />
  )
}


function Chat(props: Props) {

  const { socket, user }: UseAuthProps = useAuth()
  const context: UseAuthProps = useAuth()
  const refChatView = useRef()

  const [openedDepartmentChange, setOpenedDepartmentChange] = useState<boolean>(false)
  const [opnedAttendantChange, setOpnedAttendantChange] = useState<boolean>(false)
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("")
  const [openedOptionsMenu, setOpenedOptionsMenu] = useState<boolean>(false)
  const [menuOptionSelectedName, setMenuOptionSelectedName] = useState<string>("null")

  const [rederingOptionsMenu, setRederingOptionsMenu] = useState<boolean>(false)

  const [modalEndService, setModalEndService] = useState<boolean>(false)
  const [modalReopenService, setModalReopenService] = useState<boolean>(false)
  const [modalGetService, setModalGetService] = useState<boolean>(false)
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [pageOffset, setPageOffset] = useState<number>(15)
  const [sound, setSound] = useState(function () {
    return new Sound('intuition.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed sound MAIN_BUNDLE', error)
        return
      }
    })
  })

  function handleBackButtonClick() {
    if (props.imagesOpened)
      props.closeImageMessage()

    return props.imagesOpened
  }

  useEffect(() => {

    if (props.imagesOpened)
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    }
  }, [props.imagesOpened])

  useEffect(() => {

    const { last_message, contact_id, id } = props.route.params.participant

    const participant = {
      contact_id: contact_id,
      attendment_id: id,
      last_message: last_message ? last_message : ""
    }

    props.setCurrentParticipant(props.route.params.participant)

    props.navigation.addListener("focus", () => {
      socket.on("send_message_app", onSendMessageApp)
    })

    props.navigation.addListener("blur", () => {
      socket.removeListener("send_message_app", onSendMessageApp)
    })

    props.updateReadMessages(participant)

    props.getMessages(participant)
    OneSignal.configure().setSubscription(false)

    return () => {
      socket.removeListener("send_message_app", onSendMessageApp)
      // sound.reset()

      props.navigation.removeListener("focus", () => null)
      props.navigation.removeListener("blur", () => null)
      // desligar teclado
      Keyboard.dismiss()
      // resetar o array de conversas no store toda vez que sair da tela do chat
      props.resetChat()
      // atualizar mensagens 
      props.updateReadMessages({
        contact_id: props.route.params.participant.contact_id,
        attendment_id: props.route.params.participant.attendment_id
      })

      // reativar push notification
      OneSignal.configure().setSubscription(true)
    }

  }, [])

  const onSendMessageApp = useCallback(function (message: any) {
    props.setMessage(message)

    sound.play((success) => {
      if (success)
        sound.stop()
    })
  }, [sound])

  const getService = useCallback(function () {

    let currentParticipant = props.route.params.participant

    props.setCurrentParticipant({
      ...props.route.params.participant,
      attendant_id: user.id,
      status: "open"
    })

    props.removeContactInClosed(props.route.params.participant)
    props.removeContactInPending(props.route.params.participant)
    props.addContactInOpened({
      ...props.route.params.participant,
      attendant_id: user.id,
      status: "open"
    })

    socket.emit("get_attendance_service", {
      ...props.route.params.participant,
      ...context.decoded,
      attendant_id: user.id,
    })

    sendMessageText({
      context,
      currentParticipant
    }).boot("@get_attendance@")
  }, [])

  function getProviderAttendanceTake() {
    setModalGetService(false)
    getService()
  }

  function getProviderAttendanceReopen() {
    setModalReopenService(false)
    getService()
  }

  function openOptionsMenu() {
    setRederingOptionsMenu(true)
    setOpenedOptionsMenu(true)
  }

  const endService = useCallback(function () {

    setModalEndService(false)

    props.setCurrentParticipant({
      ...props.route.params.participant,
      attendant_id: null,
      unread_messages: 0,
      status: "close"
    })

    props.removeContactInOpened(props.route.params.participant)
    props.removeContactInPending(props.route.params.participant)
    props.addContactInClosed({
      ...props.route.params.participant,
      attendant_id: null,
      unread_messages: 0,
      status: "close",
      last_message: props.route.params.participant.number.replace("@c.us", "")
    })

    socket.emit("closed_attendment_service", user.groupChannel, {
      ...props.route.params.participant,
      attendant_id: null,
      unread_messages: 0,
      status: "close"
    })
  }, [])

  const changeDepartmentService = useCallback(function (item: any) {

    let currentParticipant = props.route.params.participant

    socket.emit("change_transfer_department", {
      department: {
        id: item.id,
        branch_id: item.branch_id,
        group_channel: item.group_channel
      },
      contact: currentParticipant
    })

    props.navigation.goBack()

    Alert.alert(
      currentParticipant.name, "Transferência concluída",
      [{ text: 'Entendi' }],
      { cancelable: false }
    )
  }, [])

  function changeAttendantService(item: any) {
    props.getAttendants(item.id)
    setOpnedAttendantChange(true)
    setSelectedDepartmentName(item.name)
  }

  // renders

  const showingPictures = useMemo(() => props.imagesOpened && props.imagesList.length, [props.imagesOpened])

  return (
    <React.Fragment>

      <Rendering render={showingPictures}>
        <Animated.ScrollView
          style={styles.galeryScroll}
          pagingEnabled={true}
          scrollEventThrottle={16}
          horizontal={true}
          decelerationRate="fast">
          {
            props.imagesList.map((message, index) => (
              <TouchableWithoutFeedback onPress={props.closeImageMessage} key={index.toString()}>
                <ImageBackground
                  resizeMode="contain"
                  source={{ uri: props.imagesList && message.file }}
                  style={{
                    elevation: 20,
                    height: height,
                    width: width,
                  }}>
                </ImageBackground>
              </TouchableWithoutFeedback>
            ))
          }
        </Animated.ScrollView>
      </Rendering>

      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["white", "white"]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
          style={styles.container}>
          {/* @ts-ignore */}
          <Header
            onPressMore={openOptionsMenu}
            participant={props.route.params.participant}
            navigation={props.navigation}
          />

          <Rendering render={props.loadingStart}>
            <View style={{
              position: "absolute",
              zIndex: 20,
              height, width
            }}>
              <Indicators.SkypeIndicator size={40} />
            </View>
          </Rendering>

          <ListMessages
            refChatView={refChatView}
            pageOffset={pageOffset}
            pageLimit={pageLimit}
            setPageOffset={setPageOffset}
            updateLoadMessages={props.updateLoadMessages}
            participant={props.route.params.participant}
            loadingStart={props.loadingStart}
            loadingProcess={props.loadingProcess}
            messages={props.messages}
          />

          <Input
            setModalReopenService={() => setModalReopenService(true)}
            setModalGetService={() => setModalGetService(true)}
            navigation={props.navigation}
          />

        </LinearGradient>

      </SafeAreaView>

      <ServiceNoticeModal
        enable={modalEndService}
        title="Você deseja encerrar?"
        message="Após encerrar o atendimento, ele podera ser reaberto a qualquer momento"
        buttonTextCancel="Cancelar"
        buttonTextConfirm="Confirmar"
        colorButtonTextConfirm="white"
        color="#ff667d"
        icon="cancel-presentation"
        onPressCancel={() => {
          setRederingOptionsMenu(true)
          setOpenedOptionsMenu(true)
          setModalEndService(false)
        }}
        onPressConfirm={endService}
      />

      <ServiceNoticeModal
        enable={modalReopenService}
        title="Você deseja reabrir?"
        message="Você poderá atender esse usuário novamente, lembre-se de fechar o atendimento após concluir"
        buttonTextCancel="Cancelar"
        buttonTextConfirm="Confirmar"
        colorButtonTextConfirm="white"
        color="#84e193"
        icon="present-to-all"
        onPressCancel={() => setModalReopenService(false)}
        onPressConfirm={getProviderAttendanceReopen}
      />

      <ServiceNoticeModal
        enable={modalGetService}
        title="Você deseja pegar?"
        message="Após encerrar o atendimento, ele podera ser reaberto a qualquer momento"
        buttonTextCancel="Cancelar"
        buttonTextConfirm="Confirmar"
        colorButtonTextConfirm="white"
        color="#9c7aeb"
        icon="chat"
        onPressCancel={() => setModalGetService(false)}
        onPressConfirm={getProviderAttendanceTake}
      />

      <Modal transparent visible={openedDepartmentChange} animationType="slide"
        onShow={() => {
          props.getDepartments()
        }}>
        <View style={styles.departmentModelContainer}>
          <View style={styles.departmentModelHeader}>
            <View style={styles.departmentModelHeaderEmpty} />
            <Text style={styles.departmentModelHeaderTitle}>Departamentos</Text>
            <TouchableOpacity style={styles.departmentModelActionButton} onPress={() => setOpenedDepartmentChange(false)}>
              <CloseIcon fill="rgba(0,0,0,0.2)"
                height={styles.departmentModelHeaderEmpty.height}
                width={styles.departmentModelHeaderEmpty.width} />
            </TouchableOpacity>
          </View>
          <View style={styles.departmentModelListContainer}>
            <FlatList
              ListHeaderComponent={() => (<View style={{ marginTop: 5 }} />)}
              keyExtractor={(_, index) => index.toString()}
              data={props.departments}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity style={styles.departmentContainer} onPress={() => {
                    if (menuOptionSelectedName === "change_department")
                      changeDepartmentService(item)

                    else if (menuOptionSelectedName === "change_attendant")
                      changeAttendantService(item)
                  }}>
                    <View style={styles.departmentImage}>
                      <Text style={styles.departmentImageText}>{item.name[0].toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.departmentModelName}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal transparent visible={opnedAttendantChange} animationType="slide">
        <View style={[styles.departmentModelContainer]}>
          <View style={styles.departmentModelHeader}>
            <TouchableOpacity style={styles.departmentModelActionButton} onPress={() => setOpnedAttendantChange(false)}>
              <BackIcon fill="rgba(0,0,0,0.2)"
                height={styles.departmentModelHeaderEmpty.height}
                width={styles.departmentModelHeaderEmpty.width} />
            </TouchableOpacity>
            <Text style={styles.departmentModelHeaderTitle}>Transferir para {selectedDepartmentName}</Text>
            <View style={styles.departmentModelHeaderEmpty} />
          </View>
          <View style={[styles.departmentModelListContainer, { paddingHorizontal: 0 }]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (<View style={{ marginTop: 5 }} />)}
              keyExtractor={(_, index) => index.toString()}
              data={props.attendants}
              renderItem={({ item }) => <Attendant {...item} navigation={props.navigation} />}
            />
          </View>
        </View>
      </Modal>

      <Rendering render={rederingOptionsMenu}>
        <MenuOptions
          menuOptionSelectedName={menuOptionSelectedName}
          openedDepartmentChange={openedDepartmentChange}
          openedOptionsMenu={openedOptionsMenu}
          opnedAttendantChange={opnedAttendantChange}
          setMenuOptionSelectedName={setMenuOptionSelectedName}
          setModalEndService={setModalEndService}
          setOpenedDepartmentChange={setOpenedDepartmentChange}
          setOpenedOptionsMenu={setOpenedOptionsMenu}
          setOpnedAttendantChange={setOpnedAttendantChange}
          setRederingOptionsMenu={setRederingOptionsMenu}
        />
      </Rendering>
    </React.Fragment>
  )
}

const mapStateToProps = (state: any) => ({
  channel: state.chat.channel,
  messages: state.chat.messages,
  loadingProcess: state.chat.loadingProcess,
  loadingStart: state.chat.loadingStart,
  selectedOption: state.contacts.selectedOption,
  imagesList: state.chat.imagesList,
  imagesOpened: state.chat.imagesOpened,
  attendants: state.attendments.attendants,
  departments: state.attendments.departments,
  currentParticipant: state.chat.currentPaticipant
})

const mapDispatchToProps = {
  ...contactActions,
  ...chatActions,
  ...attendmentsActions
}

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Chat)

const styles = StyleSheet.create({
  alignAllCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    // backgroundColor: '#e8eefd',
    backgroundColor: '#fdfdfe',
    flex: 1,
    zIndex: 9999,
  },
  messagesContainer: {
    paddingHorizontal: 25,
  },
  loadingMessages: {
    position: "absolute",
    zIndex: 20,
    height, width
  },
  galeryScroll: {
    position: "absolute",
    zIndex: 999999,
    height: height,
    width: width,
    elevation: 20,
    backgroundColor: "black"
  },
  departmentModelContainer: {
    position: "absolute",
    backgroundColor: "white",
    // elevation: 25,
    width: "100%",
    height: "100%",
    // top: "50%",
    bottom: 0,
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  departmentModelActionButton: {
    backgroundColor: "rgba(0,0,0,0.1)",
    width: 35, height: 35,
    borderRadius: 100,
    justifyContent: "center", alignItems: "center"
  },
  departmentModelListContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 20,
    // paddingTop: 40
  },
  departmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15
    // paddingLeft: 25
  },
  departmentImage: {
    backgroundColor: "#5d5dd5",
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
    // elevation: 1
  },
  departmentImageText: {
    color: "white",
    fontSize: 18,
    fontFamily: font.MontserratBold
  },
  departmentModelName: {
    fontFamily: font.MontserratBold,
    fontSize: 15
  },
  departmentModelHeader: {
    paddingVertical: 20,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderBottomColor: "rgba(0,0,20,0.05)",
    borderBottomWidth: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  departmentModelHeaderTitle: {
    fontFamily: font.MontserratBold,
    color: "#0f2334",
    textTransform: "uppercase",
    fontSize: 13
  },
  departmentModelHeaderEmpty: {
    height: 25,
    width: 25
  },
  // menuBottomItemContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginVertical: 8
  // },
  // menuBottomCicleIcon: {
  //   width: 42, height: 42, borderRadius: 100,
  //   justifyContent: "center", alignItems: "center",
  //   backgroundColor: "#eaeafa",
  //   marginRight: 10
  // },
  // menuBottomTitle: {
  //   fontSize: 16,
  //   fontFamily: font.MontserratMedium
  // }
})