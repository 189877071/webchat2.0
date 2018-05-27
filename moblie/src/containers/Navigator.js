import React, { Component } from 'react'

import {Easing, Animated} from 'react-native'

import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import Main from './Main'

import SettingChildren from './SettingChildren'

export default createStackNavigator(
    {
        main: Main,
        settingchildren: SettingChildren,
    },
    {
        initialRouteName: 'settingchildren',
        headerMode: 'none',
        mode: 'modal',
        navigationOptions: {
            gesturesEnabled: false,
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;

                const height = layout.initHeight;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [height, 0, 0],
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                return { opacity, transform: [{ translateX }] };
            },
        }),
    }
)
