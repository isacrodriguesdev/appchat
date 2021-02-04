import React, { useEffect, useRef, useState } from "react"
import { TouchableOpacity, View, Text, StyleSheet, FlatList } from "react-native"
import Animated, { Easing, Extrapolate } from "react-native-reanimated"
import Logout from "~/components/icons/Logout"
import { font } from "../../app"
import { useAuth } from "../../contexts/auth"
// imports

export default function Menu(props) {

  const { logout } = useAuth()
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {

    Animated.timing(animatedValue, {
      toValue: props.enable ? props.size : 0,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.ease
    }).start()
  }, [props.enable])


  return (
    <Animated.View style={[styles.floatContainer, {
      top: animatedValue.interpolate({
        inputRange: [0, props.size],
        outputRange: [0, props.size]
      })
    }, {
      opacity: animatedValue.interpolate({
        inputRange: [0, props.size],
        outputRange: [0, 1],
        extrapolate: Extrapolate.CLAMP,
      })
    }]}>
      <View style={{ height: 40, width: "100%" }}>
        <TouchableOpacity onPress={logout} style={styles.buttonContainer} disabled={!props.enable}>
          <Logout fill="black" height="15" width="15" style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: font.MontserratBold, zIndex: 0, fontSize: 12, textTransform: "uppercase" }}>
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  floatContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "white",
    elevation: 20,
    right: 50,
    borderRadius: 4,
    zIndex: 999999999999,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  }
})