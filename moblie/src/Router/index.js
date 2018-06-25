import React, { PureComponent } from 'react';

import { connect } from 'react-redux';

import { Animated, Text } from 'react-native'

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { windowW } from '../public/fn'

import Loading from '../containers/Loading'

import Login from '../containers/Login'

import Chat from '../containers/Chat'

import SettingChildren from '../containers/SettingChildren'

import Search from '../containers/Search'

import Infor from '../containers/Infor'

import NoticeChildren from '../containers/NoticeChildren'

import { ratio } from '../public/fn'

import Icons from '../Icons'

import Message from '../containers/Message'

import User from '../containers/User'

import Notice from '../containers/Notice'

import Setting from '../containers/Setting'

import VideoCall from '../containers/VideoCall'

const Index = createBottomTabNavigator(
    {
        'message': Message,
        'user': User,
        'notice': Notice,
        'setting': Setting,
    }, {
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
                },
                tabBarVisible: navigation.state.routeName == 'search' ? false : true
            }
        }
    }
);

const Main = createStackNavigator(
    {
        index: Index,
        chat: Chat,
        settingChildren: SettingChildren,
        search: Search,
        infor: Infor,
        noticechildren: NoticeChildren,
        call: VideoCall
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
    loginActiveState: state.c.loginActiveState,
}))(Router);
