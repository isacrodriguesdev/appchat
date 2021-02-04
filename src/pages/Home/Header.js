import React, { memo, useEffect, useMemo, useState, Fragment } from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { height, width } from '../../app/window'
import colors from '../../../theme'
import { font } from '../../app'
// icons
// imports
// types
// components
import More from '~/components/icons/More'
import Menu from './Menu'
import Rendering from '~/components/Rendering'
// actions

function Header(props) {

  const [float, setFloat] = useState(false)
  const [size, setSize] = useState(0)

  return (
    <Fragment>
      <LinearGradient style={styles.container}
        colors={["#5d5dd5", colors.primaryColor]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}>
        <View style={styles.titleContainer} onLayout={({ nativeEvent }) => setSize(nativeEvent.layout.height / 4)}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

            <View style={styles.justifyItemsContainer}>
              <Rendering render={props.user.photo}>
                <View style={[styles.contactAvatar]}>
                  <Image
                    source={{ uri: props.user.photo }}
                    style={[
                      {
                        width: '100%',
                        height: '100%',
                        borderRadius: styles.contactAvatar.borderRadius
                      }
                    ]}
                  />
                </View>
              </Rendering>

              <View>
                <Text style={styles.usernameText}>{props.user.name}</Text>
                <Text style={styles.departmentNameText}>{props.user.departmentName}</Text>
              </View>

            </View>

          </View>

          <TouchableWithoutFeedback onPress={() => setFloat(!float)}>
            <View style={[styles.justifyItemsContainer]}>
              <More style={{ left: 1 }} width={18} height={18} fill="#fff" />
            </View>
          </TouchableWithoutFeedback>

        </View>

      </LinearGradient>

      <Menu size={size} enable={float} />
    </Fragment>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryColor,
    height: height,
    width: "100%",
    zIndex: 1
  },
  contactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 100,
    elevation: 0,
    marginRight: 10
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    height: "12%",
  },
  titleText: {
    fontFamily: font.SourceSansProBold,
    fontSize: 28,
    color: '#fff'
  },
  navigationContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  navigationItemContainer: {
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginHorizontal: 12,
  },
  navigationItemText: {
    fontFamily: font.SourceSansProBold,
    fontSize: 16,
    color: 'rgb(195,195,210)'
  },
  navigationItemSelectedContainer: {
    borderBottomWidth: 2
  },
  navigationItemSelectedText: {
    color: 'black'
  },
  justifyItemsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row"
  },
  departmentNameText: {
    color: "rgba(255,255,255,0.6)", fontSize: 12,
    fontFamily: font.MontserratSemiBold,
    bottom: 3
  },
  usernameText: {
    color: "white",
    fontSize: 17,
    fontFamily: font.OpenSansRegular
  }
})

export default memo(Header)