import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, CardItem, Left, Text, Icon, Right, Body } from 'native-base'

export default function AnnouncementDetails({details}) {
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
                        <Icon name="megaphone" style={styles.iconStyle} />
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
                    <Right>
                        <Text style={styles.normal}>
                            {details.dateTime}
                        </Text>
                    </Right>
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
