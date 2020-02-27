import React, { Component } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'
import config from '../../utils/config'

export default class ActivityLoader extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <View style={[styles.container, styles.horizontal, this.props.style]}>
        <ActivityIndicator size="large" color={config.secondaryColor} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 20
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
