import {StyleSheet} from 'react-native';
import {font} from '../../app';
import { width } from '../../app/window';

// global style
const styles = StyleSheet.create({
  messageTextContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f5fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // paddingRight: 60,
    // paddingBottom: 10,
    borderRadius: 10,
    // borderBottomRightRadius: 3,
    maxWidth: '80%',
    zIndex: 999999,
  },
  messageText: {
    color: "rgba(0,0,0,.8)",
    top: 0,
    fontFamily: font.OpenSansSemiBold,
    fontSize: 13,
  },
});

export default StyleSheet.create({
  // received text
  messageReceivedTextContainer: {
    ...styles.messageTextContainer,
    borderWidth: 0,
  },
  messageReceivedText: {
    ...styles.messageText,
    color: "white",
  },
  // sent text
  messageSentTextContainer: {
    ...styles.messageTextContainer,
    borderBottomLeftRadius: 15,
  },
  messageSentText: {
    ...styles.messageText,
  },
  // image
  messageImageContainer: {
    maxWidth: '80%',
    maxHeight: 300,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },
  marginVertical: {
    marginVertical: 2,
  },
  messageAudioContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.01)',
    maxWidth: '80%',
    zIndex: 9999999,
  },
  contactAvatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    // elevation: 2,
    marginRight: 10
  },
});
