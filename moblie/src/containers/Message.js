import React, { Component } from 'react'

import { connect } from 'react-redux'

import { FlatList, StyleSheet, View } from 'react-native'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { MessageItem } from '../components/UserList'

import { getMessage, ratio } from '../public/fn'

import { borderColor } from '../public/config'

import { SetUTopChat, setUDeletChat, setUActiveid } from '../store/users/action'

class Message extends Component {
    toSearch = () => {
        this.props.navigation.navigate('search');
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
            this.props.dispatch(setUActiveid(data.id));
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
}))(Message);
