import React, { useEffect, useState, useRef, Fragment, useMemo } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useStateWithCallbackLazy } from "use-state-with-callback"
// imports
import styles from '../styles'
import PlayIcon from "~/components/icons/Play"
import PauseIcon from "~/components/icons/Pause"
import DateText from '~/components/DateText.tsx'
import Animated, { Easing, sub, Value } from 'react-native-reanimated'
import moment from 'moment'
import md5 from 'md5'
import RNFS from "react-native-fs"
import { Player } from "@react-native-community/audio-toolkit"
// components

function MessageAudio(props: any) {

  let localFile = `${RNFS.DocumentDirectoryPath}/${md5(props.id)}.${props.type.split("/")[1]}`

  const [player, setPlayer] = useState(new Player(localFile))
  const [currentTime, setCurrentTime] = useState(props.file_duration)
  const [width, setWidth] = useState(0)
  const [playing, setPlaying] = useStateWithCallbackLazy(false)
  const animatedValue = useRef(new Value(0)).current

  // sera que era por causa do hash?
  useEffect(() => {
    downloadFile()
  }, [props.id, props.file, props.file_duration, props.hash])

  async function downloadFile() {
    const exists = await RNFS.exists(localFile)

    if (!exists) {
      await RNFS.downloadFile({ fromUrl: props.file, toFile: localFile }).promise
    }
  }

  function finish() {
    setPlaying(false, () => null)
    Animated.timing(animatedValue, {
      duration: 100,
      toValue: 0,
      easing: Easing.inOut(Easing.linear),
    }).start()
    setPlayer(new Player(localFile))
    setCurrentTime(props.file_duration)
  }

  function start() {
    let seconds = Math.floor(player.currentTime / 1000)
    Animated.timing(animatedValue, {
      duration: 250,
      toValue: ((seconds * 100) / (props.file_duration * 100)) * 100,
      easing: Easing.inOut(Easing.linear),
    }).start(() => {
      setCurrentTime(seconds)
      getCurrentTime()
    })
  }

  function getCurrentTime() {
    if (player.isStopped)
    finish()
    else if (player.isPlaying)
    start()
    else return
  }

  function playPause() {
    if (!playing) {
      setPlaying(true, () => null)
      player.play(() => {
        getCurrentTime()
      })
    } else {
      setPlaying(false, () => null)
      player.pause(() => null)
    }
  }

  function handleSideStyle() {
    return [
      {
        width: "100%",
        paddingHorizontal: 0,
        justifyContent: props.received ? "flex-end" : "flex-start",
        alignItems: "center",
        flexDirection: "row"
      },
      styles.marginVertical,
    ];
  }

  function handleContainerStyle() {
    return [
      styles.messageAudioContainer,
      {
        backgroundColor: props.received ? "#5d5dd5" : "#ececf3",
        paddingHorizontal: 0,
      }
    ]
  }

  function handleIcon() {
    if (!playing)
      return <PlayIcon fill={props.received ? "white" : "black"} height={14} width={14} style={{ left: 1 }} />
    else
      return <PauseIcon fill={props.received ? "white" : "black"} height={14} width={14} />
  }

  const timer = useMemo(() => moment.utc(moment.duration(currentTime, "seconds").asMilliseconds()).format("m:ss"), [currentTime])

  return (
    <Fragment>
      <DateText date={props.created_at} received={props.received} />
      {/* @ts-ignore */}
      <View style={handleSideStyle()}>
        <View style={handleContainerStyle()}>
          <TouchableOpacity style={{
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.2)"
          }} onPress={playPause}>
            {handleIcon()}
          </TouchableOpacity>

          <View style={{
            width: "80%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }} onLayout={(event) => {
            setWidth(Math.round((event.nativeEvent.layout.width / 100) * 75))
          }}>
            <View style={{
              width: width, height: 3,
              backgroundColor: props.received ? "rgba(20,20,40,0.2)" : "rgba(20,20,40,0.1)",
              marginLeft: 10,
              borderRadius: 100,
              justifyContent: "center",
            }}>
              <Animated.View style={[
                {
                  height: 3,
                  backgroundColor: props.received ? "white" : "black",
                  marginLeft: 0,
                  borderRadius: 100,
                  justifyContent: "center",
                },
                {
                  width: animatedValue.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, width],
                    extrapolate: Animated.Extrapolate.CLAMP
                  })
                }
              ]}>
                <Animated.View style={[
                  {
                    borderRadius: 100,
                    backgroundColor: props.received ? "white" : "black",
                    width: 10.5, height: 10.5,
                  },
                  {
                    left: animatedValue.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, sub(width, 5)],
                      extrapolate: Animated.Extrapolate.CLAMP
                    })
                  }
                ]} />
              </Animated.View>
            </View>
            <View>
              <Text style={{
                fontSize: 12,
                color: props.received ? "white" : "rgba(0,0,0,0.8)",
                bottom: 1,
                fontWeight: "500",
              }}>
                {timer}
              </Text>
            </View>

          </View>
        </View>
      </View>
    </Fragment>
  )
}

export default MessageAudio

// View style = { styles.contactAvatar } >
//   <Image
//     source={{ uri: props.participant.image }}
//     style={[
//       {
//         width: '100%',
//         height: '100%',
//         borderRadius: styles.contactAvatar.borderRadius
//       }
//     ]}
//   />
//               </View >