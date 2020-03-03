import Realm from 'realm'
import {StudentSchema, EventSchema, STUDENT_SCHEMA, EVENT_SCHEMA} from './schema'

const databaseOptions = {
    path: 'storage.realm',
    schema: [StudentSchema, EventSchema]
}

/* Student Related actions */
export const addStudent = student => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            try{
                realm.write(()=>{
                    realm.create(STUDENT_SCHEMA, student, 'modified')
                })
                resolve(students)
            }
            catch(err){
                throw new Error(err)
            }
        })
        .catch(error => reject(error))
})

export const addStudents = students => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            try{
                realm.write(()=>{
                    students.forEach(student => {
                        realm.create(STUDENT_SCHEMA, student, 'modified')
                    });
                })
                resolve(students)
            }
            catch(err){
                throw new Error(err)
            }
        })
        .catch(error => reject(error))
})

export const getStudentById = (studentId) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const students = realm.objects(STUDENT_SCHEMA)
            const filteredStudents = students.filtered(`studentId = "${studentId}" AND isDeleted = false`)
            resolve({...filteredStudents})
        })
        .catch(error => reject(error))
})

export const getAllStudents = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const data = realm.objects(STUDENT_SCHEMA)
            const students = data.filtered(`isDeleted = false`)
            resolve({...students})
        })
        .catch(error => reject(error))
})


/* Event Related actions */
export const addEvent = event => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        try{
            realm.write(()=>{
                realm.create(EVENT_SCHEMA, event, 'modified')
            })
            resolve(event)
        }
        catch(err){
            throw new Error(err)
        }
    })
    .catch(error => reject(error))
})

export const addEvents = events => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        try{
            realm.write(()=>{
                events.forEach(event => {
                    realm.create(EVENT_SCHEMA, event, 'modified')
                });
            })
            resolve(events)
        }
        catch(err){
            throw new Error(err)
        }
    })
    .catch(error => reject(error))
})

export const getEventById = eventId => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const events = realm.objects(EVENT_SCHEMA)
            const filteredEvent = events.filtered(`id = "${eventId}" AND isDeleted = false`)
            resolve({...filteredEvent})
        })
        .catch(error => reject(error))
})

export const getEventsByStudentName = studentName => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        const events = realm.objects(EVENT_SCHEMA)
        const filteredEvents = events.filtered(`studentName = "${studentName}" AND isDeleted = false`)
        resolve({...filteredEvents})
    })
    .catch(error => reject(error))
})

export const getAllEvents = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const data = realm.objects(EVENT_SCHEMA)
            const events = data.filtered(`isDeleted = false`)
            resolve({...events})
        })
        .catch(error => reject(error))
})

export const updateEventAttatchmentUri = (eventId, attatchmentUri) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            let eventToUpdate = realm.objectForPrimaryKey(EVENT_SCHEMA, eventId)
            eventToUpdate.attatchment = attatchmentUri
            resolve({...eventToUpdate})
        }) 
    })
    .catch(error => reject(error))
})

export const updateEventInteraction = (eventId, interactionResponse) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            let eventToUpdate = realm.objectForPrimaryKey(EVENT_SCHEMA, eventId)
            eventToUpdate.interactionResponse = interactionResponse
            resolve({...eventToUpdate})
        }) 
    })
    .catch(error => reject(error))
})

export const deleteAllData = ()=> new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            const allEvents = realm.objects(EVENT_SCHEMA)
            const allStudents = realm.objects(STUDENT_SCHEMA)
            for(const key in allEvents){
                allEvents[key].isDeleted = true
            }
            for(const key in allStudents){
                allStudents[key].isDeleted = true
            }
        })
        resolve('All data deleted(isDeleted set to true)')
    })
    .catch(error => reject(error))
})

export const deleteUnusedData = ()=> new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            const allEvents = realm.objects(EVENT_SCHEMA)
            const allStudents = realm.objects(STUDENT_SCHEMA)
            const filteredEvents = allEvents.filtered(`isDeleted = true`)
            const filteredStudents = allStudents.filtered(`isDeleted = true`)
            realm.delete(filteredEvents)
            realm.delete(filteredStudents)
        })
        resolve('Unused Data wiped successfully')
    })
    .catch(error => reject(error))
})

