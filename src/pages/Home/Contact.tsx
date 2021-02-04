import React, { useEffect, useRef, memo, useState, useMemo } from 'react'
import { View, StyleSheet, Image, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native'
import { font } from '../../app'
// imports
import LastMessageController from "~/controllers/LastMessageController"
import * as contactActions from '../../store/duck/contacts'
// types
// components
import moment from 'moment'
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import Rendering from '~/components/Rendering'
import { connect } from 'react-redux'
import { width } from '../../app/window'
import Animated, { Easing, Extrapolate } from 'react-native-reanimated'
// actions

function Contact(props: any) {

  const [messageStatus, setMessageStatus] = useState<any>({
    icon: "textsms",
    last_message: props.user.last_message
  })
  const animatedValue = useRef(new Animated.Value(width / 2)).current
  const [lastMessageAt, setLastMessageAt] = useState<string>("")

  useEffect(() => {

    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease
    }).start()

  }, [])

  useEffect(() => {

    const Message = new LastMessageController({
      type: props.user.last_message_type,
      message: props.user.last_message
    })

    if (props.user.status === "close") {
      return setMessageStatus({
        last_message: props.user.number.replace("@c.us", ""),
      })
    }

    let properties = props.user.last_message_type && props.user.last_message_type !== "chat" ? { icon: Message.icon } : {}

    setMessageStatus({
      last_message: Message.text,
      ...properties
    })

  }, [props.user])

  useEffect(() => {

    if(props.user.last_message_at)
      formatDateLastMessage()

  }, [props.user.last_message_at])

  function formatDateLastMessage() {

    let timestamp = new Date(props.user.last_message_at).getTime()
    let oneDay = (Date.now() / 1000) > (timestamp / 1000) + 86400

    if (oneDay)
      setLastMessageAt(moment(props.user.last_message_at).format("DD/MM/YY"))
    else
      setLastMessageAt(moment(props.user.last_message_at).format("HH:mm"))
  }
  // props.user.status === "close" 
  // props.user.last_message === "@closed_attendment@"

  return useMemo(() => {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        <Animated.View
          style={[styles.container,
          {
            opacity: animatedValue.interpolate({
              inputRange: [0, width / 2],
              outputRange: [1, 0],
              extrapolate: Extrapolate.CLAMP
            })
          },
          {
            transform: [{
              translateX: animatedValue.interpolate({
                inputRange: [0, width / 2],
                outputRange: [0, width / 2],
                extrapolate: Extrapolate.CLAMP
              })
            }]
          },
          ]}>
          <TouchableWithoutFeedback onPress={() => props.openProfileImage({ show: true, uri: props.user.image })}>
            <View style={styles.photoContainer}>
              <Image style={[{ width: "100%", height: "100%" }]}
                resizeMode="cover"
                source={{ uri: props.user.image }}
                borderRadius={200}
              />
            </View>
          </TouchableWithoutFeedback>

          <View style={{ flex: 1 }}>

            <View style={styles.rightItemsContainer}>
              <View style={styles.nameContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nameText}>
                  {props.user.name}
                </Text>

                <Text style={styles.lastMessageDateText}>
                  {lastMessageAt}
                </Text>
              </View>

              <View style={styles.bottomItemsContainer}>
                <View style={styles.lastMessageContainer}>
                  <Rendering render={props.user.status === "open" && props.user.last_message_type !== "chat"}>
                    <MaterialIcon name={messageStatus.icon} color="rgba(0,0,30,.30)" size={14} />
                  </Rendering>
                  <Text style={styles.lastMessageText} numberOfLines={1} ellipsizeMode="tail">
                    {messageStatus.last_message}
                  </Text>
                </View>

                <Rendering render={props.user.unread_messages && props.user.attendant_id}>
                  <View style={styles.totalMessagesContainer}>
                    <View style={styles.totalMessagesCircle}>
                      <Text style={styles.totalMessagesText}>
                        {props.user.unread_messages}
                      </Text>
                    </View>
                  </View>
                </Rendering>
              </View>

            </View>
          </View>
        </Animated.View>
      </TouchableNativeFeedback>
    )
  }, [
    props.user,
    messageStatus
  ])
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = { ...contactActions }

export default connect(mapStateToProps, mapDispatchToProps)(Contact)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    // marginBottom: 20,
    borderBottomColor: "rgba(0,0,20,0.04)",
    borderBottomWidth: 1,
  },
  onlinePoint: {
    position: 'relative',
    marginLeft: 5,
    elevation: 0,
    top: 2
  },
  lastMessageContainer: {
    width: "85%",
    flexDirection: "row",
    alignItems: "flex-end"
  },
  lastMessageText: {
    fontFamily: font.MontserratSemiBold,
    fontSize: 11,
    color: 'rgba(0,0,30,.30)',
    marginLeft: 1,
    top: 0.5
  },
  lastMessageDateText: {
    fontSize: 11.5,
    color: '#212743'
  },
  totalMessagesContainer: {
    position: "absolute",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: 0
  },
  totalMessagesCircle: {
    backgroundColor: "#5d5dd5",
    borderRadius: 30,
    height: 20,
    width: 20,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalMessagesText: {
    color: 'white',
    fontSize: 11,
    bottom: 0.5,
    fontFamily: font.RobotoMedium
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between"
  },
  nameText: {
    fontFamily: font.MontserratSemiBold,
    fontSize: 14,
    color: '#212743'
  },
  photoContainer: {
    width: 56,
    height: 56,
    zIndex: 1,
    elevation: 0,
    borderRadius: 200,
  },
  tagStatus: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center", alignItems: "center",
  },
  tagStatusText: {
    fontSize: 12,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.05)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  bottomItemsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rightItemsContainer: {
    paddingLeft: 10,
    justifyContent: "flex-end"
  },
})
