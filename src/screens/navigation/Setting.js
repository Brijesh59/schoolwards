import React, { useState, useEffect } from 'react'
import {StyleSheet, TouchableOpacity, View, ScrollView, Linking, Platform} from 'react-native'
import Modal from 'react-native-modal'
import { Container, Content, Text, Switch, Radio } from 'native-base'
import { Actions }  from 'react-native-router-flux'
import AsyncStorage from '@react-native-community/async-storage'
import CustomHeader from '../../components/common/CustomHeader'
import CustomButton from '../../components/common/CustomButton'
import config from '../../utils/config'

export default function Setting() {
    const [notificationSound, setNotificationSound] = useState(null)
    const [vibration, setVibration] = useState(null)
    const [showNotificationToneModal, setShowNotificationToneModal] = useState(false)
    const [activeTone, setActiveTone] = useState('Default')
    const [activeToneApplied, setActiveToneApplied] = useState('Default')

    // useEffect(()=>{
    //     console.log('Change in notification')
    //     const save = async() => {
    //         await AsyncStorage.setItem('notification', `${notificationSound}`)
    //     }
    //     save()  
    // },[notificationSound])

    // useEffect(()=>{
    //     console.log('Change in vibration')
    //     const save = async() => {
    //         await AsyncStorage.setItem('vibration', `${vibration}`)
    //         const re = await AsyncStorage.getItem('vibration')
    //         console.log("Change: ", re)
    //     }
    //     save() 
    // },[vibration])

    useEffect(()=>{
        const save = async() => {
            let notification = await AsyncStorage.getItem('notification')
            let vibration =    await AsyncStorage.getItem('vibration')
            console.log("notification before", notification)
            console.log("vibration before", vibration)
            notification = notification === null ? true : notification === 'true'
            vibration =    vibration    === null ? true : vibration === 'true'
            console.log("notification", notification)
            console.log("vibration", vibration)
            setNotificationSound(notification)
            setVibration(vibration)
        }
        save() 
    },[])

    const notificationToneList = ["Default", "Arrow", "Bongo", "Car Lock", "Chess", "Crystal Drop", "Facebook Pop", "Flash", "Guitar", "Mushroom", "Old Bicycle", "Pixies", "Play", "Shimmer", "Step"]

    const handleNotificationSound = async() => {
        await AsyncStorage.setItem('notification', `${!notificationSound}`)
        setNotificationSound(!notificationSound)
    }

    const handleVibration = async() => {
        await AsyncStorage.setItem('vibration', `${!vibration}`)
        setVibration(!vibration)
    }

    const handleToneChange = (tone) => {
       // e.stopPropagation()
        setActiveTone(tone)
        console.log('2', showNotificationToneModal)
    }

    const handleToneApply = () => {
        setActiveToneApplied(activeTone)
        setShowNotificationToneModal(false)
        console.log('applied')
    }

    const handleNotificationToneModalCancel = () => {
        setActiveTone(activeToneApplied)
        setShowNotificationToneModal(false)
        console.log('Canceled')
    }

    const Divider = () => <View style={styles.divider} />
    const Header  = ({text, style}) => 
        <Text style={[styles.header, style]}> {text} </Text> 
    const Title = ({text, style}) => 
        <Text style={[styles.title, style]}> {text} </Text>
    const SubTitle = ({text, style}) => 
        <Text style={[styles.subTitle, style]}> {text} </Text>

    const NotificationToneModal = 
        <Modal 
            isVisible={showNotificationToneModal}
            animationIn='zoomIn'
            animationOut="zoomOut"
            animationInTiming={400}
            animationOutTiming={400}
            backdropTransitionOutTiming={0} // Remove flicker
            onBackdropPress={handleNotificationToneModalCancel}>
            <View style={styles.modalContent}>     
                <Header text="Select Notification Tone" />
                <ScrollView 
                    style={{maxHeight: '80%'}}>
                    {
                        notificationToneList.map((tone => (
                            <TouchableOpacity 
                                onPress={() => handleToneChange(tone)}
                                key={tone}>
                                <View style={{
                                    width: '80%',
                                    marginLeft: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    padding: 8,
                                }}
                                >
                                    <Text style={{color: '#707070', fontSize:16}}>
                                        {tone}
                                    </Text>
                                    <Radio 
                                        selected={activeTone === tone}
                                        color="#707070"
                                        selectedColor={config.primaryColor}
                                    />
                                </View> 
                            </TouchableOpacity>   
                        )))
                    }
                </ScrollView> 
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        padding: 10
                    }}> 
                    <CustomButton 
                        title="Cancel"
                        onPressFunction={handleNotificationToneModalCancel}
                        style={{
                            width: '40%',
                            borderColor: config.primaryColor,
                            borderWidth: 2,
                            borderRadius: 5,
                            backgroundColor: 'white'
                        }}
                    />  
                    <CustomButton 
                        title="Apply"
                        onPressFunction={handleToneApply}
                        style={{width: '40%'}}
                    />      
                </View>
            </View>
        </Modal>   

    return (
        <Container> 
            <CustomHeader title="Settings" />
            <Content 
                contentContainerStyle={styles.container}> 
                <Header text="General" />
                <Divider />
                <View style={styles.group}>
                    <Title text="Notification Sound" />
                    <Switch 
                        value={notificationSound}
                        trackColor={`rgba(44, 150, 234, 0.28)`}
                        thumbColor={`rgba(44, 150, 234, 1)`}
                        style={{ marginTop: 10, }}
                        onValueChange={handleNotificationSound}
                    />
                </View> 
                {/* <Title text="Notification Tone" />    
                <TouchableOpacity onPress={()=>setShowNotificationToneModal(true)}>
                    <SubTitle text={activeToneApplied} style={{paddingBottom: 5}}/>  
                    <SubTitle text="Choose from Files" />
                </TouchableOpacity>     */}
                <Divider />
                <View style={styles.group}>
                    <Title text="Vibration" />
                    <Switch 
                        value={vibration}
                        trackColor={`rgba(44, 150, 234, 0.28)`}
                        thumbColor={`rgba(44, 150, 234, 1)`}
                        style={{ marginTop: 10 }}
                        onValueChange={handleVibration}
                    />
                </View> 
                <Header text="About" />
                <Divider />
                <TouchableOpacity onPress={ () =>
                    Platform.OS === 'android' ?
                    Linking.openURL("market://details?id=googoo.android.btgps") :
                    // Linking.openURL("itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8") 
                    null
                }>
                    <Title text="Rate Us" style={{paddingBottom: 10}}/>
                </TouchableOpacity>
                <Divider />
                <Title  text="Licences" />
                <Header text="User Controls" />
                <Divider />
                <TouchableOpacity onPress={ () =>
                    Platform.OS === 'android' ?
                    Linking.openURL("market://details?id=googoo.android.btgps") :
                    // Linking.openURL("itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8") 
                    null
                }>
                    <Title text="Check for Update" />
                </TouchableOpacity>
                {showNotificationToneModal && NotificationToneModal }
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        margin: 15
    },
    divider: {
        width: "95%",
        marginLeft: 5,
        borderBottomWidth: 2,
        borderBottomColor: "#E4E5E4"
    },
    header: {
        fontSize: 18, 
        color: config.primaryColor, 
        padding: 10
    },
    title: {
        color: '#363636', 
        fontSize:16, 
        paddingLeft: 10, 
        paddingTop: 10, 
        paddingBottom: 5
    },
    subTitle: {
        color: '#707070', 
        fontSize:12, 
        paddingLeft: 10, 
        paddingBottom: 15
    },
    group: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
    },
    modalContent:{
        backgroundColor: 'white',
        width: '90%',
        maxHeight: '85%',
        marginLeft: '5%',
        // paddingTop: 10,
        borderRadius: 5,
    }, 
    modalList: {
        width: '90%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 5,
    }
});
  