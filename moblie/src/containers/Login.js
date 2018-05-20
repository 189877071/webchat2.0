import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Animated, Easing } from 'react-native'

import Box from '../components/Box'

import { LogoImg, Webchat, LogoBox } from '../components/Logo'

import LgForm from '../components/LgForm'

import LgBottom from '../components/LgBottom'

import LgBg from '../components/LgBg'

import { ratio } from '../public/config'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1),
            translateY: new Animated.Value(0)
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
    }
    componentWillUpdate() {
        this.showlogo(this.props.keyboard);
    }
    render() {
        const transform = {
            transform: [{
                translateY: this.state.translateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -400 / ratio]
                })
            }]
        };
        const bottom = this.props.keyboard || <LgBottom />;
        return (
            <Box>
                <LgBg />
                <Animated.View style={transform}>
                    <LogoBox>
                        <Animated.View style={{ opacity: this.state.opacity }}>
                            <LogoImg />
                        </Animated.View>
                        <Webchat />
                    </LogoBox>
                    <LgForm />
                </Animated.View>
                {bottom}
            </Box>
        )
    }
}

export default connect((state, props) => {
    return {
        keyboard: state.c.keyboard
    }
})(Login);