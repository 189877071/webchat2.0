import React, { PureComponent } from 'react'

import { View, Text, StyleSheet } from 'react-native'

import Icons from '../Icons'

import { ratio } from '../public/config'

const style = StyleSheet.create({
    box: {
        position: 'absolute',
        bottom: 40 / ratio,
        width: 1080 / ratio,
        height: 86 / ratio,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#435059'
    },
})

export default class LgBottom extends PureComponent {
    render() {
        return (
            <View style={style.box}>
                <Text style={style.text}><Icons name='icon-qingqiu' style={style.text} size={14} /> 无知不是生存的障碍，傲慢才是！</Text>
            </View>
        )
    }
}