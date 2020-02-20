import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import ActivityLoader from '../components/common/ActivityLoader'
import { Actions } from 'react-native-router-flux'
import CustomButton from '../components/common/CustomButton'
import app_config from '../utils/config'
import NetworkRequest from '../utils/NetworkRequest'


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      value: '',
      isLoading: false,
      data: '',
    }
  }
  componentDidMount = async() => {                        
  
  }

  onChangeText = (text) => {
    this.setState({
      value: text,
      data: ''
    })  
  }

  sendOTP = async() => {
    if(!this.state.value){
      this.setState({ data: {response: "invalid_mobile"}, value: ''})
      return
    }
    this.setState({isLoading: true, data: ''})
    let formData = new FormData();
    formData.append('mobile', this.state.value)
    formData.append('appname', app_config.schoolName)
    const networkRequest = new NetworkRequest()
    const data = await networkRequest.getOTP(formData)
    this.setState({isLoading: false, data})
    if(data.response === 'success'){
      Actions.OTP(this.state.value);
    }
  }

  render() {
    console.log('Login Screen Re-rendered ...')
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Enter your mobile number
        </Text>
        <Text style={styles.subTitle}>
          Please enter your registered mobile number.
        </Text>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, width:'80%', textAlign:'center', marginTop: 20 }}
          onChangeText={text => this.onChangeText(text)}
          value={this.state.value}
          numeric 
          keyboardType={'numeric'} 
          placeholder="Your 10 digit Mobile No"
          autoCompleteType="off"
        />
        <CustomButton 
          title='Next'
          onPressFunction={this.sendOTP}
          style={{marginTop: 20, width:'80%'}}
          disabled={this.state.isLoading}
        />
        { this.state.isLoading && <ActivityLoader /> }
        { this.state.data.response && this.state.data.response!='success' && 
          <Text style={styles.errorStyle}>
            {this.state.data.response}
          </Text> 
        }   
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 150
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  subTitle:{
    fontSize: 17,
    width: 250,
    textAlign: 'center',
    margin: 10,
    color: '#808080'
  },
  errorStyle: {
    width: '80%',
    marginTop: 20,
    backgroundColor: '#ffcdd2',
    padding: 10,
    textAlign: 'center',
    borderColor: '#f44336',
    borderWidth: 1
  }
})

export default Login