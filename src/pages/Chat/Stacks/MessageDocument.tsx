import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, TouchableWithoutFeedback, Linking, StyleProp, ViewStyle } from 'react-native'
import Rendering from '~/components/Rendering';
import colors from '../../../../theme';
import { font } from '../../../app';
import DateText from '~/components/DateText.tsx';
import Notice from '../Notice';
// imports
import globalStyle from '../styles'
import Icon from 'react-native-vector-icons/MaterialIcons'
import RNFS from "react-native-fs"
import FileViewer from 'react-native-file-viewer';
Icon.loadFont();
// types
// components

function MessageDocument(props: any) {

  const [icon, setIcon] = useState("insert-drive-file")

  // styles
  function handleSideStyle(): StyleProp<ViewStyle> {
    return [
      {
        flexDirection: "row",
        justifyContent: props.received ? "flex-end" : "flex-start",
        alignItems: "center",
      },
      { ...globalStyle.marginVertical, paddingHorizontal: 0, padding: 0, },
    ];
  }

  function handleContainerStyle(): StyleProp<ViewStyle> {
    return [
      props.received ? globalStyle.messageReceivedTextContainer : globalStyle.messageReceivedTextContainer,
      {
        borderRadius: 100,
        backgroundColor: props.received ? "#5d5dd5" : "#ececf3",
        paddingHorizontal: 20,
        // paddingVertical: 15
      },
    ]
  }

  function handleTextContainerStyle() {
    return [
      props.received ? globalStyle.messageReceivedText : globalStyle.messageSentText,
      { padding: 0 }
    ]
  }

  useEffect(() => {

    if (props.type.split("/")[0] === "text")
      setIcon("insert-drive-file")

    else if (["application/pdf"].includes(props.type))
      setIcon("picture-as-pdf")

    else if (props.type.split("/")[0] === "audio")
      setIcon("mic")
    else
      setIcon("insert-drive-file")

  }, [props.type])

  return (
    <React.Fragment>
      <DateText date={props.created_at} received={props.received} />
      <TouchableWithoutFeedback onPress={() => {

        const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${props.type.split("/")[1]}`

        RNFS.downloadFile({
          fromUrl: props.file,
          toFile: localFile
        }).promise
          .then(() => FileViewer.open(localFile))
          .then(() => {
            // success
          })
          .catch(error => {
            // error
          })
      }}>
        <View style={handleSideStyle()}>
          <Rendering render={!props.received && props.notice}>
            <View style={globalStyle.contactAvatar}>
              <Notice noticeType={props.noticeType} />
            </View>
          </Rendering>
          <View style={[
            handleContainerStyle(), { flexDirection: "row", elevation: props.sender === "client" ? 0 : 0 }]}>
            <Icon name={icon} color="white" size={18} style={{ marginRight: 3 }} />
            <Text style={handleTextContainerStyle()} numberOfLines={1} ellipsizeMode="middle">
              {props.message}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </React.Fragment>
  )

}

export default memo(MessageDocument)