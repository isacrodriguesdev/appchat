import React, { memo, useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import colors from "../../../theme"
import { MaterialIcons } from "~/app/icon"

function Notice(props: any) {

  if (props.notice === "closed_")
    return (
      <View style={styles.menuBottomItemContainer}>
        <View style={[styles.menuBottomCicleIcon, { backgroundColor: "#ffe6e6", },
        !props.received ? { marginRight: 10 } : { marginLeft: 10 }
        ]}>
          <MaterialIcons name="close" color={"#ff4d4d"} size={18} />
        </View>
      </View>
    )
  else if (props.notice === "closed")
    return (
      <View style={styles.menuBottomItemContainer}>
        <View style={[styles.menuBottomCicleIcon, { backgroundColor: "#eaeafa", },
        !props.received ? { marginRight: 10 } : { marginLeft: 10 }
        ]}>
          <MaterialIcons name="check-circle-outline" color={colors.primaryColor} size={18} />
        </View>
      </View>
    )
  else
    return null
}

export default memo(Notice)

const styles = StyleSheet.create({
  menuBottomItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuBottomCicleIcon: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeafa",
  }
})