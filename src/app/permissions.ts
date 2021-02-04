import { PermissionsAndroid, Platform } from "react-native"

async function externalStorage () {

  if (Platform.OS === 'android') {
    try {

      const grantedWriteStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permissões para acesso de gravação',
          message: 'Dê permissão ao seu armazenamento para gravar um arquivo',
          buttonPositive: 'ok',
        },
      )

      if (grantedWriteStorage === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage')
      } else {
        console.log('permission denied: PERMISSIONS.WRITE_EXTERNAL_STORAGE')
        return
      }

    } 
    catch (err) {
      console.warn(err)
      return
    }
  }
}

async function recordAudio () {
  
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permissions for write access',
          message: 'Give permission to your storage to write a file',
          buttonPositive: 'ok',
        },
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera')
      } else {
        console.log('permission denied: PERMISSIONS.RECORD_AUDIO')
        return
      }
    } catch (err) {
      console.warn(err)
      return
    }
  }
}

export default { externalStorage, recordAudio }