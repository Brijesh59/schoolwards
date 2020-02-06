import React, { useEffect, useState } from 'react'
import {StyleSheet, View, } from 'react-native'
import { Container, Content, Text, Card, CardItem, Body, Left, Right} from 'native-base'
import CustomHeader from '../../components/common/CustomHeader'
import ActivityLoader from '../../components/common/ActivityLoader'
import axios from 'axios'
import APIs from '../../utils/api'
import { ScrollView } from 'react-native-gesture-handler'


function FeeDetails(props) {
    const Class = props.Class
    const Section = props.Section
    const [items, setItems] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [emptyData, setEmptyData] = useState(null)
    const [errorData, setErrorData] = useState(null)

    useEffect( ()=>{
        setIsLoading(true)
        let formData = new FormData();
        formData.append('division', Section)
        formData.append('standard', Class)
        formData.append('appname', 'svs')
    
        axios.post( APIs.GET_FEE, formData, 
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        )
        .then(async(res) => {
            setIsLoading(false)
            const response = res.data.response
            
            if(response === 'success'){
                console.log('Login Success.')  
                const data = res.data.fee_structure
                
                if(data.length === 0){
                    console.log("data: ", data)
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
                console.log("Installments: ", installMentsList)
            }
            else{
                setIsLoading(false)
                setErrorData(error.message)
                console.log('Login Failed => ', response)  
            }
        })
        .catch(error => {
            setIsLoading(false)
            setErrorData(error.message)
        })
    }, [])
    
    const renderItems = []
    for (let key in items){
        renderItems.push(
            <Card style={styles.card}>
                <CardItem header bordered>
                    <Text style={styles.header}>{key}</Text>
                </CardItem>
                {
                    items[key].map(i=>(
                        <CardItem>   
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
                        <Text style={[styles.text, {color: '#2C96EA'}]}>
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
    console.log("RenderItems: ", items)
    return (
        <Container> 
            <CustomHeader title="Fee Details" />
            <Content 
                contentContainerStyle={styles.container}> 
                <ScrollView style={{width: '100%'}}>
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
                </ScrollView>
               
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
    card:{
        flex: 1,
        width: '95%',
        marginLeft: '2.5%',
        marginTop: '2%',
    },
    header:{
        fontSize: 18,
       // paddingLeft: 10,
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
        fontSize: 16,
        marginLeft: 10,
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

// const mapStateToProps = state => {
//    // console.log("GlobaleState: ", state)
//     return {
//         students: state.studentReducer.students
//     }
// }

// const mapDispatchToProps = dispatch =>{
//     return {
//         pushStudent: dispatch(pushStudent())
//     }
// }   

export default FeeDetails




/*
rn-fetch-blob

let dirs = RNFetchBlob.fs.dirs
RNFetchBlob
.config({
  // response data will be saved to this path if it has access right.
  path : dirs.DocumentDir + '/path-to-file.anything'
})
.fetch('GET', 'http://www.example.com/file/example.zip', {
  //some headers ..
})
.then((res) => {
  // the path should be dirs.DocumentDir + 'path-to-file.anything'
  console.log('The file saved to ', res.path())
})

*/