import React from 'react'
import {StyleSheet} from 'react-native'
import { Container, Content} from 'native-base'

import AnnouncementDetails from './details/AnnouncementDetails'
import EventDetails        from './details/EventDetails'
import HomeworkDetails     from './details/HomeworkDetails'
import MessageDetails      from './details/MessageDetails'
import NewsDetails         from './details/NewsDetails'
import TimetableDetails    from './details/TimetableDetails'
import CustomHeader        from '../components/common/CustomHeader'

export default function Details({ details, updateHomeState}) {
    const showDetails = () => {
        switch(details.type.toLowerCase()){
            case 'announcement':
                return <AnnouncementDetails details={details} updateHomeState={updateHomeState} />
            case 'event':
                return <EventDetails details={details} updateHomeState={updateHomeState}/>
            case 'homework':
                return <HomeworkDetails details={details} updateHomeState={updateHomeState}/>
            case 'message':
                return <MessageDetails details={details} />
            case 'news':
                return <NewsDetails details={details} updateHomeState={updateHomeState}/>
            case 'timetable':
                return <TimetableDetails details={details} />
            default: 
                return null
        }
    }
    return (
        <Container> 
            <CustomHeader 
                title={details.type}
            />
            <Content 
                contentContainerStyle={styles.container}>
                { showDetails() }
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '98%',
        marginLeft: '1%'
    }
})
  