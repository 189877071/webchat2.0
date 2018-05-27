import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Animated, Easing } from 'react-native'

import Box from '../components/Box'

import { LogoImg, WebchatImg, LogoBox, Background } from '../components/Image'

import { LoginForm } from '../components/Input'

import { LoginBottom } from '../components/Bottom'

import { ratio } from '../public/fn'

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
                    outputRange: [0, -ratio(400)]
                })
            }]
        };
        const bottom = this.props.keyboard || <LoginBottom />;
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
                    <LoginForm />
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