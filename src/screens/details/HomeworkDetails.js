import React,{ useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardItem, Left, Text, Icon, Right, Body, Button } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import FileViewer from 'react-native-file-viewer'

import {AnnouncementIcon, CalendarIcon, HomeworkIcon, MessageIcon, NewsIcon, TimetableIcon, ContactIcon, ContactsIcon, TagIcon} from '../../components/common/Icons'
import { cacheFile, formatDateTime } from '../../utils/functions'

import ActivityLoader from '../../components/common/ActivityLoader'
import { Actions } from 'react-native-router-flux'

export default function HomeworkDetails(props) {
    const details = props.details
    const updateHomeState = props.updateHomeState
    console.log("Details: ", details)
    console.log("updateHomeState: ", updateHomeState)
    const [isAttatchDownloadSuccess, setIsAttatchDownloadSuccess] = useState(false)
    const [downloading, setDownloading] = useState(false)
   
    const openAttatchment = 
         <Button 
            rounded
            style={{backgroundColor: '#F7F8F7', color: 'black',elevation:0,shadowOpacity:0,shadowColor:'transparent'}}
            iconLeft 
            onPress={()=>handleAttatchmentOpen()}>
            <Icon name="attach" style={{color: '#363636', transform: [{rotateZ: '30deg'}]}}/>
            <Text style={{color: '#363636'}}>Open</Text>
        </Button>

    const handleAttatchmentOpen = () => {
        console.log('Open')
        FileViewer.open(details.attatchment)
            .then(res => {})
            .catch(error => {})
    }
    
    const downloadAttatchment = 
        <Button 
            rounded
            disabled={downloading}
            style={{backgroundColor: '#F7F8F7', color: 'black',elevation:0,shadowOpacity:0,shadowColor:'transparent'}}
            iconLeft 
            onPress={() => handleAttatchmentDownload()}>
            <Icon name="attach" style={{color: '#363636', transform: [{rotateZ: '30deg'}]}}/>
            {
                downloading ? 
                <ActivityLoader /> :
                <Text style={{color: '#363636'}}>Download</Text>
            } 
        </Button>


    const handleAttatchmentDownload = async() => {
        setDownloading(true)
        const data = await cacheFile(details.attatchment, details.attatchmentExtention).then(d => d)
        if(data.isFileSaved){
            await updateAttatchmentPathLocally(data.filePath) 
            setIsAttatchDownloadSuccess(true)  
            setDownloading(false) 
            updateHomeState()
        }
        else{
            setIsAttatchDownloadSuccess(false)
            setDownloading(false)
        }
    }

    const updateAttatchmentPathLocally = async (filePath) => {
        const cachedData = await AsyncStorage.getItem('cachedData')
        const JSONData = JSON.parse(cachedData)
        const events = JSONData.events
        events.forEach(event => {
            if(event.title === details.title && event.description === details.description){
                event.attatchment = filePath
            }
        })
        const dataToSave = {
            students: [...JSONData.students],
            events: events
        }
        await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))
    }

    return (
        <View>
            <Card style={styles.container} >
                <CardItem header bordered >
                    <Left>
                        <Text style={styles.title}>
                            {details.title}
                        </Text>
                    </Left>
                    <Right>
                        <Icon name="journal" style={styles.iconStyle} />
                    </Right>
                </CardItem>
                <CardItem >
                    <Body>
                        <Text style={styles.description}>
                            {details.description}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        { 
                            details.attatchment != null && (
                                details.attatchment.includes('http') ? 
                                downloadAttatchment :
                                openAttatchment 
                            )
                        }
                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        <Icon name={
                            details.to === "all" ?
                            'contacts' :
                            'contact'
                        } style={styles.iconStyle} />
                        <Text style={styles.normal}>
                            {details.studentName}
                        </Text>
                    </Left>
                </CardItem>
                <CardItem footer bordered>
                    <Left>
                        <Icon name='pricetag' style={styles.iconStyle} />
                        <Text style={styles.normal}>
                            {details.type}
                        </Text>
                    </Left>
                    <Left>
                        <Text style={styles.normal}>
                        {formatDateTime(details.createdOn)}
                        </Text>
                    </Left>
                </CardItem>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      shadowOpacity: 0
    },
    title: { 
        color: '#363636',
        fontWeight: '600'
    },
    description:{
        color: '#707070', 
    },
    normal: {
        color: '#2C96EA', 
        fontWeight: '400',
        fontSize: 14,
        width: '100%'
    },
    iconStyle:{
        color: '#2C96EA',
        fontSize: 22
    }
});
