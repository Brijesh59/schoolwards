import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import config from '../utils/config';

const onboardingImage1 = '../assets/onboarding1.png'
const onboardingImage2 = '../assets/onboarding2.png'
const onboardingImage3 = '../assets/onboarding3.png'

const slides = [
    {
      key: 'somethun',
      text: 'Let\'s change the way to educate our children for better future.',
      image: require(onboardingImage1),
    },
    {
      key: 'somethun-dos',
      text: 'This digital platform will helpy you to monotor your child\'s activities and achievenemts in school.',
      image: require(onboardingImage3),
    },
    {
      key: 'somethun1',
      text: 'You can monitor you child\'s academic progress and find out the school agenda all in your hands.',
      image: require(onboardingImage3),
      btn: true
    }
];

export default class App extends React.Component {
  state = {
    showRealApp: false
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
        {item.btn &&
          <View style={styles.doneBtn}>
              <TouchableOpacity
                  style={styles.btn}
                  onPress={async()=>{
                    console.log('Pressed')
                    await AsyncStorage.setItem('isFirstTimeUse', 'false')
                    Actions.auth()
                  }}>
                  <Text style={{fontSize: 16, letterSpacing: 1, width: '100%', textAlign:'center'}} >
                      Get started
                  </Text>
              </TouchableOpacity>
          </View>   
        }
      </View>
    );
  };

  render() {
    return (
      <AppIntroSlider 
        renderItem={this._renderItem} 
        slides={slides} 
        dotStyle={{backgroundColor: '#8DC6F3', marginBottom: 130}} 
        activeDotStyle={{backgroundColor: config.secondaryColor, marginBottom: 130}}
        showDoneButton={false}
        showNextButton={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100
  },
  text:{
    width: 300,
    marginTop: 30,
    fontSize: 17,
    letterSpacing: 1,
    textAlign:"center",
    color: '#808080'
  },
  doneBtn:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,       
  },
  btn:{
    backgroundColor: config.secondaryColor,
    padding: 10,
    width: 230,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});
