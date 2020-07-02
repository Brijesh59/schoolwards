import { Platform } from 'react-native'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-community/async-storage'
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from "@react-native-community/push-notification-ios"

import app_config from './config'
import { cachePayloadData } from './functions'
import NetworkRequest from './NetworkRequest'

export default class FirebaseConfig{

  async checkPermission() {
    console.log('Checking for FCM Permission ...');
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      console.log('User not reqistered for FCM. Requesting Permission ...', enabled.toString());
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('Permission Rejected! => ', error);
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('fcmToken: ', fcmToken);
        return fcmToken;
      }
      console.log('fcmToken: ', fcmToken);
    }
    console.log('fcmToken: ', fcmToken);
    return fcmToken;
  }

  createForegroundNotificationListeners() {
    console.log('Listening for Foreground messages ...')
    // const unsubscribe = firebase.messaging().onMessage(async (remoteMessage) => {
    //   console.log('FCM Message in Foreground :)')
    //   const JSONData = JSON.parse(remoteMessage.data.note)
    //   const payload  = JSONData.non_interaction_attributes.display_attributes
    //   // Cache the payload data...
    //   await cachePayloadData()
    //   // send local notification
    //   await this.sendLocalNotification(payload);
    // });
    // return unsubscribe
  }

  createBackgroundNotificationListener() {
    console.log('Listening for Background messages ...')
    firebase.messaging().setBackgroundMessageHandler( (remoteMessage) => {
      console.log('FCM Message Back/AppClosed :)');
      const JSONData = JSON.parse(remoteMessage.data.note)
      const payload  = JSONData.non_interaction_attributes.display_attributes
      // await AsyncStorage.setItem('isUserLoggedIn', 'false')
      this.sendLocalNotification(payload);
    });
  }

  onFirebaseTokenRefresh(mobile){
    const unSubscribeFromTokenRefresh = firebase.messaging().onTokenRefresh( async (fcmToken) => {
      console.log('Firebase Token Refreshed.')
      // Update fcmToken in localStore
      await AsyncStorage.setItem('fcmToken', fcmToken)

      // Update backend server with new fcmToken
      let formData = new FormData();
      formData.append('mobile', mobile)
      formData.append('deviceid', fcmToken)
      formData.append('appname', app_config.schoolName)
        
      const newtworkRequest = new NetworkRequest()
      const data = await newtworkRequest.updateFCMToken(formData)
      if(data.status === 'success')
        console.log('Token Updated on Server.')  
      else
        console.log('Token Updated on Server Failed: ', data) 
    });
    return unSubscribeFromTokenRefresh
  }

  async sendLocalNotification(payload) {
    const [notification, vibration] = await AsyncStorage.multiGet(["notification", "notificationTone", "vibration"])
    if( Platform.OS === 'android') {
      PushNotification.localNotification({
        message: payload,
        smallIcon: 'icon.png',
        largeIcon: 'icon.png',
        vibrate: vibration[1]==='true' ? true : false,
        playSound: notification[1]==='true' ? true : false,
        soundName: "default",
        importance: "high",
        priority: "high",
      })
    }
    else{
      console.log('Notification Recieved ...')
      PushNotificationIOS
        .requestPermissions()
        .then((permissions) => {
          PushNotificationIOS.getInitialNotification({
            alertTitle: payload,
            alertBody: payload,
            isSilent: notification[1]==='true' ? true : false
          });
        })
    }  
  }

}  
