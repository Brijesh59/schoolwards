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
import {FilterIcon, SortIcon, LogoutIcon, MenuIcon} from '../components/common/Icons'

export default class Home extends React.Component{

    state = {
        appState: AppState.currentState,
        showToast: false,
        showFilterModal: false,
        showSortModal: false,
        sortOldToNew: false,
        sortNewtoOld: true,
        cards: [
            {
                title:"Test Announcement",
                type:"Announcement",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                to: "all",
                dateTime:"16 January 2020, 09:57 AM",
                attatchment: null
            },
            {
                title:"Test Announcement",
                type:"Announcement",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                to: "individual",
                studentName:"Aman Verma",
                dateTime:"16 January 2020, 09:57 AM",
                attatchment: null
            },
            {
                title:"Test Event",
                type:"Event",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                to: "individual",
                studentName:"Vikas Verma",
                dateTime:"20 February 2020, 09:57 AM",
                venue: "School Hall",
                startDate: "23 February 2020, 09:57 AM",
                endDate: "25 February 2020, 09:57 AM",
                attatchment: null
            },
            {
                title:"Test Homework",
                type:"Homework",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                assignedBy: "Raman Vohra",
                to: "individual",
                studentName:"Vikas Verma",
                dateTime:"20 February 2020, 09:57 AM",
                attatchment: "https://images.unsplash.com/photo-1579705743135-bc6ef4f6a8d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
            },
            {
                title:"Test Homework 2",
                type:"Homework",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                assignedBy: "Raman Vohra",
                to: "individual",
                studentName:"Vikas Verma",
                dateTime:"20 February 2020, 09:57 AM",
                attatchment: null,
            },
            {
                title:"Test Message",
                type:"Message",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                sendBy: "Akansha Vats",
                to: "individual",
                studentName:"Vikas Verma",
                dateTime:"20 February 2020, 09:57 AM"
            },
            {
                title:"Test News",
                type:"News",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                to: "individual",
                studentName:"Samay Verma",
                dateTime:"20 February 2020, 09:57 AM",
                attatchment: null,
            },
            {
                title:"Test Timetable",
                type:"Timetable",
                description:"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                to: "individual",
                studentName:"Samay Verma",
                dateTime:"20 February 2020, 09:57 AM"
            }
        ],
        events: [],
        students: [],
        selectedStudents: [],
        selectedStudentsApplied: [],
        types: ["News", "Messages", "Events", "Announcement", "Homework", "Timetable"],
        selectedTypes: ["News", "Messages", "Events", "Announcement", "Homework", "Timetable"],
        selectedTypesApplied: ["News", "Messages", "Events", "Announcement", "Homework", "Timetable"]
    }

    constructor(props = null){
        super(props)
        this.firebase = new FirebaseConfig()
    }

    getCachedData = async() => {
        const cachedData = await AsyncStorage.getItem('cachedData')
        const JSONData = JSON.parse(cachedData)
        const selectedStudents = JSONData.students.map((student => student.firstName))
        const selectedStudentsApplied = JSONData.students.map((student => student.firstName))
        this.setState({events: JSONData.events, students: JSONData.students, selectedStudents, selectedStudentsApplied })
    }

    getStudentName(studentId){
        const student = this.state.students.filter(student => student.studentId == studentId)
        return student.length > 0 ? student[0].firstName : ''
    }

    updateState = async() => {
        console.log("Updating the Home state ...")
        const cachedData = await AsyncStorage.getItem('cachedData')
        const JSONDATA = JSON.parse(cachedData)
        console.log(JSONDATA)
        this.setState({events: JSONDATA.events, students: JSONDATA.students})
    }

    componentDidMount = async() => {
        this.unsubscribe = firebase.messaging().onMessage( async remoteMessage => {
            await cachePayloadData()

            const JSONData = JSON.parse(remoteMessage.data.note)
            const payload  = JSONData.non_interaction_attributes.display_attributes
            await this.firebase.sendLocalNotification(payload);

            this.updateState();
        });
        const mobile = await AsyncStorage.getItem('mobile')
        this.firebase.onFirebaseTokenRefresh(mobile) 
        
        AppState.addEventListener('change', this.handleAppStateChange)
        
        // get the cachedData & set the state
        this.getCachedData()   
    }

    handleAppStateChange = (nextAppState) => {
        if(this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
            console.log("App has come to foreground")
            this.updateState()
        }
        this.setState({
            appState: nextAppState
        })
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this.handleAppStateChange)
        this.unsubscribe();
        console.log("Unsubscribed")
    }

    closeDrawer = () => { this._drawer._root.close() }
    openDrawer  = () => { this._drawer._root.open()  } 
    
    filterList = () => {
      
    }
    
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

    handleSort = () => {
        this.setState({showSortModal: false})
        if(this.state.sortNewtoOld){
            
        }
        else{

        }
    }

    handleFilterApply = () => {
        console.log("Apply Filter Modal")
        this.setState({  
            showFilterModal: false,
            selectedStudentsApplied: [...this.state.selectedStudents],
            selectedTypesApplied: [...this.state.selectedTypes]
         })
        console.log("State: ", this.state.selectedTypes)
    }

    handleFilterCancel = () => {
        console.log("Close Filter Modal")
        this.setState({  
            showFilterModal: false,
            selectedStudents: [...this.state.selectedStudentsApplied],
            selectedTypes: [...this.state.selectedTypesApplied]
         })
        console.log("State: ", this.state.selectedTypes)
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
                                .sort((eventA, eventB) => eventA.dateTime > eventB.dateTime)
                this.setState({events, showSortModal: false}) 
                break;
            case 'newToOld':
                events = [...this.state.events]
                                .sort((eventA, eventB) => eventA.dateTime < eventB.dateTime)
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
                        await AsyncStorage.setItem('cachedData', 
                            JSON.stringify({students:[], events:[]}))
                        Actions.auth()
                    },
                    style: 'ok'
                }
            ]
        )
    }

    render(){
        console.log("Home Rerender")
        const filteredEvents = 
            this.state.events
                .filter(event =>        
                    this.state.selectedTypesApplied.indexOf(event.type) != -1)
                .filter(event => 
                    this.state.selectedStudentsApplied.indexOf(this.getStudentName(event.studentId))!=-1
                    || event.studentId === null 
                )
                                    
        // console.log("Events: ", this.state.events)
        // console.log("Filtered Events: ", filteredEvents)
        // console.log("Selected Students: ", this.state.selectedStudentsApplied)
        
        const header = 
            <Header 
                style={styles.header}           
                androidStatusBarColor="#3295E9" 
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

        const mainContent = this.state.events && 
            <FlatList 
                data={filteredEvents}
                renderItem={
                    card => (
                        <TouchableOpacity
                            style={{width: '100%'}}
                            onPress={() => 
                                Actions.detailsScreen({
                                    details: card.item
                                })
                            }
                            >
                            <CustomCard 
                                title={card.item.title}
                                type={card.item.type}
                                description={card.item.description}
                                to={card.item.to}
                                studentName={this.getStudentName(card.item.studentId)}
                                dateTime={card.item.dateTime}
                                attatchment={card.item.attatchment}
                                attatchmentExtention={card.item.attatchmentExtention}
                                updateHomeState={()=>this.updateState()}
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
                                <Text style={{fontSize: 22, color: '#2C96EA' }}>Sort</Text>
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
                                            selectedColor="#2C96EA"
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
                                                selectedColor="#2C96EA"
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
                            <Text style={{fontSize: 18, color: '#2C96EA' }}>Filter</Text> 
                            <TouchableOpacity onPress={this.handleClearAll}>
                                <Text style={{fontSize: 18, color: '#2C96EA' }}>Clear all</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: 18, color: '#2C96EA', paddingLeft:15, marginBottom: 10 }}>
                            Children
                        </Text> 

                        {/* Children List */}
                        <View >
                            {
                                this.state.students.map(student=> (
                                    <View style={{
                                        width: '80%',
                                        marginLeft: 15,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: 5
                                    }}
                                    key={student.firstName}>
                                        <Text style={{color: '#707070', fontSize:16}}>{student.firstName}</Text>
                                        <CheckBox 
                                            checked={this.state.selectedStudents.indexOf(student.firstName)!=-1 ? true : false}
                                            onPress={()=> this.handleFilterStudentCheckBox(student.firstName)}
                                            />
                                    </View> 
                                ))
                            }
                        </View>
 
                        <Text 
                            style={{fontSize: 18, color: '#2C96EA', paddingLeft:15, marginBottom: 10, marginTop:5 }}>
                            Type
                        </Text> 
                        <View >
                            {
                                this.state.types.map((type=> (
                                    <View style={{
                                        width: '80%',
                                        marginLeft: 15,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        padding: 5
                                    }}
                                    key={type}>
                                        <Text style={{color: '#707070', fontSize:16}}>{type}</Text>
                                        <CheckBox 
                                            checked={this.state.selectedTypes.indexOf(type)!=-1 ? true : false}
                                            onPress={()=>this.handleFilterTypeCheckBox(type)} />
                                    </View>    
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
                                    borderColor: '#2C96EA',
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
                        <SideBar navigator={this._navigator}/>
                    }
                    onClose = { () => this.closeDrawer() } > 
                    <Container> 
                        {header}
                        <View style={styles.content}>
                            { mainContent }
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
        backgroundColor: '#2C96EA',
    },
    headerTitle:{
        color: 'white',
    },
    content:{
        // width:'95%',
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
        // paddingTop: 10,
        borderRadius: 5
    },
    modalContent2:{
        backgroundColor: 'white',
        width: '90%',
        height: 'auto',
        marginLeft: '5%',
        // paddingTop: 10,
        borderRadius: 5
    },
    center: {
        alignItems: 'center',
    }
});
  