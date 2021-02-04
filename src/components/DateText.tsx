import React, { useCallback } from "react"
import moment from "moment"
import momentLocalePtBr from "moment/locale/pt-br"
import { View, Text } from "react-native"

export default function DateText({ date, received }: any) {

  const days = useCallback(function days(value = 1, divideDay = 1) {
    return ((new Date(date).getTime() / 1000) + (86400 / divideDay)) * value
  }, [date])

  const formatDate = useCallback(function() {

    let lastDate = Date.now() / 1000
    date = new Date(date)

    if (lastDate < days(undefined, 2))
      return moment(date).locale("pt-br", momentLocalePtBr).format("HH:mm")
    else if (lastDate < days())
      return moment(date).locale("pt-br", momentLocalePtBr).format("[ontem ás] HH:mm")
    else if (lastDate < days(7))
      return moment(date).locale("pt-br", momentLocalePtBr).format("ddd [ás] HH:mm")
    else
      return moment(date).locale("pt-br", momentLocalePtBr).format("DD [de] MMM [de] YYYY [ás] hh:mm")
  }, [date])

  return (
    <View style={[
      { width: "100%", marginBottom: 8, marginTop: 2 },
      received ? { alignItems: "flex-end" } : { left: 4 },
    ]}>
      <Text style={{
        fontSize: 12, color: "rgba(0,0,0,0.5)",
      }}>
        {formatDate()}
      </Text>
    </View>
  )
}