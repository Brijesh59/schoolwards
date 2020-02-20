export const STUDENT_SCHEMA = 'Student'
export const EVENT_SCHEMA = 'Event'

export const StudentSchema = {
    name: STUDENT_SCHEMA,
    primaryKey: 'name',
    properties: {
        studentId: 'string',
        prnNo: 'string',
        firstName: 'string',
        name: 'string',
        dateOfBirth: 'string',
        gender: 'string',
        address: 'string',
        city: 'string',
        pincode: 'string',
        profileImage: 'string',
        fatherName: 'string',
        motherName: 'string',
        fatherEmail: 'string',
        motherEmail: 'string',
        fatherMobile: 'string',
        motherMobile: 'string',
        preferenceContact: 'string',
        class: 'string',
        division: 'string',
        rollNo: 'string',
        isDeleted: {
            type: 'bool',
            default: false
        }
    }
}

export const EventSchema = {
    name: EVENT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'string',
        title: 'string',
        description: 'string',
        type: 'string',
        to: 'string',
        createdOn: 'string',
        dateTime: 'string',
        attatchment: 'string',
        attatchmentExtention: 'string',
        venue: 'string',
        studentName: 'string',
        studentId: 'string',
        isDeleted: {
            type: 'bool',
            default: false
        }
    }
}
