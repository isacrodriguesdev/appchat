import React, { useEffect, useState, useRef, memo, useMemo, useCallback, Fragment } from 'react'
import { View, TouchableOpacity, Text, Image, ViewProps, StyleProp, ViewStyle } from 'react-native'
// import fs from "react-native-fs"
import Sound from 'react-native-sound'
// imports
import styles from '../styles'
import PlayIcon from "~/components/icons/Play"
import PauseIcon from "~/components/icons/Pause"
import colors from '../../../../theme'
import DateText from '~/components/DateText.tsx'
import Animated, { Easing, sub, Value, clockRunning, useCode, cond, set, timing, startClock, not, useValue } from 'react-native-reanimated'
import font from '../../../app/font'
import Loading from '~/components/Loading'
import moment from 'moment'
import { useTiming, defineAnimation, withBouncing, } from "react-native-redash";
import md5 from 'md5'
import RNFS from "react-native-fs"
// components

function MessageAudio(props: any) {

  // let soundPlayer = new Sound(props.file, undefined)
  let audio: any = null

  const [localFile, setLocalFile] = useState<string>(
    `${RNFS.DocumentDirectoryPath}/${md5(props.id)}.${props.type.split("/")[1]}`
  )
  const [currentTime, setCurrentTime] = useState(props.file_duration)
  const [sound, setSound] = useState<any>(null)
  const [width, setWidth] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const animatedValue = useRef(new Value(0)).current

  useEffect(() => {
    setCurrentTime(props.file_duration)
  }, [props.file_duration])

  useEffect(() => {
    setLocalFile(`${RNFS.DocumentDirectoryPath}/${md5(props.id)}.${props.type.split("/")[1]}`)
  }, [props.id])

  useEffect(() => {
    downloadFile()
  }, [props.file])

  async function downloadFile() {
    const exists = await RNFS.exists(localFile)

    if (!exists) {
      setSound(loadAudioFile())
      await RNFS.downloadFile({ fromUrl: props.file, toFile: localFile }).promise
      setLocalFile(localFile)
    } else {
      setSound(loadAudioFile())
      setLocalFile(localFile)
    }
  }

  function eventGetCurrentTime(audio: any) {
    audio.getCurrentTime((seconds: number, playing: boolean) => {
      if (playing) {

        Animated.timing(animatedValue, {
          duration: 200,
          toValue: (Math.floor(seconds * 100) / (props.file_duration * 100)) * 100,
          easing: Easing.inOut(Easing.linear),
        }).start(() => {
          setCurrentTime(seconds)
          eventGetCurrentTime(audio)
        })
      }

    })
  }

  function loadAudioFile() {
    return new Sound(localFile, Sound.LIBRARY, (error) => {
      console.log("status", error)
      if (error) {
        console.log(error)
      }
    })
  }

  const eventAudio = async function () {

    if (!isPlaying) {
      setIsPlaying(true)

      sound.play((success: boolean) => {
        console.log("sound success", success)
        sound.stop(() => {
          setSound(loadAudioFile())
          animatedValue.setValue(0)
          setCurrentTime(props.file_duration)
          setIsPlaying(false)
        })
      })
      eventGetCurrentTime(sound)

    } else {
      sound.pause()
      setIsPlaying(false)
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
    if (!isPlaying)
      return <PlayIcon fill={props.received ? "white" : "black"} height={14} width={14} style={{ left: 1 }} />
    else
      return <PauseIcon fill={props.received ? "white" : "black"} height={14} width={14} />
  }

  // const timer = useMemo(() => moment.utc(moment.duration(currentTime, "seconds").asMilliseconds()).format("m:ss"), [currentTime])

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
          }} onPress={eventAudio}>
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
              <Animated.View style={{
                width: animatedValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, width],
                  extrapolate: Animated.Extrapolate.CLAMP
                }), height: 3,
                backgroundColor: props.received ? "white" : "black",
                marginLeft: 0,
                borderRadius: 100,
                justifyContent: "center",
              }}>
                <Animated.View style={{
                  borderRadius: 100,
                  backgroundColor: props.received ? "white" : "black",
                  width: 10.5, height: 10.5,
                  left: animatedValue.interpolate({
                    inputRange: [0, 100],
                    outputRange: [0, sub(width, 5)],
                    extrapolate: Animated.Extrapolate.CLAMP
                  })
                }} />
              </Animated.View>
            </View>
            <View>
              <Text style={{
                fontSize: 12,
                color: props.received ? "white" : "rgba(0,0,0,0.8)",
                bottom: 1,
                fontWeight: "500",
              }}>
                {moment.utc(moment.duration(currentTime, "seconds").asMilliseconds()).format("m:ss")}
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