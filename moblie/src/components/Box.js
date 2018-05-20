import React, { Component } from 'react'

import { View, StyleSheet } from 'react-native'

const style = StyleSheet.create({
    box: {
        flex: 1,
        position: 'relative',
    }
})

export default class Box extends Component {
    render() {
        return (
            <View style={style.box}>
                {this.props.children}
            </View>
        )
    }
}