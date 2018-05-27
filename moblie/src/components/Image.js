import React, { PureComponent } from 'react'

import { View, Image, StyleSheet } from 'react-native'

import { ratio, windowH, windowW } from '../public/fn'

const [w50, w450] = [
    ratio(50),
    ratio(450)
]

const img = {
    login: require('../public/image/login.jpg'),
    message: require('../public/image/message.jpg'),
    notice: require('../public/image/notice.jpg'),
    user: require('../public/image/user.jpg'),
    setting: require('../public/image/setting.jpg'),
    settingchildren: require('../public/image/settingchildren.jpg'),
}

const style = StyleSheet.create({
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: w50,
    },
    img: {
        width: w450,
        height: w450,
    },
    webchat: {
        width: ratio(269) * 1.2,
        height: ratio(64) * 1.2,
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowW,
        height: windowH,
        zIndex: -1
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

export class WebchatImg extends PureComponent {
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

export class Background extends PureComponent {
    render() {
        let source = img.login;

        if (this.props.active && img[this.props.active]) {
            source = img[this.props.active];
        }

        return (
            <Image
                source={source}
                resizeMode='cover'
                style={style.bg}
            />
        )
    }
}