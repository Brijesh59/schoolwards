import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardItem, Left, Text, Icon, Right, Body } from 'native-base'
import { cacheFile, formatDateTime } from '../../utils/functions'
export default function MessageDetails({details}) {
    console.log(details)
    return (
        <View>
            <Card style={styles.container} >
                <CardItem header bordered >
                    <Left>
                        <Body>
                            <Text style={styles.title}>
                                {details.title}
                            </Text>
                            <Text style={styles.subTitle}>
                                Send By - {details.sendBy}
                            </Text>
                        </Body>    
                    </Left>
                    <Right>
                        <Icon name="mail" style={styles.iconStyle} />
                    </Right>
                
                </CardItem>
                <CardItem >
                    <Body>
                        <Text style={styles.description}>     
                            {details.description}
                        </Text>
                    </Body>
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
    subTitle: { 
        color: '#363636',
        fontWeight: '300',
        fontSize: 13
    },
    description:{
        color: '#707070', 
    },
    normal: {
        color: '#2C96EA', 
        fontWeight: '400',
        fontSize: 14,
        width: '100%'
    },
    iconStyle:{
        color: '#2C96EA',
        fontSize: 22
    }
});
