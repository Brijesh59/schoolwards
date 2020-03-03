import React from 'react'
import {StyleSheet, TouchableOpacity, FlatList, View, Alert, AppState} from 'react-native'
import Modal from 'react-native-modal'
import { Container, Left, Button, Title, Body, Right, Header, Drawer, Text, Radio, ListItem, CheckBox } from 'native-base'
import { Actions }  from 'react-native-router-flux'
import AsyncStorage from '@react-native-community/async-storage'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';

import FirebaseConfig from '../utils/Firebase'
import {cachePayloadData} from '../utils/functions'
import CustomCard   from '../components/common/CustomCard'
import SideBar      from './SideBar'
import CustomButton from '../components/common/CustomButton'
import ActivityLoader from '../components/common/ActivityLoader'
import {FilterIcon, SortIcon, LogoutIcon, MenuIcon} from '../components/common/Icons'
import config from '../utils/config'
import {getData} from '../utils/functions'
import NetworkRequest from '../utils/NetworkRequest'
import {deleteAllData, deleteUnusedData} from '../db'
import DataLoader from '../components/common/DataLoder'

export default class Home extends React.Component{

    state = {
        appState: AppState.currentState,
        pendingDataLoaded: false,
        showToast: false,
        showFilterModal: false,
        showSortModal: false,
        sortOldToNew: false,
        sortNewtoOld: true,
        events: [],
        students: [],
        selectedStudents: [],
        selectedStudentsApplied: [],
        types: ["News", "Message", "Event", "Announcement", "Homework", "Timetable"],
        selectedTypes: ["News", "Message", "Event", "Announcement", "Homework", "Timetable"],
        selectedTypesApplied: ["News", "Message", "Event", "Announcement", "Homework", "Timetable"]
    }

    constructor(props = null){
        super(props)
        this.firebase = new FirebaseConfig()
    }

    componentDidMount = async() => {
        console.log('Home Component Mounted ...')
        // get the cachedData & set the state
        await this.getCachedData() 
        this.handleSort()


        /* Check if user logged in to other device, if yes, then logout from
           current device & redirect to login screen.
           Else, cache any pending contents  
        */
        const status = await cachePayloadData()
        if(status === 'failure'){
            await AsyncStorage.setItem('isUserLoggedIn', 'false')
            await this.firebase.sendLocalNotification('You have signed in from another device.\nHence you are being logged out.');
            await deleteAllData() // delete all cached data
            Actions.auth()
            return
        }
        else{
            this.updateState()
        }

        this.unsubscribe = firebase.messaging().onMessage( async remoteMessage => {
            // this.setState({pendingDataLoaded: false})
            console.log('Foreground Notification...')
            const status = await cachePayloadData()
            if(status === 'failure'){
                await AsyncStorage.setItem('isUserLoggedIn', 'false')
                await this.firebase.sendLocalNotification('You have signed in from another device.\nHence you are being logged out.');
                await deleteAllData()    
                Actions.auth()
                return;
            }
            else{
                const JSONData = JSON.parse(remoteMessage.data.note)
                const payload  = JSONData.non_interaction_attributes.display_attributes
                await this.updateState();
                await this.firebase.sendLocalNotification(payload.title);
            }
        });

        const mobile = await AsyncStorage.getItem('mobile')
        this.unSubscribeFromTokenRefresh = this.firebase.onFirebaseTokenRefresh(mobile) 
        
        AppState.addEventListener('change', this.handleAppStateChange)

        const statusDelete = await deleteUnusedData()
        console.log(statusDelete)
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this.handleAppStateChange)
        this.unsubscribe && this.unsubscribe();
        this.unSubscribeFromTokenRefresh && this.unSubscribeFromTokenRefresh()
    }

    getCachedData = async() => {
        const JSONData = await getData()
        const selectedStudents = JSONData.students.map((student => student.firstName))
        const selectedStudentsApplied = [...selectedStudents]
        this.setState({
            events: JSONData.events, 
            students: JSONData.students, 
            selectedStudents, 
            selectedStudentsApplied 
        })
    }

    getStudentName(studentId){
        const student = this.state.students.filter(student => student.studentId == studentId)
        return student.length > 0 ? student[0].firstName : ''
    }

    updateInteraction = (interactionEvent) => {
        console.log('Inside Home updateInteraction')
        const events = JSON.parse(JSON.stringify(this.state.events)) 
        events.forEach(event => {
            if(event.id === interactionEvent.id){
                console.log('Condition Matched: ', event)
                event.interactionResponse = interactionEvent.interactionResponse
                console.log('Event Updated in Home')
            }
        })
        this.setState({events})
    }

    updateAttatchment = (attatchmentEvent) => {
        console.log('Inside Home updateAttatchment')
        const events = JSON.parse(JSON.stringify(this.state.events)) 
        events.forEach(event => {
            if(event.id === interactionEvent.id){
                console.log('Condition Matched: ', event)
                event.attatchment = interactionEvent.attatchment
                console.log('Event Updated in Home')
            }
        })
        this.setState({events})
    }

    updateState = async() => {
        console.log("Updating the Home state ...")
        const JSONDATA = await getData()
        this.setState({events: JSONDATA.events, students: JSONDATA.students, pendingDataLoaded: true})
        this.handleSort()
    }

    checkIfUserLoggedInToOtherDevice = async() => {
        const formData = new FormData()
        const networkRequest = new NetworkRequest()
        
        const [mobile, fcmToken] = await AsyncStorage.multiGet(["mobile", "fcmToken"])
        formData.append('mobile_no', mobile[1])
        formData.append('device_id', fcmToken[1])
        formData.append('appname', config.schoolName)
        const data = await networkRequest.getPendingContents(formData)
        return data 
    }

    handleAppStateChange = async(nextAppState) => {
        if(this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
            console.log("App has come to foreground")
            this.setState({pendingDataLoaded: false})
            const status = await cachePayloadData()
            if(status === 'failure'){
                await AsyncStorage.setItem('isUserLoggedIn', 'false')
                await this.firebase.sendLocalNotification('You have signed in from another device.\nHence you are being logged out.');

                await deleteAllData()    
                Actions.auth()
                return
            }
            this.updateState()
        }
        this.setState({
            appState: nextAppState
        })
    }

    closeDrawer = () => { this._drawer._root.close() }
    openDrawer  = () => { this._drawer._root.open()  } 
    
    sortListNewToOld = () => { 
        this.setState({
            sortNewtoOld: true,
            sortOldToNew: false,
        })   
    }

    sortListOldToNew = () => { 
        this.setState({
            sortNewtoOld: false,
            sortOldToNew: true,
        })   
    }

    handleFilterApply = () => {
        this.setState({  
            showFilterModal: false,
            selectedStudentsApplied: [...this.state.selectedStudents],
            selectedTypesApplied: [...this.state.selectedTypes]
         })
    }

    handleFilterCancel = () => {
        this.setState({  
            showFilterModal: false,
            selectedStudents: [...this.state.selectedStudentsApplied],
            selectedTypes: [...this.state.selectedTypesApplied]
         })
    }

    handleFilterStudentCheckBox = (prnNo) => {
        const selectedStudents = this.state.selectedStudents
        const index = selectedStudents.indexOf(prnNo)
        if( index != -1 ){ //Remove Student from selected list
            const selectedStudents = [...this.state.selectedStudents]
            selectedStudents.splice(index, 1)
            this.setState({selectedStudents})
        }
        else{
            const selectedStudents = [...this.state.selectedStudents]
            selectedStudents.push(prnNo)
            this.setState({selectedStudents})
        }
    }

    handleFilterTypeCheckBox = (type) => {
        const selectedTypes= this.state.selectedTypes
        const index = selectedTypes.indexOf(type)
        if( index != -1 ){ //Remove Student from selected list
            const selectedTypes = [...this.state.selectedTypes]
            selectedTypes.splice(index, 1)
            this.setState({selectedTypes})
        }
        else{
            const selectedTypes = [...this.state.selectedTypes]
            selectedTypes.push(type)
            this.setState({selectedTypes})
        }
    }

    handleClearAll = () => {
        this.setState({
            selectedTypes: [],
            selectedStudents: []
        })
    }

    handleSort = () => {
        const sortBy = this.state.sortNewtoOld ? 'newToOld' : 'oldToNew'
        let events = [...this.state.events]
        switch(sortBy){
            case 'oldToNew': 
                events = [...this.state.events]
                            .sort((eventA, eventB) => 
                                eventA.createdOn > eventB.createdOn
                            )
                this.setState({events, showSortModal: false}) 
                break;
            case 'newToOld':
                events = [...this.state.events]
                            .sort((eventA, eventB) => 
                                eventA.createdOn < eventB.createdOn
                            )
                this.setState({events, showSortModal: false})
                break;
        }

    }
    
    handleLogout = async() => {
        Alert.alert(
            'Attention',
            'Are you sure you want to log out ?',
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async()=>{
                        await AsyncStorage.setItem('isUserLoggedIn', 'false')
                        const data = await deleteAllData()  
                        console.log(data)
                        Actions.auth()
                    },
                    style: 'ok'
                }
            ]
        )
    }

    render(){
        console.log("Home Screen Rerender ...")
        const filteredEvents = 
            this.state.events
                .filter(event =>{
                    return this.state.selectedTypesApplied.indexOf(event.type.charAt(0).toUpperCase() + event.type.slice(1)) != -1
                })
                .filter(event => 
                    this.state.selectedStudentsApplied.indexOf(this.getStudentName(event.studentId))!=-1
                    || event.studentId === '' 
                )  

        // console.log("Events: ", this.state.events)                     
        // console.log("Filtered Events: ", filteredEvents)

        const header = 
            <Header 
                style={styles.header}           
                androidStatusBarColor={config.primaryColor}
                iosBarStyle="light-content">
                <Left style={{maxWidth:60, marginLeft: 8}}>
                    <Button transparent onPress={this.openDrawer}>
                        <MenuIcon style={{color:"white"}} />
                    </Button>
                </Left>
                <Body style={{alignItems: 'flex-start'}}>
                    <Title style={styles.headerTitle}>SVS</Title>
                </Body>
                <Right style={{maxWidth:50}} >
                    <Button transparent onPress={()=>this.setState({showFilterModal: true})} >
                        <FilterIcon style={{color:"white"}} />
                    </Button>
                </Right>
                <Right style={{maxWidth:50}} >
                    <Button transparent onPress={()=>this.setState({showSortModal: true})} >
                        <SortIcon style={{color:"white"}} />
                    </Button>
                </Right>
                <Right style={{maxWidth:50}}>
                    <Button transparent onPress={this.handleLogout} >
                        <LogoutIcon style={{color:"white"}} />
                    </Button>
                </Right>
            </Header>

        const mainContent = this.state.events.length > 0 && 
            <FlatList 
                data={filteredEvents}
                renderItem={
                    ({item: event}) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{width: '100%'}}
                            onPress={() => 
                                Actions.detailsScreen({
                                    details: event,
                                    updateHomeState: this.updateState,
                                })
                            }
                            >
                            <CustomCard 
                                id={event.id}
                                title={event.title}
                                type={event.type}
                                description={event.description}
                                venue={event.venue}
                                to={event.to}
                                studentName={this.getStudentName(event.studentId)}
                                dateTime={event.dateTime}
                                createdOn={event.createdOn}
                                attatchment={event.attatchment}
                                attatchmentExtention={event.attatchmentExtention}
                                updateHomeState={()=>this.updateState()}
                                updateInteraction={(updatedEvent)=>this.updateInteraction(updatedEvent)}
                                updateAttatchment={(updatedEvent)=>this.updateInteraction(updatedEvent)}
                                interactionAttributes={[
                                    event.interactionTypeYes,
                                    event.interactionTypeMaybe,
                                    event.interactionTypeNo
                                ]}
                                interactionSubmitUrl={event.interactionSubmitUrl}
                                interactionResponse={event.interactionResponse}
                            />
                        </TouchableOpacity>
                    )
                }
                keyExtractor={(card, index) => index.toString()}
            />
        
        const sortModal = 
            <View style={{flex: 1}}>
                    <Modal 
                        isVisible={this.state.showSortModal}
                        animationIn='zoomIn'
                        animationOut="zoomOut"
                        animationInTiming={200}
                        animationOutTiming={200}
                         backdropTransitionOutTiming={0}
                        onBackdropPress={()=>this.setState({showSortModal: false})}>
                        <View style={styles.modalContent}>     
                            <View style={{
                                flexDirection: 'row',
                                padding: 15,
                                alignItems: 'center'
                            }}>
                                <SortIcon style={{marginRight:5}}/>
                                <Text style={{fontSize: 22, color: config.primaryColor }}>Sort</Text>
                            </View>
                        
                            <View style={{width: '90%'}}>
                                <ListItem onPress={this.sortListNewToOld} style={{alignItems:'center'}}>
                                    <Left>
                                        <Text>New to Old</Text>
                                    </Left>
                                    <Left>
                                        <Radio 
                                            onPress={this.sortListNewToOld}
                                            selected={this.state.sortNewtoOld}
                                            selectedColor={config.primaryColor}
                                        />
                                    </Left>
                                </ListItem>  
                                <ListItem onPress={this.sortListOldToNew}>
                                        <Left>
                                            <Text>Old to New</Text>
                                        </Left>
                                        <Left>
                                            <Radio 
                                                onPress={this.sortListOldToNew}
                                                selected={this.state.sortOldToNew}
                                                selectedColor={config.primaryColor}
                                            />
                                        </Left>
                                </ListItem> 
                            </View>
                            
                            <CustomButton 
                                title="Ok"
                                onPressFunction={this.handleSort}
                                style={{width: '40%', marginTop: 10, marginBottom: 10}}

                            />     
                        </View>
                    </Modal>
               </View>
        
        const filterModal = 
            <View style={{flex: 1}}>
                <Modal 
                    isVisible={this.state.showFilterModal}
                    animationIn='zoomIn'
                    animationOut="zoomOut"
                    animationInTiming={200}
                    animationOutTiming={200}
                    backdropTransitionOutTiming={0} // Remove flicker
                    onBackdropPress={this.handleFilterCancel}>
                    <View style={styles.modalContent2}>     
                       
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 15
                        }}>
                            <Text style={{fontSize: 18, color: config.primaryColor }}>Filter</Text> 
                            <TouchableOpacity onPress={this.handleClearAll}>
                                <Text style={{fontSize: 18, color: config.primaryColor }}>Clear all</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: 18, color: config.primaryColor, paddingLeft:15, marginBottom: 10 }}>
                            Children
                        </Text> 

                        {/* Children List */}
                        <View >
                            {
                                this.state.students.map(student=> (
                                    <TouchableOpacity style={{
                                        width: '80%',
                                        marginLeft: 15,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: 5
                                    }}
                                    activeOpacity={0.6}
                                    key={student.firstName}
                                    onPress={()=> this.handleFilterStudentCheckBox(student.firstName)}>
                                        <Text 
                                            style={{color: '#707070', fontSize:16}}
                                            
                                            >{student.firstName}</Text>
                                        <CheckBox 
                                            checked={this.state.selectedStudents.indexOf(student.firstName)!=-1 ? true : false}
                                            onPress={()=> this.handleFilterStudentCheckBox(student.firstName)}
                                            />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
 
                        <Text 
                            style={{fontSize: 18, color: config.primaryColor, paddingLeft:15, marginBottom: 10, marginTop:5 }}>
                            Type
                        </Text> 
                        <View >
                            {
                                this.state.types.map((type=> (
                                    <TouchableOpacity style={{
                                        width: '80%',
                                        marginLeft: 15,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: 5
                                    }}
                                    activeOpacity={0.6}
                                    onPress={()=>this.handleFilterTypeCheckBox(type)}
                                    key={type}>
                                        <Text style={{color: '#707070', fontSize:16}}>{type}</Text>
                                        <CheckBox 
                                            checked={this.state.selectedTypes.indexOf(type)!=-1 ? true : false}
                                            onPress={()=>this.handleFilterTypeCheckBox(type)} />
                                    </TouchableOpacity>    
                                )))
                            }
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            padding: 20
                        }}> 
                            <CustomButton 
                                title="Cancel"
                                onPressFunction={this.handleFilterCancel}
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
                                onPressFunction={this.handleFilterApply}
                                style={{width: '40%'}}
                            />      
                        </View>
                    </View>
                </Modal>
            </View>
        
        return (
            <Container>
                <Drawer 
                    ref = { (ref) => { this._drawer = ref } } 
                    content = { 
                        <SideBar navigator={this._navigator} />
                    }
                    onClose = { () => this.closeDrawer() } > 
                    <Container> 
                        {header}
                        <View style={styles.content}>
                            {/* {!this.state.pendingDataLoaded && <DataLoader />} */}
                            { this.state.events.length > 0 ?
                                mainContent :
                                <ActivityLoader />
                            }
                            { sortModal }
                            { filterModal }    
                        </View>
                    </Container>
                </Drawer> 
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    header: { 
        backgroundColor: config.primaryColor,
    },
    headerTitle:{
        color: 'white',
    },
    content:{
        paddingLeft: '2.5%',
        paddingRight: '2.5%',
        marginTop: 10,
        marginBottom: 80
    },
    grid:{
        marginTop: 5,
        width: '95%',
    },
    modalContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `rgba(0,0,0,0.5)`,
    },
    modalContent:{
        backgroundColor: 'white',
        width: '90%',
        height: 'auto',
        marginLeft: '5%',
        alignItems: 'center',
        borderRadius: 5
    },
    modalContent2:{
        backgroundColor: 'white',
        width: '90%',
        height: 'auto',
        marginLeft: '5%',
        borderRadius: 5
    },
    center: {
        alignItems: 'center',
    }
});
  