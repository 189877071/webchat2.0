import React, { PureComponent } from 'react'

import { View, Image, StyleSheet } from 'react-native'

import { ratio, windowH, windowW } from '../public/fn'

const [w50, w450] = [
    ratio(50),
    ratio(450)
]


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

    getImg = () => {
        switch (this.props.active) {
            case 'login':
                return require('../public/image/login.jpg');
            case 'message':
                return require('../public/image/message.jpg');
            case 'notice':
                return require('../public/image/notice.jpg');
            case 'user':
                return require('../public/image/user.jpg');
            case 'setting':
                return require('../public/image/setting.jpg');
            case 'settingchildren':
                return require('../public/image/settingchildren.jpg');
            case 'chat':
                return require('../public/image/chat.jpg');
            case 'infor':
                return require('../public/image/infor.jpg');
            case 'search':
                return require('../public/image/search.jpg');
        }
    }

    render() {
        return (
            <Image source={this.getImg()} resizeMode='cover' style={style.bg} />
        )
    }
}