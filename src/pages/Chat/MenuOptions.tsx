import * as React from "react"
import { Image, TouchableWithoutFeedback, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Animated, { Easing, Extrapolate, interpolateColors } from "react-native-reanimated"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useStore } from "react-redux"
import colors from "../../../theme"
import { font } from "~/app"
import { height } from "~/app/window"
import Rendering from "~/components/Rendering"

interface Props {
  setOpnedAttendantChange(opened: boolean): void
  setOpenedDepartmentChange(opened: boolean): void
  setOpenedOptionsMenu(opened: boolean): void
  setMenuOptionSelectedName(value: string): void
  setRederingOptionsMenu(redering: boolean): void
  setModalEndService(opened: boolean): void
  openedDepartmentChange: boolean
  opnedAttendantChange: boolean
  openedOptionsMenu: boolean
  menuOptionSelectedName: string
}

const animatedModelMaxValue = (height / 100) * 40

function MenuOptions(props: Props) {

  const store = useStore()

  let offsetModelBottom = React.useRef(new Animated.Value(-1))
  const animatedModalValue = React.useRef(new Animated.Value(animatedModelMaxValue)).current

  const onGestureEvent = Animated.event([{
    nativeEvent: {
      translationY: animatedModalValue,
      state: offsetModelBottom
    }
  }], { nativeDriver: false })

  React.useEffect(() => {
    Animated.timing(animatedModalValue, {
      toValue: props.openedOptionsMenu ? 0 : animatedModelMaxValue,
      duration: 150,
      easing: Easing.ease,
    }).start(() => {
      props.setRederingOptionsMenu(props.openedOptionsMenu ? true : false)
    })

  }, [props.openedOptionsMenu])


  function providerDepartment(option: string) {
    props.setMenuOptionSelectedName(option)
    props.setOpenedDepartmentChange(true)
  }

  return (
    <TouchableWithoutFeedback onPress={(e) => {
      e.stopPropagation()
      props.setOpenedOptionsMenu(false)
    }}>
      <Animated.View style={[{
        height: "100%",
        width: "100%",
        zIndex: 999999,
        position: "absolute",
        alignItems: "flex-end",
        justifyContent: "flex-end"
      },
      // @ts-ignore
      {
        backgroundColor: interpolateColors(animatedModalValue, {
          inputRange: [0, animatedModelMaxValue],
          outputColorRange: ["rgba(0,0,0,.8)", "transparent"]
        })
      }
      ]}>
        {/* <PanGestureHandler
          maxPointers={1}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={function (e) {
            if (e.nativeEvent.oldState === State.ACTIVE) {
              // animatedModalValue.setValue(0)
            }
          }}
        > */}
        <TouchableWithoutFeedback>
          <Animated.View style={[{
            backgroundColor: "white",
            elevation: 20,
            // height: (height / 100) * 40,
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            padding: 20,
            zIndex: 9999999,
          }, {
            transform: [{
              translateY: animatedModalValue.interpolate({
                inputRange: [0, animatedModelMaxValue],
                outputRange: [0, animatedModelMaxValue],
                extrapolate: Extrapolate.CLAMP,
              })
            }]
          }]}>

            <View>
              <View style={styles.menuBottomItemContainer}>
                <View style={styles.menuBottomCicleIcon}>
                  <Image source={{ uri: store.getState().chat.currentParticipant.image }} style={{
                    width: "100%",
                    height: "100%"
                  }} borderRadius={100} />
                </View>
                <Text style={[styles.menuBottomTitle, { fontFamily: font.MontserratSemiBold }]}>
                  {store.getState().chat.currentParticipant.name}
                </Text>
              </View>

              <TouchableOpacity style={styles.menuBottomItemContainer} onPress={() => {
                providerDepartment("change_department")
              }}>
                <View style={styles.menuBottomCicleIcon}>
                  <Icon name="autorenew" color={colors.primaryColor} size={20} />
                </View>
                <Text style={styles.menuBottomTitle}>Transferir departamento</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuBottomItemContainer} onPress={() => {
                providerDepartment("change_attendant")
              }}>
                <View style={styles.menuBottomCicleIcon}>
                  <Icon name="swap-horiz" color={colors.primaryColor} size={20} />
                </View>
                <Text style={styles.menuBottomTitle}>Transferir atendente</Text>
              </TouchableOpacity>

              <Rendering render={store.getState().chat.currentParticipant.status === "open"}>
                <TouchableOpacity style={styles.menuBottomItemContainer} onPress={() => {
                  props.setOpenedOptionsMenu(false)
                  props.setModalEndService(true)
                }}>
                  <View style={[styles.menuBottomCicleIcon, { backgroundColor: "#ffe6e6" }]}>
                    <Icon name="close" color="#ff4d4d" size={20} />
                  </View>
                  <Text style={[styles.menuBottomTitle, { color: "#ff4d4d" }]}>Encerrar atendimento</Text>
                </TouchableOpacity>
              </Rendering>

            </View>

          </Animated.View>
        </TouchableWithoutFeedback>
        {/* </PanGestureHandler> */}
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default MenuOptions

const styles = StyleSheet.create({
  menuBottomItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },
  menuBottomCicleIcon: {
    width: 40, height: 40, borderRadius: 100,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#eaeafa",
    marginRight: 10
  },
  menuBottomTitle: {
    fontSize: 16,
    fontFamily: font.MontserratMedium
  }
})