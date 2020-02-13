import React, { useState, useEffect } from 'react'
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native'
import { Container, Content, Button, Body, Text, Card, CardItem} from 'native-base'
import {Calendar} from 'react-native-calendars';
import CustomHeader from '../../components/common/CustomHeader'
import AsyncStorage from '@react-native-community/async-storage';

export default function CalenderScreen() {
    const [students, setStudents] = useState([])
    const [events, setEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(0)
    const [selectedDate, setSelectedDate] = useState(getCurrentDate())
    const screenWidth = Dimensions.get('window').width
    const optimumLayoutWidth = screenWidth - screenWidth/10
    
    useEffect( () => {
        async function fetchStudentsAndEvents(){
            const cachedData = await AsyncStorage.getItem('cachedData')
            const JSONDATA = JSON.parse(cachedData)
            setStudents(JSONDATA.students)
            setEvents(JSONDATA.events)
        }
        fetchStudentsAndEvents() 
    }, [])

    function formatDate(date){
        // date = 2020-02-22
        const dates = date.split('-')
        const day = dates[2]
        const months = [
            'January', 'February', 'March', 'April', 'May',
            'June', 'July', 'August', 'September', 'October', 
            'November', 'December'
        ]
        const month = months[
            dates[1] >= 10 ? dates[1] - 1: dates[1]%10 - 1 
        ]
        return month + ' ' + day + ', ' + dates[0]
        // February 22, 2020
    }

    function getCurrentDate(){
        const date = new Date()

        let day = date.getDate()
        day = day >= 10 ? day : '0' + day 

        let month = date.getMonth() + 1
        month = month >= 10 ? month : '0' + month

        return date.getFullYear() + '-' + month + '-' + day
    }

    function filterEventsForStudentChange(selectedStudent){
        const filteredEvents = events.filter(e => {
            if(!e.studentName)
                return e
            else
                return e.studentName.split(' ')[0] === selectedStudent 
        })
        setFilteredEvents(filteredEvents)
    }

    function filterEventsForDateChange(selectedDate){
        console.log("Events: ", JSON.stringify(events))
        const filteredEvents = events.filter(e => e.dateTime && e.dateTime.split(' ')[0] === selectedDate)
        setFilteredEvents(filteredEvents)
    }

    function handleStudentChange(student, index){
        setSelectedStudent(index)
        filterEventsForStudentChange(student.firstName)
    }

    function handleDateChange(selectedDate){
        setSelectedDate(selectedDate)
        filterEventsForDateChange(selectedDate)
    }
    let markedDates = {}
    markedDates[selectedDate] = { selected: true }
    events.forEach(event => {
        event.dateTime && (
            markedDates[event.dateTime.split(' ')[0]] = {
                marked: true,
                selected: event.dateTime.split(' ')[0] === selectedDate
            }
        )
        
    })
    console.log("MarketDatess: ", markedDates)
    return (
        <Container> 
            <CustomHeader title="Calender" />
            {/* <ScrollView> */}
            <Content 
                contentContainerStyle={styles.container}>
                <View style={{
                    flex:1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }}>
                    {
                        students.map((student, index) => 
                        (
                            <Button 
                                key = {student.firstName}
                                rounded 
                                bordered
                                light 
                                style = {
                                    index === selectedStudent ?
                                    styles.selectedStudent :
                                    styles.unSelectedStudent
                                }
                                onPress = { (student) => handleStudentChange(student, index)} >
                                    <Text style = {
                                        index === selectedStudent ?
                                        styles.selectedStudentText :
                                        styles.unSelectedStudentText
                                    }>{ student.firstName }</Text>
                            </Button>
                            
                        ))
                    }
                </View>
                
                <View 
                    style={{   
                        borderColor: '#f2f2f2',
                        borderWidth: 4,
                        borderStyle:'solid',
                        borderWidth: 2,
                        overflow:'hidden',
                        borderTopColor: '#2C96EA',
                        height: 'auto',
                        width: optimumLayoutWidth,
                    }}>
                    <Calendar
                        monthFormat={'MMM yyyy'}
                        hideExtraDays={true}
                        firstDay={1}
                        minDate={getCurrentDate()}
                        onMonthChange={(month) => {console.log('month changed', month)}}
                        onPressArrowLeft={substractMonth => substractMonth()}
                        onPressArrowRight={addMonth => addMonth()}
                        style={{
                            borderWidth: 1,
                            borderColor: '#f2f2f2',
                            shadowOffset:{
                                width: 5,
                                height:2
                            },
                            shadowOpacity: 0.4
                        }}
                        onDayPress={day => handleDateChange(day.dateString)}
                        markedDates = {markedDates}
                        theme={{
                            todayTextColor: '#F8C732',
                            selectedDayBackgroundColor: '#F8C732',
                            selectedDayTextColor: '#ffffff',
                        }}
                    /> 
                </View >       
                   
                <View style={{width: optimumLayoutWidth, marginTop:10}}> 
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false} 
                        pagingEnabled={true}
                        decelerationRate={10}
                        snapToInterval={100-60}
                        snapToAlignment={'center'}
                        > 
                        {
                            filteredEvents.length > 0 ?
                            filteredEvents.map((event, index)=>(
                                <Card 
                                    style={{
                                        width:
                                        optimumLayoutWidth-6,
                                        shadowOffset:{
                                            width: 0,
                                            height: 0
                                        },
                                        shadowOpacity: 0
                                    }}
                                    key={index}> 
                                    <CardItem 
                                        header 
                                        bordered 
                                        button 
                                        onPress={()=>alert(event)}
                                        style={{
                                            width:
                                            optimumLayoutWidth-6.8,
                                        }}>
                                        <Text
                                        style={{
                                            color: '#2C96EA'
                                        }}>
                                            Event on {formatDate(selectedDate)} 
                                        </Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body  
                                            style={{
                                                width: optimumLayoutWidth-10,
                                                flexWrap: 'wrap', 
                                            }}>
                                            <Text>
                                            {event.title}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            ))
                            :
                            <Text>There is no Event on {formatDate(selectedDate)} </Text>

                        }
                    </ScrollView>
                </View>
            </Content>
            {/* </ScrollView> */}
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectedStudent:{
        backgroundColor: '#2C96EA',
        color: 'white',
        margin: 5,
        maxWidth: 160,
        minWidth: 150,
        justifyContent: 'center'
    },
    unSelectedStudent:{
        backgroundColor: '#f2f2f2',
        margin: 5,
        maxWidth: 160,
        minWidth: 150,
        justifyContent: 'center'
    },
    selectedStudentText:{
        color: 'white',
    },
    unSelectedStudentText:{
        color: '#808080'
    },
    content:{

    }
});
  