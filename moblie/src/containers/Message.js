import React, { Component } from 'react'

import { connect } from 'react-redux'

import { FlatList, StyleSheet, View, AppState } from 'react-native'

import JPushModule from 'jpush-react-native'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { MessageItem } from '../components/UserList'

import { getMessage, ratio, customEvent } from '../public/fn'

import { borderColor } from '../public/config'

import { SetUTopChat, setUDeletChat, setUActiveid } from '../store/users/action'

import { setNavigation } from '../store/common/action'

const oCustomEvent = customEvent();

class Message extends Component {
    toSearch = () => {
        this.props.navigation.navigate('search');
    }

    _pushnavigation = () => {

        const { dataPush, dispatch, navigation, currentid } = this.props;

        if (!dataPush || AppState.currentState !== 'active') return;

        const { optation, id, answer } = dataPush;

        let params = { id: parseInt(id) };

        if (answer) params.answer = true;

        if (currentid != params.id) {
            navigation.push(optation, params);
        }

        dispatch(setNavigation(null));

        // 清除所有推送信息
        JPushModule.cleanTags(success => { });
    }

    componentDidMount() {

        setTimeout(() => {
            this._pushnavigation();
        }, 500);

        AppState.addEventListener('change', this._pushnavigation);

        oCustomEvent.on('messagecall', ({ id }) => {
            if (AppState.currentState === 'active') {
                this.props.navigation.push('call', { id, answer: '1' });
            }
        }, 2);

    }

    componentWillMount() {
        AppState.removeEventListener('change', this._pushnavigation);
    }

    ItemCom = ({ item }) => {
        return (
            <MessageItem
                {...item}
                settop={this.setTop}
                delet={this.deletChat}
                tochat={this.tochat}
            />
        )
    }
    // 置顶
    setTop = (id) => {
        this.props.dispatch(SetUTopChat(id));
    }
    // 删除
    deletChat = (id) => {
        this.props.dispatch(setUDeletChat(id, true));
    }
    // 转跳聊天页面
    tochat = (data) => {
        setTimeout(() => {
            // this.props.dispatch(setUActiveid(data.id));
            // 还要把未读的信息转化成已读的信息

            this.props.navigation.navigate('chat', data);
        }, 0);
    }
    render() {
        const { chatting, users, top } = this.props;
        // 获取未读信息
        const messages = getMessage(chatting, users, top);

        return (
            <Box>
                <Background active="message" />
                <Header title="聊天记录" />
                <FlatList
                    data={messages}
                    ListHeaderComponent={<SearchBtn href={this.toSearch} />}
                    ListFooterComponent={<View style={{ height: ratio(200) }} />}
                    renderItem={this.ItemCom}
                />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    chatting: state.u.chatting,
    users: state.u.users,
    top: state.u.top,
    dataPush: state.c.dataPush,
    currentid: state.u.currentid
}))(Message);
