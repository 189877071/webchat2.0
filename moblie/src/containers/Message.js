import React, { Component } from 'react'

import { connect } from 'react-redux'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { MessageItem } from '../components/UserList'

class Message extends Component {
    render() {
        return (
            <Box>
                <Background active="message" />
                <Header title="聊天记录" />
                <ScrollBox>
                    <SearchBtn />
                    <MessageItem />
                </ScrollBox>
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation
}))(Message);
