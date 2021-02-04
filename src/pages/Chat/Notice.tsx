import React, { memo, useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import colors from "../../../theme"
import { MaterialIcons } from "~/app/icon"

function Notice(props: any) {

  if (props.notice === "closed")
    return (
      <View style={styles.menuBottomItemContainer}>
        {console.log("chat/notice")}
        <View style={[styles.menuBottomCicleIcon, { backgroundColor: "#eaeafa", }]}>
          <MaterialIcons name="check-circle-outline" color={colors.primaryColor} size={16} />
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
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#eaeafa",
    marginRight: 10
  }
})