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
                    realm.create(STUDENT_SCHEMA, student)
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
                        realm.create(STUDENT_SCHEMA, student)
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
            const filteredStudents = students.filtered(`studentId = ${studentId}`)
            resolve(filteredStudents)
        })
        .catch(error => reject(error))
})

export const getAllStudents = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const students = realm.objects(STUDENT_SCHEMA)
            resolve(students)
        })
        .catch(error => reject(error))
})


/* Event Related actions */
export const addEvent = event => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        try{
            realm.write(()=>{
                realm.create(EVENT_SCHEMA, event)
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
                    realm.create(EVENT_SCHEMA, event)
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
            const filteredEvent = events.filtered(`id = "${eventId}"`)
            resolve(filteredEvent)
        })
        .catch(error => reject(error))
})

export const getEventsByStudentName = studentName => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        const events = realm.objects(EVENT_SCHEMA)
        const filteredEvents = events.filtered(`studentName = ${studentName}`)
        realm.close()
        resolve(filteredEvents)
    })
    .catch(error => reject(error))
})

export const getAllEvents = () => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
        .then(realm => {
            const events = realm.objects(EVENT_SCHEMA)
            resolve(events)
        })
        .catch(error => reject(error))
})

export const updateEventAttatchmentUri = (eventId, attatchmentUri) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            let eventToUpdate = realm.objectForPrimaryKey(EVENT_SCHEMA, eventId)
            eventToUpdate.attatchment = attatchmentUri
            resolve(eventToUpdate)
        })
        
    })
    .catch(error => reject(error))
})


export const deleteAllData = ()=> new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
    .then(realm => {
        realm.write(()=>{
            realm.deleteAll()
        })
        resolve('success')
    })
    .catch(error => reject(error))
})