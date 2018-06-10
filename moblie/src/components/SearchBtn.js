import React, { PureComponent } from 'react'

import { View, Text, StyleSheet, } from 'react-native'

import Icons from '../Icons'

import { ratio } from '../public/fn'

import { pleft, pright } from '../public/config'

import { FeedBackBtn } from './Button'

const style = StyleSheet.create({
    box: {
        height: ratio(90),
        marginLeft: pleft,
        marginRight: pright,
        marginTop: ratio(30),
        marginBottom: ratio(30),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: ratio(10),
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden'
    },
    text: {
        fontSize: ratio(42),
        color: '#747474'
    },
    iconstyle: {
        marginRight: ratio(10),
        transform: [{
            translateY: ratio(2)
        }]
    }
})

export default class SearchBtn extends PureComponent {
    render() {
        return (
            <View style={style.box}>
                <Text style={style.iconstyle}>
                    <Icons name='icon-search' size={ratio(48)} color='#747474' />
                </Text>
                <Text style={style.text}>搜 索</Text>
                <FeedBackBtn onPress={this.props.href} />
            </View>
        )
    }
}