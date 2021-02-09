import React, { Component, memo, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import colors from '../../../theme'
import { font } from '../../app'

import MoreIcon from '~/components/icons/More'
// imports
import * as contactActions from '../../store/duck/contacts'
import * as chatActions from '../../store/duck/chat'
// types
// components
import ArrowBack from '~/components/icons/ArrowBack'
import { useAuth } from '../../contexts/auth'
import { NavigationProp } from '@react-navigation/native'
import { UseAuthProps } from '../../../Types'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { MaterialIcons } from '~/app/icon'
import Rendering from '~/components/Rendering'
import { compose } from 'redux'

// props.route.params.selectedOption

interface StateProps {
  navigation: NavigationProp<any>
  participant: any
  route?: any
  currentParticipant: any
}

interface DispatchProps {
  onPressMore(): void
}

type Props = StateProps & DispatchProps

function Header(props: Props) {

    return (
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: "space-between"
        }}>

          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: "center" }}>
            <View style={styles.backAndOptionsContainer}>
              <TouchableWithoutFeedback onPress={() => {
                props.navigation.goBack()
              }}>
                <View style={{ paddingHorizontal: 20, paddingVertical: 18, paddingRight: 6 }} >
                  <ArrowBack fill="black" height={23} width={23} />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.contactAvatar}>
                <Image
                  source={{ uri: props.participant.image }}
                  style={[
                    {
                      width: '100%',
                      height: '100%',
                      borderRadius: styles.contactAvatar.borderRadius,
                    }
                  ]}
                />
              </View>
              <View style={styles.nameAndVisitContainer}>
                <Text style={[styles.nameText, { color: "black" }]}>{props.participant.name}</Text>
                <Text style={[{
                  fontFamily: font.OpenSansSemiBold,
                  color: "rgba(0,0,0,1)",
                  fontSize: 12
                }]}>{props.participant.number.replace("@c.us", "")}</Text>
              </View>
            </View>
          </View>

          <Rendering render={props.currentParticipant.status === "open"}>
            <TouchableOpacity style={{
              paddingHorizontal: 20,
              paddingVertical: 18,
              flexDirection: "row",
            }} onPress={props.onPressMore}>
              <MaterialIcons name="more-horiz" size={28} color="black" />
            </TouchableOpacity>
          </Rendering>

          {/* {
            props.currentParticipant.attendant_id ? (
              <TouchableOpacity onPress={() => {
                props.setActivateNoticeClose()
              }}>
                <View style={styles.callContainer}>
                  <MaterialIcon name="speaker-notes-off" size={23} color="white" />
                </View>
              </TouchableOpacity>
            ) : null
          } */}
        </View>
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

function provider() {
  return (WrappedComponent: any) => {
    return (props: Props) => {
      return props.currentParticipant.status ? <WrappedComponent {...props} /> : null
    }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  provider()
)(memo(Header))

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#5d5dd5",
    backgroundColor: "white",
    width: '100%',
    // elevation: 5,
    borderBottomColor: "rgba(0,0,0,.04)",
    borderBottomWidth: 1
    // borderBottomLeftRadius: 13,
    // borderBottomRightRadius: 13,
  },
  backAndOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 100,
    // elevation: 2
  },
  nameAndVisitContainer: {
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  nameText: {
    color: '#efeff0',
    fontSize: 15,
    fontFamily: font.OpenSansSemiBold,
  },
  latestVisitText: {
    color: 'rgba(0,0,15,0.35)',
    fontFamily: font.MontserratMedium,
    fontSize: 13
  },
  callContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: 'center',
  },
  floatContainer: {
    position: "absolute",
    backgroundColor: "white",
    elevation: 2,
    right: 50,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 24,
  }
})
