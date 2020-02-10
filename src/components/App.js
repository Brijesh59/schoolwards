
import React, {Component} from 'react'
import {StatusBar} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Router from './Router'
import FirebaseConfig from '../utils/Firebase'

export default class App extends Component{

  constructor(props){
    super(props)
    this.firebase = new FirebaseConfig()
  }
  
  componentDidMount = async() => {
    this.firebase.checkPermission();
    // this.unsubscribe = this.firebase.createForegroundNotificationListeners();
    const isUserLogged = await AsyncStorage.getItem('isUserLoggedIn')
    console.log("IsUserLoggedIn: ", isUserLogged)
  }

  componentWillUnmount() {
    // this.unsubscribe()
  }

  render(){
    return (
      <> 
        <StatusBar 
          backgroundColor="#3295E9" 
          barStyle="light-content" />
        <Router />  
      </>
    )
  }
}  


