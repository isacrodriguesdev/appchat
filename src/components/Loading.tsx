import React from 'react';
import { StyleSheet, View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
// imports
import colors from '../../theme';
// types
// components

interface Props {
  styles?: StyleProp<ViewStyle>,
  size?: "small" | "large"
  color?: string
}

export default function Loading(props: Props) {

  return (
    <View style={[styles.loading, props.styles]}>
      <ActivityIndicator size={!props.size ? "large" : props.size} color={!props.color ? colors.primaryColor : props.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
})