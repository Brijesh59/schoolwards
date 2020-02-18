import React, { useEffect, useState } from 'react'
import {StyleSheet } from 'react-native'
import { Container, Content, Text, Card, CardItem, Left, Right} from 'native-base'
import CustomHeader from '../../components/common/CustomHeader'
import ActivityLoader from '../../components/common/ActivityLoader'
import config from '../../utils/config'
import NetworkRequest from '../../utils/NetworkRequest'

function FeeDetails({Class, Section}) {
    const [items, setItems] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [emptyData, setEmptyData] = useState(null)
    const [errorData, setErrorData] = useState(null)

    useEffect( ()=>{
        async function getFeeDetailsForSelectedStudents(){
            setIsLoading(true)
            let formData = new FormData();
            formData.append('division', Section)
            formData.append('standard', Class)
            formData.append('appname', 'svs')
            const networkRequest = new NetworkRequest()
            const responseData = await networkRequest.getFeeDetails(formData)
            setIsLoading(false)  
            if(responseData.response === 'success'){
                console.log("Data, ", responseData)
                const data = responseData.fee_structure 
                if(data.length === 0){
                    setEmptyData("No data Available.")
                    return; 
                }
                let installMents = new Set() 
                data.map(d=>installMents.add(d.installment ))
                const installMentsList = {}
                Array.from(installMents).map(d=>{
                    installMentsList[d] = []
                })
                data.map(d=>{
                    installMentsList[d.installment] = [...installMentsList[d.installment], {
                        description: d.description,
                        amount: d.amount,
                        startDate: d.startDate,
                        endDate: d.endDate,
                        total: d.total_amount
                    }]
                })
                setItems(installMentsList)
            }
            else
                setErrorData(error.message)
        }
        getFeeDetailsForSelectedStudents()
    }, [])
    
    const renderItems = []
    for (let key in items){
        renderItems.push(
            <Card style={styles.card} key={key}>
                <CardItem header bordered>
                    <Text style={styles.header}>{key}</Text>
                </CardItem>
                {
                    items[key].map(i=>(
                        <CardItem key={Math.random()}>   
                            <Left>
                                <Text style={styles.text}>{i.description}</Text>
                            </Left>
                            <Right>
                                <Text style={styles.text}>{i.amount}</Text>
                            </Right>
                        </CardItem>
                    ))
                }
                <CardItem>
                    <Left>
                        <Text style={styles.text}></Text>
                    </Left>
                    <Right>
                        <Text style={[styles.text, {color: config.primaryColor}]}>
                            Total : Rs. { items[key][0].total }
                        </Text>
                    </Right>
                </CardItem>
                <CardItem footer bordered>
                    <Left>
                        <Text style={styles.text}>Last Due Date</Text>
                    </Left>
                    <Right>
                        <Text style={[styles.text, {color: '#EA2C9A'}]}>
                            { !items[key][0].endDate && 'Coming Soon'}
                        </Text>
                    </Right>
                </CardItem>
            </Card>    
        )
    }
    return (
        <Container> 
            <CustomHeader title="Fee Details" />
            <Content 
                contentContainerStyle={styles.container}> 
                    {renderItems}
                    {isLoading && <ActivityLoader />}
                    {emptyData && 
                        <Text style={styles.emptyData}>
                            {emptyData}
                        </Text>
                    }
                    {errorData && 
                        <Text style={styles.errorData}>
                            {errorData}
                        </Text>
                    }           
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    card:{
        flex: 1,
        width: '95%',
        // marginLeft: '2.5%',
        marginTop: '2%',
    },
    header:{
        fontSize: 18,
        fontWeight: "600",
        color: "#363636"
    },
    details:{
        fontSize: 14,
        marginLeft: 10,
        fontWeight: "400",
        color: "#707070"
    },
    text:{
        fontSize: 14,
        fontWeight: "400",
        color: "#707070"
    },
    emptyData:{
        padding: 20,
    },
    errorData:{
        padding: 20,
    }  
});

export default FeeDetails

