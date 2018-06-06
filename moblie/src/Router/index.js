import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import { Animated, Easing } from 'react-native'

import { createStackNavigator } from 'react-navigation'

import { windowW } from '../public/fn'

import Loading from '../containers/Loading'

import Login from '../containers/Login'

import Index from '../containers/Index'

import Chat from '../containers/Chat'

import SettingChildren from '../containers/SettingChildren'

const Main = createStackNavigator(
    {
        index: Index,
        chat: Chat,
        settingChildren: SettingChildren
    },
    {
        initialRouteName: 'index',
        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            gesturesEnabled: false,
        },
        transitionConfig() {
            return {
                transitionSpec: {
                    duration: 200,
                    // easing: Easing.out(Easing.poly(4)),
                    timing: Animated.timing,
                },
                screenInterpolator: sceneProps => {
                    const { layout, position, scene } = sceneProps;

                    const { index } = scene;
                    
                    const translateX = position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [windowW, 0, 0],
                    });

                    const opacity = position.interpolate({
                        inputRange: [index - 1, index - 0.99, index],
                        outputRange: [0, 1, 1],
                    });

                    return { opacity, transform: [{ translateX }] };
                },
            }
        }
    }
);

class Router extends PureComponent {
    getinitialRouteName() {
        switch (this.props.loginActiveState) {
            case 1:
                return Main;
            case 2:
                return Login;
            default:
                return Loading;
        }
    }
    render() {
        const Route = this.getinitialRouteName();
        return (<Route />);
    }
};

export default connect((state, props) => ({
    loginActiveState: state.c.loginActiveState
}), (dispatch, props) => ({}))(Router);
