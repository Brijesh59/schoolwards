import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import {
    Badge, Text
  } from 'native-base'

export default class DataLoader extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <Badge warning>
            <Text>Refreshing ...</Text>
        </Badge>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10
  }
})
