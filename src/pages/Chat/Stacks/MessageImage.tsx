import { connect } from 'react-redux'
import React, { memo, useEffect, useState, Fragment } from 'react'
import { View, Image, Text, TouchableWithoutFeedback, ImageBackground, StyleProp, ViewStyle } from 'react-native'
import { width } from '../../../app/window';
import DateText from '~/components/DateText.tsx';
import Rendering from '~/components/Rendering';
// imports
import styles from '../styles'
import { openImageMessage, addImageMessage } from '../../../store/duck/chat';
import colors from '../../../../theme';
// types
// components

interface StateProps {
  messageImagesOpen: boolean
  received: boolean
}

interface DispatchProps {
  openImageMessage(): void
  addImageMessage(item: any): void
}

type Props = StateProps & DispatchProps

function MessageImage(props: any) {

  useEffect(() => {
    props.addImageMessage({...props})
  }, [])

  // styles
  function handleSideStyle(): StyleProp<ViewStyle> {
    return [
      {
        justifyContent: props.received ? "flex-end" : "flex-start",
        flexDirection: "row"
      },
      styles.marginVertical,
    ];
  }

  function handleContainerStyle(): StyleProp<ViewStyle> {
    return [
      {
        width: "80%",
        paddingHorizontal: 6,
        paddingVertical: 6,
      },
      {
        backgroundColor: props.received ? "#5d5dd5" : "#ececf3",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
      },
    ]
  }

  return (
    <Fragment>
      <DateText date={props.created_at} received={props.received} />
      <View style={handleSideStyle()}>
        <TouchableWithoutFeedback onPress={() => {
          props.addImageMessage({...props})
          props.openImageMessage()
        }}>
          <View style={[handleContainerStyle(), { alignItems: "flex-start" }]}>
            <Image source={{
              uri: props.file,
            }} style={{ width: "100%", height: 250 }} borderRadius={5} resizeMode="cover" />

            <Rendering render={props.message}>
              <View style={{ marginVertical: 5 }}>
                <Text style={{
                  color: props.received ? "white" : "black"
                }}>{props.message}</Text>
              </View>
            </Rendering>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Fragment>
  )
}

const mapStateToProps = (state: any) => ({
  messageImagesOpen: state.chat.messageImagesOpen
})

const mapDispatchToProps = {
  openImageMessage,
  addImageMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(MessageImage))