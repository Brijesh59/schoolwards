import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Card, CardItem, Left, Text, Right, Body, Button, Icon } from 'native-base'
import ViewMoreText from 'react-native-view-more-text'
import {AnnouncementIcon, CalendarIcon, HomeworkIcon, MessageIcon, NewsIcon, TimetableIcon, ContactIcon, ContactsIcon, TagIcon} from './Icons'
import { cacheFile, updateEventAttatchment } from '../../utils/functions'
import FileViewer from 'react-native-file-viewer';
import ActivityLoader from './ActivityLoader'
import {formatDateTime, postInteractionDetails, updateEventInteractionResponse} from '../../utils/functions'
import config from '../../utils/config'
import {getEventById} from '../../db'

export default function CustomCard({id, title, type, description, to, studentName, createdOn, onCardPressed, attatchment, attatchmentExtention, updateHomeState, updateInteraction, updateAttatchment, interactionAttributes, interactionSubmitUrl, interactionResponse}) {

    const [isAttatchDownloadSuccess, setIsAttatchDownloadSuccess] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [updateInteractionResponse, setUpdateInteractionResponse] = useState(false)
    const [selectedInteraction, setSelectedInteraction] = useState(null)
    const [interactionData, setInteractionData] = useState([])
  
    useEffect( () => {
        if(interactionAttributes[0]){
            const [interactionTypeYes, interactionTypeMaybe, interactionTypeNo] = interactionAttributes
            const dataYes   = JSON.parse(interactionTypeYes)
            const dataMaybe = JSON.parse(interactionTypeMaybe)
            const dataNo    = JSON.parse(interactionTypeNo)
            setInteractionData([dataYes, dataMaybe, dataNo]) 
        }
    }, [])

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
    
    const handleAttatchmentOpen = () => {
        FileViewer.open(attatchment)
            .then(res => {})
            .catch(error => {})
    }

    const handleAttatchmentDownload = async() => {
        setDownloading(true)
        const data = await cacheFile(attatchment, attatchmentExtention).then(d => d)
        if(data.isFileSaved){
            await updateEventAttatchment(id, data.filePath) 
            setIsAttatchDownloadSuccess(true)
            setDownloading(false)
            updateAttatchment()  
        }
        else{
            setIsAttatchDownloadSuccess(false)
            setDownloading(false)
        }
    }

    const handleInteraction = async(interactionDetails) => {
        const details = {
            type: interactionDetails.non_display_attributes.pull_attributes.type,
            eventId: interactionDetails.non_display_attributes.pull_attributes.id, 
            student_id: interactionDetails.non_display_attributes.pull_attributes.student_id,
            tag_name: interactionDetails.non_display_attributes.tag_name
        }
        console.log(details)
        setUpdateInteractionResponse(true)
        setSelectedInteraction(details.tag_name)
       
        const data = await postInteractionDetails(details, interactionSubmitUrl)
        console.log('Data from postInteractionDetails: ', data)
        const updatedEvent = await updateEventInteractionResponse(details.eventId, details.tag_name)
        setUpdateInteractionResponse(false)
        setSelectedInteraction(null)
        if(updatedEvent.interactionResponse === details.tag_name){
           console.log('Updated sucessfully')
           updateInteraction(updatedEvent)
        }
        else{
            console.log('Something went worng. Please try again')
            Alert.alert('Something went worng. Please try again.')
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

    const interactionButtons = interactionAttributes[0] ? interactionData.map((data, index) => 
        <Button 
            key = {index}
            bordered
            light 
            disabled={updateInteractionResponse}
            style = {
                data.non_display_attributes.tag_name === interactionResponse?
                styles.selectedInteraction :
                styles.unSelectedInteraction
            }
            onPress={()=>handleInteraction(data)}>
                <>
                    <Text 
                        style = {
                            data.non_display_attributes.tag_name === interactionResponse?
                            styles.selectedInteractionText :
                            styles.unSelectedInteractionText
                        }>
                        { data.display_attributes.interaction_name }
                    </Text>
                    {   updateInteractionResponse && 
                        selectedInteraction === data.non_display_attributes.tag_name && 
                        <ActivityLoader style={{position: 'absolute'}}/>
                    }
                </>
        </Button>
    ) : null
    
    console.log('Custom Card Rerendered ...', title, interactionResponse)
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
                    <ViewMoreText
                        numberOfLines={2}
                        renderViewMore={ onPress => <></> }
                        renderViewLess={ onPress => <></> }
                        >
                        <Text style={styles.description}>          
                            {description}
                        </Text>
                    </ViewMoreText>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        { 
                            attatchment != '' && (
                                attatchment.includes('http') ? 
                                downloadAttatchment :
                                openAttatchment 
                            )
                        }
                    </Left>
                </CardItem>
                <CardItem>
                    <View style = { styles.interactionSection }>
                        { interactionButtons }
                    </View>
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
        color: config.primaryColor, 
        fontWeight: '400',
        fontSize: 14,
        width: '100%'
    },
    interactionSection: {
        // flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    selectedInteraction:{
        backgroundColor: config.primaryColor,
        color: 'white',
        margin: 5,
        maxWidth: 110,
        minWidth: 90,
        justifyContent: 'center'
    },
    unSelectedInteraction:{
        backgroundColor: '#f2f2f2',
        margin: 5,
        maxWidth: 110,
        minWidth: 90,
        justifyContent: 'center'
    },
    selectedInteractionText:{
        color: 'white',
    },
    unSelectedInteractionText:{
        color: '#808080'
    },
});
