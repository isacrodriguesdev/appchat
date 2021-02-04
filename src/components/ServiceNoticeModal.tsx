import React, { memo, useMemo } from "react"
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Modal } from "react-native"
import { font } from "~/app"
import { width } from "~/app/window"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"

interface Props {
  buttonTextConfirm: string
  buttonTextCancel: string
  title: string
  message: string
  icon: string
  color: string
  colorButtonConfirm?: string
  colorButtonCancel?: string
  colorButtonTextConfirm?: string
  colorButtonTextCancel?: string
  enable: boolean
  onPressConfirm(event?: GestureResponderEvent): void
  onPressCancel(event?: GestureResponderEvent): void
  onPressForeground?(event?: GestureResponderEvent): void
}
// "error-outline"
// "#ffb380"

function Warn(props: Props) {

  return useMemo(() => {
    return (
      <Modal  transparent visible={props.enable} animationType="fade">
        <TouchableWithoutFeedback onPress={props.onPressForeground}>
          <View style={styles.foreground}>
            <View style={styles.container}>

              <View style={styles.headerContainer}>
                <MaterialIcon name={props.icon} color={props.color} size={60} />
                <View style={styles.messageContainer}>
                  <Text style={styles.messageTitle}>
                    {props.title}
                  </Text>
                  <Text style={styles.messageText}>
                    {props.message}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonsContainer}>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.buttonAction,
                    props.colorButtonCancel ? { backgroundColor: props.colorButtonCancel } : {}
                  ]}
                  onPress={props.onPressCancel}>
                  <Text style={styles.buttonText}>
                    {props.buttonTextCancel}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.buttonAction,
                    {
                      // elevation: 5,
                      backgroundColor: props.colorButtonConfirm ? props.colorButtonConfirm : props.color
                    }
                  ]}
                  onPress={props.onPressConfirm}>
                  <Text style={[
                    styles.buttonText,
                    props.colorButtonTextConfirm ? { color: props.colorButtonTextConfirm } : {},
                    props.colorButtonTextConfirm === "white" ? {
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowRadius: 0,
                    } : {}
                  ]}>
                    {props.buttonTextConfirm}
                  </Text>
                </TouchableOpacity>

              </View>

            </View>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }, [
    props.enable
  ])
}

export default memo(Warn)

const styles = StyleSheet.create({
  foreground: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 9999999999,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.8)"
  },
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    // height: (width / 100) * 65,
    width: "92%",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 25
  },
  headerContainer: {
    alignItems: 'center'
  },
  messageTitle: {
    // textTransform: "uppercase",
    fontSize: 20,
    fontFamily: font.QuicksandBold
  },
  messageText: {
    textAlign: "center",
    marginTop: 5
  },
  messageContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // marginTop: 20
  },
  buttonAction: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 40,
    backgroundColor: "rgba(0,0,0,.1)",
    marginRight: 10,
    borderRadius: 100
  },
  buttonText: {
    fontFamily: font.MontserratSemiBold
  }
})