import React, { useState } from 'react'
import { View, StyleSheet, Image, Alert } from 'react-native'
import { Card, CardItem, Left, Text, Right, Body, Button, Icon } from 'native-base'
import {AnnouncementIcon, CalendarIcon, HomeworkIcon, MessageIcon, NewsIcon, TimetableIcon, ContactIcon, ContactsIcon, TagIcon} from './Icons'
import { cacheFile } from '../../utils/functions'
import AsyncStorage from '@react-native-community/async-storage'
import FileViewer from 'react-native-file-viewer';
import ActivityLoader from './ActivityLoader'
import {formatDateTime} from '../../utils/functions'

export default function CustomCard({title, type, description, to, studentName, dateTime, createdOn,onCardPressed, attatchment, attatchmentExtention, updateHomeState}) {

    const [isAttatchDownloadSuccess, setIsAttatchDownloadSuccess] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const getIcon = (iconType) => {
        switch(iconType.toLowerCase()){
            case 'announcement': 
                return <AnnouncementIcon />
            case 'event': 
                return <CalendarIcon />
            case 'homework': 
                return <HomeworkIcon />
            case 'message':
                return <MessageIcon />
            case 'news':
                return <NewsIcon />  
            case 'timetable':
                return <TimetableIcon />          
            default: 
                return ''
        }
    }
    
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
        FileViewer.open(attatchment)
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
        const data = await cacheFile(attatchment, attatchmentExtention).then(d => d)
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
            if(event.title === title && event.description === description){
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
                            {title}
                        </Text>
                    </Left>
                    <Right>
                        { getIcon(type) }
                    </Right>
                </CardItem>
                <CardItem onPress={()=>onCardPressed()}>
                    <Body>
                        <Text style={styles.description}>          
                            {description}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        { 
                            attatchment != null && (
                                attatchment.includes('http') ? 
                                downloadAttatchment :
                                openAttatchment 
                            )
                        }
                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        { to === "all" ? <ContactsIcon /> : <ContactIcon /> }
                        <Text style={styles.normal}>
                            {studentName}
                        </Text>
                    </Left>
                </CardItem>
                <CardItem footer bordered>
                    <Left>
                        <TagIcon />
                        <Text style={styles.normal}>
                            {type}
                        </Text>
                    </Left>
                    <Left>
                        <Text style={styles.normal}>
                            {formatDateTime(createdOn)}
                        </Text>
                    </Left>
                </CardItem>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  
      justifyContent: 'center',
      alignItems: 'center',
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
});
