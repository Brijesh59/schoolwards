import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage'
import app_config from './config'
import NetworkRequest from './NetworkRequest'

export function formatDateTime(dateTime = '2020-02-22 15:10:00'){
    /* Input Date Format: = '2020-02-22 15:10:00' */
    /* Return Date Format: '22 Feb 2020, 3:10 PM' */

    let [fullDate, time] = dateTime.split(' ')
    let [year, month, date ] = fullDate.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    month = monthNames[parseInt(month) - 1]

    let [hr, min, sec] = time.split(':')
    let AM_PM = 'AM'

    if(hr > 12) {
        AM_PM = 'PM'
        hr = hr - 12
    }

    return `${date} ${month} ${year}, ${hr}:${min} ${AM_PM}`
}

export function formatDate(date = '2020-02-22'){
    /* Input Date Format: = 2020-02-22 */
    /* Return Date Format: February 22, 2020 */

    let [year, month, day] = date.split('-')
    const months = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 
        'November', 'December'
    ]
    month = months[ month >= 10 ? month - 1: month%10 - 1 ]
    return month + ' ' + day + ', ' + year
}

export function getCurrentDate(){
    /* Return Date Format: 2020-02-24 */

    const date = new Date()

    let day = date.getDate()
    day = day >= 10 ? day : '0' + day 

    let month = date.getMonth() + 1
    month = month >= 10 ? month : '0' + month

    return date.getFullYear() + '-' + month + '-' + day
}

export function getTime(){
    /* Return DateTime Format: '2020-02-24 15:34:20'*/
    
    const date = new Date()

    let day = date.getDate()
    day = day >= 10 ? day : '0' + day 

    let month = date.getMonth() + 1
    month = month >= 10 ? month : '0' + month

    return date.getFullYear() + '-' + month + '-' + day + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

export async function getData(){
    /* Returns an Object like: { students: [], events: [] } */
    const cachedData = await AsyncStorage.getItem('cachedData')
    if(cachedData)
        return JSON.parse(cachedData)
    return { students: [], events: [] }
}

export async function getEvent(eventId){
    const cachedData = await AsyncStorage.getItem('cachedData')
    const data = JSON.parse(cachedData)
    return data.events.find(event => event.id === eventId)
}

export async function addEvent(event){
    const eventDataToSave = {
        ...event
    }
    const cachedData = await AsyncStorage.getItem('cachedData')
    const data = JSON.parse(cachedData)
    const students = [...data.students]
    const events = [eventDataToSave, ...data.events]
    const dataToSave = {
        students: students,
        events: events
    }
    await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))
}

export async function addStudentsAndEventsUponLogin(students, commonEvents){
    const dataToSave = {
        students: [],
        events: []
    }

    // Saving Students details
    for(const student of students){
        const profileUrl = await cacheFile(student.photo)
        dataToSave.students.push({
            studentId: student.id,
            prnNo: student.prn_no,
            firstName: student.first_name,
            name: `${student.first_name} ${student.middle_name} ${student.last_name}`,
            dateOfBirth: student.dob,
            gender: student.gender,
            address: `${student.address}, ${student.city}, ${student.pincode}`,
            city: student.city,
            pincode: student.pincode,
            profileImage: profileUrl,
            fatherName: student.father_name,
            motherName: student.mother_name,
            fatherEmail: student.father_email,
            motherEmail: student.mother_email,
            fatherMobile: student.father_mobile,
            motherMobile: student.mother_mobile,
            preferenceContact: student.prefence_contact,
            class: student.standard,
            division: student.division,
            rollNo: student.roll_no
        })
    }

    // Saving Individual Student events
    students.forEach(student => {
        const studentId = student.id
        const studentName = student.first_name
        student.events.forEach(event => {
            const NIA_NDA = event.non_interaction_attributes.non_display_attributes
            const NIA_DA  = event.non_interaction_attributes.display_attributes
            dataToSave.events.push({
                id: NIA_NDA.id,
                title: NIA_DA.name,
                description: NIA_DA.description,
                type: NIA_DA.series,
                to: 'individual',
                createdOn: NIA_DA.created_on,
                dateTime: NIA_DA.date_time,
                attatchment: NIA_DA.url != "" ? NIA_DA.url : null,
                attatchmentExtention: NIA_NDA.type,
                venue: NIA_DA.venue,
                studentName: studentName,
                studentId: studentId
            })
        })
    })

    // Saving Common events
    commonEvents.forEach(event => {
        const NIA_NDA = event.non_interaction_attributes.non_display_attributes
        const NIA_DA  = event.non_interaction_attributes.display_attributes
        dataToSave.events.push({
            id: NIA_NDA.id,
            title: NIA_DA.name,
            description: NIA_DA.description,
            type: NIA_DA.series,
            to: 'all',
            createdOn: NIA_DA.created_on,
            dateTime: NIA_DA.date_time,
            attatchment: NIA_DA.url != "" ? NIA_DA.url : null,
            attatchmentExtention: NIA_NDA.type,
            venue: NIA_DA.venue,
            studentName: null,
            studentId: null
        })
    })

    await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))
}

export async function updateEventAttatchment(eventId, attatchment){
    const cachedData = await AsyncStorage.getItem('cachedData')
    const data = JSON.parse(cachedData)
    const students = [...data.students]
    const events = [...data.events]
    events.map(event => {
        if(event.id === eventId){
            event.attatchment = attatchment
        }
    })
    const dataToSave = {
        students: students,
        events: events
    }
    await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))
}

export async function cachePayloadData(){
    const [mobile, fcmToken] = await AsyncStorage.multiGet(["mobile", "fcmToken"])
    const networkRequest = new NetworkRequest()
    const formData = new FormData()
    formData.append('mobile_no', mobile[1])
    formData.append('device_id', fcmToken[1])
    formData.append('appname', app_config.schoolName)
    const data = await networkRequest.getPendingContents(formData) 
    if(data.device_valid === 'yes'){
      if(data.pending_objects.length === 0){
        return
      }  
      const JSONData = await getData()
      const dataToSave = {
        students: [],
        events: []
      }
      const [dataToSave2, objects] = await fetchEachEvent(data.pending_objects)
      dataToSave.events = [...JSONData.events, ...dataToSave2.events]
      dataToSave.students = [...JSONData.students, ...dataToSave2.students]
      
      await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))

      // Notify the server that Notification has been recieved ...
      console.log("JSON.stringify: ", JSON.stringify(objects))
      const formData2 = new FormData()
      formData2.append('mobile_no',  mobile[1])
      formData2.append('device_id', fcmToken[1])
      formData2.append('objects', JSON.stringify(objects))
      formData2.append('appname', app_config.schoolName)
      await networkRequest.updateRecievePushStatus(formData2) 
    }
    else{
        console.log("Invalid Device ID ")
        return 'failure'
    }
      
}

export async function cacheFile(uri, type = 'png'){
    if(uri === '' || uri === null){
        return ''
    }
    let extention = 'png'
    switch(type){
        case 'image': 
            extention = 'png'
            break;
        case 'pdf': 
            extention = 'pdf'
            break;
        default: 
            extention = 'png'  
    }
    try {
        const options = {
            fileCache: true, 
            appendExt: extention
        }
        const res = await RNFetchBlob.config(options).fetch('GET', uri)
        if(res.info().status == 200) {
            console.log('The file saved to: ', res.path())
            return {
                isFileSaved: true,
                filePath: res.path()
            }
        } 
        return {
            isFileSaved: false
        }
    }
    catch(error){
        console.log('The file is not saved: ', error)
        return {
            isFileSaved: false
        }   
    }
}

async function fetchEachEvent(pendingObjects){
    const networkRequest = new NetworkRequest()
    const dataToSave = {
        students: [],
        events: []
    }
    const objects = []
    for(const obj of pendingObjects){
        console.log("Each Object: ", obj)
        const data = await networkRequest.getEvent(obj.type, obj.id)
        const NIA_NDA = data.non_interaction_attributes.non_display_attributes
        const NIA_DA  = data.non_interaction_attributes.display_attributes
       
        dataToSave.events.push({
            id: NIA_NDA.id,
            title: NIA_DA.title,
            description: NIA_DA.body || NIA_DA.desc,
            type: NIA_DA.series,
            to: obj.object_type ==='common' ? 'all' : 'individual',
            createdOn: NIA_DA.created_on,
            dateTime: NIA_DA.date_time,
            attatchment: NIA_NDA.attachment_url ? NIA_NDA.attachment_url : null,
            attatchmentExtention: NIA_NDA.type,
            venue: NIA_DA.venue,
            studentName: obj.student_name,
            studentId: obj.student_id,
            studentPrnNo: obj.prn_no
        })
        objects.push({
            id: obj.id,
            type: obj.type,
            student_id: obj.student_id,
            datetime: getTime(),
            timezone: 'GMT 5:30'
        })
    }
    return [dataToSave, objects]
}
