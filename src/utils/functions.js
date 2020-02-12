import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-community/async-storage'
import app_config from './config'
import NetworkRequest from './NetworkRequest'

export function formatDateTime(dateTime){
    let formatedDateTime = ''
    return formatedDateTime
}

export function getTime(){
    const date = new Date()

    let day = date.getDate()
    day = day >= 10 ? day : '0' + day 

    let month = date.getMonth() + 1
    month = month >= 10 ? month : '0' + month

    return date.getFullYear() + '-' + month + '-' + day + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
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
      const cachedData = await AsyncStorage.getItem('cachedData')
      const JSONData = JSON.parse(cachedData)

      const dataToSave = {
        students: [],
        events: []
      }
      console.log("fetchEvent started ...")
      const [dataToSave2, objects] = await fetchEachEvent(data.pending_objects)
      console.log("fetchEvent completed ...")
      dataToSave.events = [...JSONData.events, ...dataToSave2.events]
      dataToSave.students = [...JSONData.students, ...dataToSave2.students]
      
      console.log("DatatoSave: ", JSON.stringify(dataToSave))
      await AsyncStorage.setItem('cachedData', JSON.stringify(dataToSave))
      console.log("Data Cached ...")

      // Notify server that Notification has been recieved ...
      const formData = new FormData()
      formData.append('mobile_no', mobile)
      formData.append('device_id', fcmToken)
      formData.append('objects', JSON.stringify(objects))
      formData.append('appname', app_config.schoolName)
      const networkRequest = new NetworkRequest()
      const response = await networkRequest.updateRecievePushStatus(formData) 
      console.log("Response of recieved Notifications: ", response)
    }
    else
      console.log("Invalid Device ID ")
}

export async function cacheFile(uri, type){
    // download file/image/.. and save it to phone storage
    let extention = 'png'
    switch(type){
        case 'image': 
            extention = 'png'
            break;
        case 'pdf': 
            extention = 'pdf'
    }
    try {
        const options = {
            fileCache: true, 
            appendExt: extention
        }
        const res = await RNFetchBlob.config(options).fetch('GET', uri)
        const status = res.info().status
        if(status == 200) {
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
    console.log("Fetch Stated")
    for(const obj of pendingObjects){
        console.log("Object: ", obj)
        const data = await networkRequest.getEvent(obj.type, obj.id)
        console.log("Each Pending Data: ", data)
        const NIA_NDA = data.non_interaction_attributes.non_display_attributes
        const NIA_DA  = data.non_interaction_attributes.display_attributes
       
        // download and save attatchment if available
        // let attachmentUrl = null
        // if(NIA_NDA.attachment_url){
        //     const data = await cacheFile(NIA_NDA.attachment_url, NIA_NDA.type).then(d => d)
        //     if(data.isFileSaved){
        //         attachmentUrl = data.filePath
        //     }
        // }
        dataToSave.events.push({
            id: NIA_NDA.id,
            title: NIA_DA.title,
            description: NIA_DA.body || NIA_DA.desc,
            type: NIA_DA.series,
            to: obj.object_type ==='common' ? 'all' : 'individual',
            dateTime: NIA_DA.created_on,
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
    console.log("Fetch Completed")
    return [dataToSave, objects]
}
