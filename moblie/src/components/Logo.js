import React, { PureComponent } from 'react'

import { View, Image, StyleSheet, Animated, Easing } from 'react-native'

import { ratio } from '../public/config'

import LgForm from '../components/LgForm'


// 假设设计图为 1080 px 
// 已知屏幕当前的宽度 求比值
// 1080 / width

const style = StyleSheet.create({
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50 / ratio,
    },
    img: {
        width: 450 / ratio,
        height: 450 / ratio,
    },
    webchat: {
        width: (269 * 1.2) / ratio,
        height: (64 * 1.2) / ratio,
    }
});

export class LogoImg extends PureComponent {
    render() {
        return (
            <Image
                style={style.img}
                source={require('../public/image/login.png')}
            />
        )
    }
}

export class Webchat extends PureComponent {
    render() {
        return (
            <Image
                source={require('../public/image/webchat.png')}
                style={style.webchat}
            />
        )
    }
}

export class LogoBox extends PureComponent {
    render() {
        return (
            <View style={style.box}>{this.props.children}</View>
        )
    }
}