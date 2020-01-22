import React from 'react'
import AsyncStorage from '@react-native-community/async-storage';
import { Router, Scene, Stack, Actions, Drawer } from 'react-native-router-flux'
import {  Button, Icon } from 'native-base'

import OnBoarding from '../screens/OnBoarding'
import Login from '../screens/Login'
import Dashboard from '../screens/Dashboard'
import Details from '../screens/Details'
import SplashScreen from '../screens/SplashScreen'
import VerifyOTP from '../screens/VerifyOTP'
import SideMenu from '../screens/SideMenu'
import Home from '../screens/Home'
import Profile from '../screens/Profile'
import ContactUs from '../screens/ContactUs'
import AboutUs from '../screens/AboutUs'
import Calender from '../screens/Calender'
import Setting from '../screens/Setting'

const RouterComponent = () => {
    return (
        <>
            <Router>
                <Stack key="root" hideNavBar >
                     
                    <Scene key="splashScreen" component={SplashScreen} direction="left" />
                 
                    <Scene key="onBoarding" hideNavBar>
                        <Scene key="onBoardingScreeen" component={OnBoarding} />
                    </Scene>

                    <Scene key="auth" hideNavBar>
                        <Scene key="login" component={Login} />
                    </Scene>
                    <Scene key="OTP" hideNavBar>
                        <Scene key="verifyOTP" component={VerifyOTP} />
                    </Scene>
 
                    <Scene 
                        key="dashboard" 
                        component={Home} 
                        title="Dashboard" 
                        rightTitle="Log Out"
                        onRight={ async() => {
                            // clear isUserLoggedIn & redirect to auth Page
                            await AsyncStorage.setItem('isUserLoggedIn', 'false')
                            Actions.auth()
                        }}
                        
                    />
                    <Scene 
                        key="details" 
                        component={Details} 
                        title="Details"
                        back={true} /*Show Back Button, instead of drawer button 
                        */
                        />
                    <Scene
                        key="profileScreen"
                        component={Profile}
                        title="Profile"
                    />
                    <Scene
                        key="calenderScreen"
                        component={Calender}
                    />
                    <Scene
                        key="contactUsScreen"
                        component={ContactUs}
                    />
                    <Scene
                        key="aboutUsScreen"
                        component={AboutUs}
                    />
                    <Scene
                        key="settingScreen"
                        component={Setting}
                    />
                </Stack> 
            </Router>   
        </>
    )
}

export default RouterComponent;