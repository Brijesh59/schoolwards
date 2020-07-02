/**
 * @format
 */
import {AppRegistry} from 'react-native';
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/messaging'

import App from './src/components/App';
import {name as appName} from './app.json';
import FirebaseConfig from './src/utils/Firebase'
import { cachePayloadData } from './src/utils/functions'
console.disableYellowBox = true 
// firebase.messaging().setBackgroundMessageHandler( async (remoteMessage) => {
//     let firebase = new FirebaseConfig()
//     console.log('FCM Message Back/AppClosed :)');
//     const JSONData = JSON.parse(remoteMessage.data.note)
//     const payload  = JSONData.non_interaction_attributes.display_attributes
//     // Cache the payload data...
//     // await cachePayloadData()
//     // send local notification
//     await firebase.sendLocalNotification(payload.title);
// });

AppRegistry.registerComponent(appName, () => App);

