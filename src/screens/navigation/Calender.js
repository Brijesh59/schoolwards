import React, { useState, useEffect } from 'react'
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native'
import { Container, Content, Button, Body, Text, Card, CardItem} from 'native-base'
import {Calendar} from 'react-native-calendars'
import CustomHeader from '../../components/common/CustomHeader'
import {formatDate, getCurrentDate, getData} from '../../utils/functions'
import config from '../../utils/config'

export default function CalenderScreen() {
    const [students, setStudents] = useState([])
    const [events, setEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const [selectedStudent, setSelectedStudent] = useState(0)
    const [selectedDate, setSelectedDate] = useState(getCurrentDate())
    const [markedDates, setMarkedDates] = useState({})
    const screenWidth = Dimensions.get('window').width
    const optimumLayoutWidth = screenWidth - screenWidth/10
    
    useEffect(() => {
        async function fetchStudentsAndEvents(){
            const JSONDATA = await getData()
            setStudents(JSONDATA.students)
            setEvents(JSONDATA.events)
        }
        fetchStudentsAndEvents() 
    }, [])

    useEffect(() => {
        handleMarkedDate()
    }, [students, events])


    useEffect(() => {
        handleMarkedDate()
    }, [selectedStudent])

    useEffect(() => {
        handleMarkedDate()
    }, [selectedDate])

    function filterEventsForStudentChange(selectedStudent){
        const filteredEvents = events.filter(e => {
            if(e.dateTime && e.dateTime.split(' ')[0] === selectedDate && !e.studentName)
                return e
            else
                return e.dateTime && e.dateTime.split(' ')[0] === selectedDate && e.studentName.split(' ')[0] === selectedStudent 
        })
        setFilteredEvents(filteredEvents)
    }

    function filterEventsForDateChange(selectedDate){
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

    function handleMarkedDate(){
        console.log("Set MarkedDate Called, ", events)
        let tempMarkedDates = {}
        tempMarkedDates[selectedDate] = { selected: true }
        events.forEach(event => {
            if( event.dateTime && !event.studentName){
                tempMarkedDates[event.dateTime.split(' ')[0]] = {
                    marked: true,
                    selected: event.dateTime.split(' ')[0] === selectedDate
                }
            }
            else if(event.dateTime && event.studentName.split(' ')[0] === students[selectedStudent].firstName){
                tempMarkedDates[event.dateTime.split(' ')[0]] = {
                    marked: true,
                    selected: event.dateTime.split(' ')[0] === selectedDate
                }
            }
        })
        console.log("Marked Dates, ", tempMarkedDates)
        setMarkedDates(tempMarkedDates)
    }
    
    const studentsList = students.map((student, index) => 
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
            onPress = { student => handleStudentChange(student, index)} >
                <Text 
                    style = {
                        index === selectedStudent ?
                        styles.selectedStudentText :
                        styles.unSelectedStudentText
                    }>
                    { student.firstName }
                </Text>
        </Button>
    )

    return (
        <Container> 
            <CustomHeader title = "Calender" />
            <Content contentContainerStyle = { styles.container }>
                <View style = { styles.studentsSection }>
                    { studentsList }
                </View>
                
                <View style={[styles.calendarSection, {width: optimumLayoutWidth}] }>
                    <Calendar
                        monthFormat={'MMM yyyy'}
                        hideExtraDays={true}
                        firstDay={1}
                        minDate={getCurrentDate()}
                        onDayPress={day => handleDateChange(day.dateString)}
                        markedDates = {markedDates}
                        onPressArrowLeft={substractMonth => substractMonth()}
                        onPressArrowRight={addMonth => addMonth()}
                        style={styles.calendarStyle}
                        theme={{
                            todayTextColor: config.secondaryColor,
                            selectedDayBackgroundColor: config.secondaryColor,
                            selectedDayTextColor: '#ffffff',
                        }}
                    /> 
                </View>       
                   
                <View style={{ width: optimumLayoutWidth, marginTop: 10}}> 
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
                                        width: optimumLayoutWidth-6,
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
                                        style={{width: optimumLayoutWidth-6.8}}>
                                        <Text
                                        style={{color: config.primaryColor}}>
                                            Event on {formatDate(selectedDate)} 
                                        </Text>
                                    </CardItem>
                                    <CardItem>
                                        <Body  
                                            style={{width: optimumLayoutWidth-10, flexWrap: 'wrap' }}>
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
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    studentsSection: {
        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    calendarSection:{
        borderColor: '#f2f2f2',
        borderWidth: 4,
        borderStyle:'solid',
        borderWidth: 2,
        overflow:'hidden',
        borderTopColor: config.primaryColor,
        height: 'auto',
    },
    calendarStyle:{
        borderWidth: 1,
        borderColor: '#f2f2f2',
        shadowOffset:{
            width: 5,
            height:2
        },
        shadowOpacity: 0.4
    },
    selectedStudent:{
        backgroundColor: config.primaryColor,
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
})
  