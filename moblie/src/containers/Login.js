import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Animated, Easing, Keyboard } from 'react-native'

import Box from '../components/Box'

import { LogoImg, WebchatImg, LogoBox, Background } from '../components/Image'

import { LoginForm } from '../components/Input'

import { LoginBottom } from '../components/Bottom'

import { ratio } from '../public/fn'

import { setCData } from '../store/common/action'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1),
            translateY: new Animated.Value(0),
            bottom: true,
        }
    }

    showlogo(onoff) {
        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: onoff ? 1 : 0,
                duration: 100,
                easing: Easing.linear
            }),
            Animated.timing(this.state.translateY, {
                toValue: onoff ? 0 : 1,
                duration: 100,
                easing: Easing.linear
            })
        ]).start();
        this.setState({ bottom: onoff });
    }
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.showlogo(false));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.showlogo(true));
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    loginSuccess = (params) => {
        this.props.dispatch(setCData(params));
    }
    render() {
        const transform = {
            transform: [{
                translateY: this.state.translateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -ratio(400)]
                })
            }]
        };

        const bottom = this.state.bottom && <LoginBottom />;

        return (
            <Box>
                <Background active='login' />
                <Animated.View style={transform}>
                    <LogoBox>
                        <Animated.View style={{ opacity: this.state.opacity }}>
                            <LogoImg />
                        </Animated.View>
                        <WebchatImg />
                    </LogoBox>
                    <LoginForm callback={this.loginSuccess} socketInfor={this.props.socketInfor} />
                </Animated.View>
                {bottom}
            </Box>
        )
    }
}

export default connect((state, props) => ({
    keyboard: state.c.keyboard,
    socketInfor: state.c.socketInfor
}))(Login);