import React from 'react'
import {StyleSheet} from 'react-native'
import { Text, Container, Content, Thumbnail, Grid, Col, Row} from 'native-base'
import CustomButton from '../../components/common/CustomButton'
import CustomHeader from '../../components/common/CustomHeader';
import { Actions } from 'react-native-router-flux';
import config from '../../utils/config';

export default function Profile({student}) {
    const defaultImage = student.gender === 'male' ?
        "https://pickaface.net/gallery/avatar/unr_workplacemale_180407_1548_cm3i.png" :
        'https://cdn4.vectorstock.com/i/1000x1000/50/68/avatar-icon-of-girl-in-a-baseball-cap-vector-16225068.jpg'
    return (
        <Container> 
            <CustomHeader 
                title="Children" />
            <Content 
                contentContainerStyle={styles.container}>
                <Thumbnail 
                    large
                    style={styles.thumbnail} 
                    source={{uri: student.profile ? student.profile : defaultImage}} />
                <Text style={styles.name}>{student.name}</Text>    
                <Grid style={styles.grid}>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Roll No
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.rollNo}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Class
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.class + '-' + student.division}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Date of Birth
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.dateOfBirth}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Gender
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.gender}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Father
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.fatherName && student.fatherName}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Mother
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.motherName && student.motherName}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Address
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                {student.address}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Mobile
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                { student.preferenceContact === "mother" ?  student.motherMobile :
                                student.fatherMobile }
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col>
                            <Text 
                                style={styles.key}>
                                Email
                            </Text>
                        </Col>
                        <Col> 
                            <Text 
                                style={styles.value}>
                                { student.preferenceContact === "mother" ?  student.motherEmail :
                                student.fatherEmail }
                            </Text>
                        </Col>
                    </Row>
                </Grid>
                <CustomButton 
                    title="Fee Details" 
                    onPressFunction={()=>Actions.feeScreen({
                        Class: student.class, Section:student.division
                    })}
                    style={{marginTop: 10,marginBottom:20, width:'50%'}}/>
            </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        //marginTop: 150
      },
    name:{
        fontSize:20,
        padding: 10,
        color: config.primaryColor
    },
    grid:{
        marginTop: 5,
        width: '95%',
    },
    key:{
        fontSize: 16,
        marginLeft: 20,
    },
    value:{
        fontSize: 16,
        color: '#808080'
    },
    thumbnail:{
       marginTop: 10,
       width:100,
       height:100
    },
});
  