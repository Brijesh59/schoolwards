import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard  } from 'react-native'
import ActivityLoader from '../components/common/ActivityLoader'
import { Actions } from 'react-native-router-flux'
import Button from '../components/common/CustomButton'
import app_config from '../utils/config'
import NetworkRequest from '../utils/NetworkRequest'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      value: '',
      isLoading: false,
      data: '',
      error: ''
    }
  }
  onChangeText = (value) => {
    this.setState({
      value,
      data: '',
      error: ''
    })  
  }

  sendOTP = async() => {
    Keyboard.dismiss()
    if(!this.state.value){
      this.setState({ data: {response: "invalid mobile no"}, value: ''})
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
    else if(data.includes('Network')){
      this.setState({error: 'No internet connection found.'})
    }
    else{
      this.setState({error: data.response})
    }
  }

  render() {
    console.log('Login Screen re-rendered ...')
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Enter your mobile number
        </Text>
        <Text style={styles.subTitle}>
          Please enter your registered mobile number.
        </Text>
        <TextInput
          value={this.state.value}
          numeric 
          keyboardType={'numeric'} 
          placeholder="Your 10 digit Mobile No"
          autoCompleteType="off"
          onChangeText={this.onChangeText}
          style={styles.inputStyle}
        />
        { 
          this.state.data.response && 
          this.state.data.response !== 'success' && 
          this.state.data.response.includes('invalid') &&
          <Text style={styles.errorText}>
            {this.state.data.response}
          </Text> 
        } 
        <Button 
          title='Next'
          onPressFunction={this.sendOTP}
          style={{marginTop: 20, width:'80%'}}
          disabled={this.state.isLoading}
        />
        { this.state.isLoading && <ActivityLoader /> }
        { this.state.error != '' &&
          <Text style={styles.errorStyle}>
            {this.state.error}
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
  inputStyle:{
    height: 45, 
    borderColor: 'gray', 
    borderWidth: 1, 
    width:'80%', 
    textAlign:'center', 
    marginTop: 20,
    fontSize: 16 
  },
  errorText: {
    width: '80%',
    paddingTop: 5,
    color: '#f44336',
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