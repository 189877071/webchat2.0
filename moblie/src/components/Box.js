import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, StatusBar, ScrollView } from 'react-native'

import { statusBarColor } from '../public/config'

const style = StyleSheet.create({
    box: {
        flex: 1,
        position: 'relative',
    },
    scroll: {
        flex: 1,
    }
})

export default class Box extends PureComponent {
    render() {
        return (
            <View style={style.box}>
                <StatusBar
                    backgroundColor={statusBarColor}
                    barStyle='light-content'
                />
                {this.props.children}
            </View>
        )
    }
}

export class ScrollBox extends Component {
    render() {
        const { center } = this.props;
        return (
            <ScrollView style={style.scroll}>
                {this.props.children}
            </ScrollView>
        )
    }
}