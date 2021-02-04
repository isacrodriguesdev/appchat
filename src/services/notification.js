import OneSignal from 'react-native-onesignal'

export default {
  configure() {
    OneSignal.setLogLevel(7, 0)
    OneSignal.init('b5aba632-25ab-43de-8778-e180e7611a32', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 0,
    })

    OneSignal.inFocusDisplaying(0)

    return OneSignal
  }
}
