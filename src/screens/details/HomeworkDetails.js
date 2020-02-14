import React,{ useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardItem, Left, Text, Icon, Right, Body, Button } from 'native-base'
import FileViewer from 'react-native-file-viewer'

import {AnnouncementIcon, CalendarIcon, HomeworkIcon, MessageIcon, NewsIcon, TimetableIcon, ContactIcon, ContactsIcon, TagIcon} from '../../components/common/Icons'
import { cacheFile, formatDateTime, getEvent, updateEventAttatchment } from '../../utils/functions'
import config from '../../utils/config'
import ActivityLoader from '../../components/common/ActivityLoader'


export default function HomeworkDetails(props) {
    
    const updateHomeState = props.updateHomeState
    const [details, setDetails] = useState({})
    const [isAttatchDownloadSuccess, setIsAttatchDownloadSuccess] = useState(false)
    const [downloading, setDownloading] = useState(false)
    
    async function fetchData(){
        const details = await getEvent(props.details.id)
        setDetails(details)
    }
    useEffect(()=>{
        fetchData()
    }, [])
   
    const handleAttatchmentOpen = () => {
        FileViewer.open(details.attatchment)
            .then(res => {})
            .catch(error => {})
    } 
    
    const handleAttatchmentDownload = async() => {
        setDownloading(true)
        const data = await cacheFile(details.attatchment, details.attatchmentExtention).then(d => d)
        if(data.isFileSaved){
            await updateEventAttatchment(details.id, data.filePath) 
            setIsAttatchDownloadSuccess(true)  
            await updateHomeState()
            await fetchData()
            setDownloading(false) 
        }
        else{
            setIsAttatchDownloadSuccess(false)
            setDownloading(false)
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
    
    console.log('Homework Screen Re-rendered ...', details)
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
        color: config.primaryColor, 
        fontWeight: '400',
        fontSize: 14,
        width: '100%'
    },
    iconStyle:{
        color: config.primaryColor,
        fontSize: 22
    }
});
