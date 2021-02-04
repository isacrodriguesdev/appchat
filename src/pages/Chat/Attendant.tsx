import React, { useEffect, useRef, memo, useState, useMemo } from 'react'
import { View, StyleSheet, Image, Text, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native'
import { font } from '../../app'
import colors from '../../../theme'
// imports
import * as contactActions from '../../store/duck/contacts'
// types
// components
import moment from 'moment'
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import Rendering from '~/components/Rendering'
import { connect } from 'react-redux'
import { width } from '../../app/window'
import Animated, { Easing, Extrapolate } from 'react-native-reanimated'
import { useAuth } from '~/contexts/auth'
// actions

function Contact(props: any) {

  const { socket, user } = useAuth()

  const animatedValue = useRef(new Animated.Value(width / 2)).current

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.ease
    }).start()
  }, [])


  return (
    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#eaeafa', false)}
      onPress={() => {

        socket.emit("change_transfer_attendant", {
          requestOf: {
            id: props.currentParticipant.id,
            department_id: user.departmentId,
            branch_id: user.branchId,
            group_channel: user.groupChannel
          },
          requestTo: {
            id: props.id,
            department_id: props.department_id,
            branch_id: props.branch_id,
          },
          contact: {
            ...props.currentParticipant,
            attendant_id: props.id
          }
        })

        props.navigation.goBack()
      }}>

      <Animated.View
        style={[styles.container,
        //   {
        //   transform: [{
        //     translateX: animatedValue.interpolate({
        //       inputRange: [0, width / 2],
        //       outputRange: [0, width / 2],
        //       extrapolate: Extrapolate.CLAMP
        //     })
        //   }]
        // },
        {
          opacity: animatedValue.interpolate({
            inputRange: [0, width / 2],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
          })
        }
        ]}>
        <TouchableWithoutFeedback onPress={() => props.openProfileImage({ show: true, uri: props.image })}>
          <View style={styles.photoContainer}>
            {props.status === "online" ? <View style={styles.totalMessagesCircle} /> : null}
            <Image style={[{ width: "100%", height: "100%" }]}
              resizeMode="cover"
              source={{ uri: props.image }}
              borderRadius={200}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={{ flex: 1 }}>

          <View style={styles.rightItemsContainer}>

            <View style={styles.nameContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nameText}>
                {props.name}
              </Text>
            </View>

            {/* <View style={styles.bottomItemsContainer}>
                <View style={styles.lastMessageContainer}>
                  <Text style={[styles.lastMessageText]} numberOfLines={1} ellipsizeMode="tail">
                    {status == "online" ? "Online" : "Offline"}
                  </Text>
                </View>
              </View> */}

          </View>
        </View>
      </Animated.View>
    </TouchableNativeFeedback >
  )
}

const mapStateToProps = (state: any) => ({
  currentParticipant: state.chat.currentParticipant
});

const mapDispatchToProps = { ...contactActions }

export default connect(mapStateToProps, mapDispatchToProps)(Contact)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    // marginBottom: 20,
    // paddingLeft: 30,
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
    fontFamily: font.MontserratMedium,
    fontSize: 12,
    color: '#2e2e2e',
    marginLeft: 2,
    bottom: 1,
  },
  lastMessageDateText: {
    fontSize: 11.5,
    color: '#212743'
  },
  totalMessagesCircle: {
    backgroundColor: "#22d366",
    borderRadius: 30,
    height: 12,
    width: 12,
    borderWidth: 3,
    borderColor: "white",
    // elevation: 1,
    top: 1,
    marginRight: 5,
    position: "absolute",
    zIndex: 999,
    right: -3,
    // justifyContent: 'center',
    // alignItems: 'center',
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
    // justifyContent: "space-between"
  },
  nameText: {
    fontFamily: font.MontserratSemiBold,
    fontSize: 14,
    color: '#212743'
  },
  photoContainer: {
    width: 50,
    height: 50,
    zIndex: 1,
    elevation: 0,
    borderRadius: 200,
  },
  tagStatus: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
    // justifyContent: "center", 
    // alignItems: "center",
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
    marginTop: 3,
    flexDirection: "row",
    // justifyContent: "space-between"
  },
  rightItemsContainer: {
    paddingLeft: 10,
    // justifyContent: "flex-start",
    // alignItems: "center",
    // flexDirection: "row"
  },
})
