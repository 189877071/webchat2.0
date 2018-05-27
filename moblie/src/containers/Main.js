import React, { Component } from 'react'

import { View, Text } from 'react-native'

import { createBottomTabNavigator } from 'react-navigation'

import { ratio } from '../public/fn'

import Icons from '../Icons'

import Message from './Message'

import User from './User'

import Notice from './Notice'

import Setting from './Setting'

export default createBottomTabNavigator(
    {
        'message': Message,
        'user': User,
        'notice': Notice,
        'setting': Setting
    },
    {
        initialRouteName: 'message',
        tabBarOptions: {
            activeTintColor: '#23b8a5',
            inactiveTintColor: '#5a6c80'
        },
        order: ['user', 'message', 'notice', 'setting'],
        navigationOptions({ navigation }) {
            return {
                tabBarIcon({ focused, tintColor }) {
                    const { routeName } = navigation.state;
                    let iconName;
                    switch (routeName) {
                        case 'message':
                            iconName = 'icon-xiaoxi1';
                            break;
                        case 'user':
                            iconName = 'icon-lianxiren';
                            break;
                        case 'notice':
                            iconName = 'icon-gonggao';
                            break;
                        case 'setting':
                            iconName = 'icon-bianji';
                            break;
                    }
                    const style = {
                        transform: [{
                            translateY: ratio(10)
                        }]
                    };
                    return (
                        <Icons name={iconName} style={style} size={ratio(80)} color={tintColor} />
                    )
                },
                tabBarLabel({ focused, tintColor }) {
                    const { routeName } = navigation.state;
                    let name;
                    switch (routeName) {
                        case 'message':
                            name = '消息';
                            break;
                        case 'user':
                            name = '用户';
                            break;
                        case 'notice':
                            name = '公告';
                            break;
                        case 'setting':
                            name = '设置';
                            break;
                    }
                    const style = {
                        color: tintColor,
                        fontSize: ratio(35),
                        textAlign: 'center'
                    }
                    return (
                        <Text style={style}>{name}</Text>
                    )
                }
            }
        }
    }
);