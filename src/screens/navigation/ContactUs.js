import React from 'react'
import {StyleSheet, Platform, Linking, TouchableOpacity} from 'react-native'
import { Text, Container, Content, Thumbnail, Grid, Col, Row} from 'native-base'
import CustomHeader from '../../components/common/CustomHeader';
import config from '../../utils/config'
const schoolLogo = '../../assets/schoolLogo.png'
export default function ContactUs() {

    const dialCall = (phoneNumber) => {
        let phone = ''
        if (Platform.OS === 'android') 
            phone = `tel:${phoneNumber}`
        else
            phone = `telprompt:${phoneNumber}`
        Linking.openURL(phone)
    }

    return (
        <Container> 
            <CustomHeader title="Contact Us" />
            <Content 
                contentContainerStyle={styles.container}>
                <Thumbnail 
                    large
                    style={styles.thumbnail} source={ require(schoolLogo)} />
                <Text style={styles.name}>
                    {config.schoolFullName}
                </Text>    
                <Grid style={styles.grid}>
                    <Row style={{height:'auto'}}>
                        <Col style={{width:'40%'}}>
                            <Text style={styles.key}>
                                Address :
                            </Text>
                        </Col>
                        <Col> 
                            <Text style={styles.value}>
                                {config.address}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={styles.row}>
                        <Col style={{width:'40%'}}>
                            <Text style={styles.key}>
                                Contact :
                            </Text>
                        </Col>
                        <Col> 
                            <TouchableOpacity 
                                onPress={() => dialCall(config.contact)}>
                                <Text 
                                    style={styles.value, {textDecorationLine: 'underline'}}>
                                    {config.contact}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    
                </Grid>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    name:{
        fontSize:22,
        fontWeight: 'bold',
        padding: 15,
        color: config.primaryColor
    },
    grid:{
        marginTop: 5,
        width: '95%',
    },
    row:{
        marginTop: 10
    },
    key:{
        fontSize: 16,
        marginLeft: 40,
    },
    value:{
        fontSize: 16,
        color: '#808080'
    },
    thumbnail:{
       marginTop: 30,
       width:150,
       height:150
    },
});
  