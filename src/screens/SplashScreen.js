import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import AsyncStorage from '@react-native-community/async-storage'
import * as Progress from 'react-native-progress'

import config from '../utils/config'
const schoolLogo = '../assets/schoolLogo.png'

class SplashScreen extends Component {
    state = {
        progress: 0
    }
    
    componentDidMount = async() => {

        let loadingInterval = setInterval(()=>{
            this.setState( {
                progress: this.state.progress + 0.1
            })
        }, 200)

        setTimeout(async () => {
            const isUserLoggedIn = await AsyncStorage.getItem('isUserLoggedIn')
            const isFirstTimeUse = await AsyncStorage.getItem('isFirstTimeUse')

            clearInterval(loadingInterval)

            if(isFirstTimeUse === null){
                Actions.onBoardingScreeen()
            }
            else if(isUserLoggedIn === 'true'){
                Actions.dashboard()
            }
            else{
                Actions.auth()
            }
        }, 2000)
    }

    render() {
        return (
            <View style={styles.container}>
               <Image 
                    source={require(schoolLogo)} 
                    style={styles.imgStyle} />
               <Progress.Bar 
                    progress={this.state.progress} 
                    width={250} 
                    unfilledColor='#8DC6F3' 
                    color={config.secondaryColor}
                    borderWidth={0} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    imgStyle:{
        marginBottom: 20,
        width: 200,
        height: 200
    }
})

export default SplashScreen