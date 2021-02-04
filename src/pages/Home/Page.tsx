import { NavigationProp } from '@react-navigation/native'
import React, { useEffect, useRef, useState, memo, useMemo } from 'react'
import { View, StyleSheet, Image, Text, Animated, FlatList } from 'react-native'
import { height, width } from '../../app/window'
import { useAuth } from '../../contexts/auth'
import { font } from '../../app'
import Contact from './Contact'
import NotFound from "~/components/icons/NotFound"
import AsyncStorage from '@react-native-community/async-storage'
import jwtDecode from 'jwt-decode'
import { UseAuthProps } from 'Types'
import Loading from '~/components/Loading'
// actions

interface StateProps {
  navigation: NavigationProp<any>
  users: any
  loading: boolean
}

interface DispatchProps {
  onEndReached(): void
}

type Props = StateProps & DispatchProps

function Page(props: Props) {

  if (props.loading)
    return (
      <View style={{ flex: 1, width }}>
        <Loading />
      </View>
    )

  return (
    <View style={{ flex: 1, width }}>
      <FlatList
        initialNumToRender={10}
        ListEmptyComponent={() => (
          <View style={{
            marginTop: 30,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
            <Text style={{
              fontSize: 25,
              fontFamily: font.MontserratSemiBold,
              color: "#cccccc",
            }}>
              Nada encontrado
              </Text>
            <View style={{ marginTop: 5, width: width - 50 }}>
              <Text style={{
                textAlign: "center",
                fontFamily: font.MontserratMedium,
              }}>
                No momento não a contatos nessa aba
              </Text>
            </View>
          </View>
        )}
        onEndReachedThreshold={0.3}
        onEndReached={props.onEndReached}
        showsVerticalScrollIndicator={false}
        data={props.users}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Contact
            navigation={props.navigation}
            user={item}
            onPress={() => {
              props.navigation.navigate('Chat', {
                participant: item,
              })
            }}
          />
        )}
      />
    </View>
  )
}

export default memo(Page)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})
