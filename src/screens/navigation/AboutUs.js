import React from 'react'
import {StyleSheet} from 'react-native'
import { Text, Container, Content, Thumbnail, Grid, Col, Row} from 'native-base'
import CustomHeader from '../../components/common/CustomHeader';
import config from '../../utils/config'

const schoolLogo = '../../assets/schoolLogo.png'

export default function AboutUs() {
    return (
        <Container> 
            <CustomHeader title="About Us" />
            <Content 
                showsVerticalScrollIndicator
                contentContainerStyle={styles.container}>
                <Thumbnail 
                    large
                    style={styles.thumbnail} 
                    source={ require(schoolLogo)} />
                <Text style={styles.name}>
                    {config.schoolFullName}
                </Text>    
                <Grid style={styles.grid}>
                    <Row style={{height:'auto'}}>
                        <Col>
                            <Text style={styles.key}>
                               {config.schoolInfo1}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={{height:'auto'}}>
                        <Col>
                            <Text style={styles.key}>
                               {config.schoolInfo2}
                            </Text>
                        </Col>
                    </Row>
                    <Row style={{height:'auto'}}>
                        <Col>
                            <Text style={styles.key}>
                               {config.schoolInfo3}
                            </Text>
                        </Col>
                    </Row>
                </Grid>
            </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
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
        width: '85%',
    },
    row:{
        marginTop: 10
    },
    key:{
        fontSize: 16,
        marginBottom: 30,
        color: '#363636'
    },
    thumbnail:{
       marginTop: 30,
       width:150,
       height:150
    },
});
  