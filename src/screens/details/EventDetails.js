import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardItem, Left, Text, Icon, Right, Body, Grid, Row, Col } from 'native-base'
import { cacheFile, formatDateTime } from '../../utils/functions'
export default function EventDetails({details}) {
    console.log(details)
    return (
        <View>
            <Card style={styles.container} >
                <CardItem header bordered >
                    <Left>
                        <Text style={styles.title}>
                            {details.title}
                        </Text>
                    </Left>
                    <Right>
                        <Icon name="mail" style={styles.iconStyle} />
                    </Right>
                </CardItem>
                <CardItem >
                    <Grid style={styles.grid}>
                        <Row style={{height:'auto'}}>
                            <Col style={{width:'40%'}}>
                                <Text style={styles.secondary}>
                                    Name of Event
                                </Text>
                            </Col>
                            <Col> 
                                <Text style={styles.secondary}>
                                    {details.title}
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{height:'auto'}}>
                            <Col style={{width:'40%'}}>
                                <Text style={styles.secondary}>
                                    Venue
                                </Text>
                            </Col>
                            <Col> 
                                <Text style={styles.secondary}>
                                    {details.venue}
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{height:'auto'}}>
                            <Col style={{width:'40%'}}>
                                <Text style={styles.secondary}>
                                    Start Date
                                </Text>
                            </Col>
                            <Col> 
                                <Text style={styles.secondary}>
                                    {details.startDate}
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{height:'auto'}}>
                            <Col style={{width:'40%'}}>
                                <Text style={styles.secondary}>
                                    End Date
                                </Text>
                            </Col>
                            <Col> 
                                <Text style={styles.secondary}>
                                    {details.endDate}
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{height:'auto'}}>
                            <Body> 
                            <Text style={styles.description}>  
                                {details.description}
                            </Text>
                            </Body>
                        </Row>
                    </Grid>
                   
                </CardItem>
                <CardItem>
                    <Left>
                        <Icon name={
                            details.to === "all" ?
                            'contacts' :
                            'contact'
                        } style={styles.iconStyle} />
                        <Text style={styles.normal}>
                            {details.studentName}
                        </Text>
                    </Left>
                </CardItem>
                <CardItem footer bordered>
                    <Left>
                        <Icon name='pricetag' style={styles.iconStyle} />
                        <Text style={styles.normal}>
                            {details.type}
                        </Text>
                    </Left>
                    <Left>
                        <Text style={styles.normal}>
                        {formatDateTime(details.createdOn)}
                        </Text>
                    </Left>
                </CardItem>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      shadowOpacity: 0
    },
    title: { 
        color: '#363636',
        fontWeight: '600'
    },
    description:{
        color: '#707070', 
        marginTop: 10
    },
    normal: {
        color: '#2C96EA', 
        fontWeight: '400',
        fontSize: 14,
        width: '100%'
    },
    secondary:{
        fontSize: 14,
        marginBottom: 5,
        marginTop: 5,
        color: '#363636',
    },
    iconStyle:{
        color: '#2C96EA',
        fontSize: 22
    },
    grid:{
        //marginTop: 5,
    },
    row:{
        marginTop: 10
    },
});
