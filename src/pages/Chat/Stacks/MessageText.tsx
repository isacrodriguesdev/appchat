import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, Image, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { MaterialIcons } from '~/app/icon';
import Rendering from '~/components/Rendering';
import colors from '../../../../theme';
import { font } from '../../../app';
import DateText from '~/components/DateText.tsx';
import Notice from '../Notice';
// imports
import globalStyle from '../styles'
// types
// components
import * as Indicators from 'react-native-indicators';

function MessageText(props: any) {

  // styles
  function handleSideStyle() {
    return [
      {
        justifyContent: props.received ? "flex-end" : "flex-start",
        flexDirection: "row",
      },
      { ...globalStyle.marginVertical },
    ];
  }

  function handleContainerStyle(): StyleProp<ViewStyle>[] {
    return [
      props.received ? globalStyle.messageReceivedTextContainer : globalStyle.messageReceivedTextContainer,
      {
        borderRadius: 20,
        backgroundColor: props.received ? "#5d5dd5" : "#ececf3",
      }
    ]
  }

  function handleTextContainerStyle() {
    return [
      props.received ? globalStyle.messageReceivedText : globalStyle.messageSentText,
    ]
  }

  return (
    <React.Fragment>
      <DateText date={props.created_at} received={props.received} />
      {/* @ts-ignore */}
      <View style={handleSideStyle()}>
        <Rendering render={!props.received && props.notice}>
          <View style={globalStyle.contactAvatar}>
            <Notice notice={props.notice} />
          </View>
        </Rendering>
        <View style={[
          handleContainerStyle(), { flexDirection: "row", elevation: props.sender === "client" ? 0 : 0 }]}>
          <Text style={handleTextContainerStyle()}>
            {props.message}
          </Text>
          <Rendering render={props.sending}>
            <View style={{ borderRadius: 100, paddingHorizontal: 5 }}>
              <Indicators.DotIndicator color="white" size={6} count={3} />
            </View>
          </Rendering>
        </View>

        <Rendering render={props.received && props.notice}>
          <View style={globalStyle.contactAvatar}>
            <Notice notice={props.notice} received={props.received} />
          </View>
        </Rendering>

      </View>
    </React.Fragment>
  )
}

export default memo(MessageText)