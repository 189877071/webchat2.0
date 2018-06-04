import React, { Component } from 'react';

import { View, KeyboardAvoidingView } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { ChatHeader } from '../components/Header'

import { ScrollBox, ChatTab } from '../components/Chat'

import { EditorInput } from '../components/Input'

class Chat extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Box>
                <Background active="chat" />
                <ChatHeader />
                <ScrollBox />
                <EditorInput />
                <ChatTab />
            </Box>
        )
    }
}

export default connect((state, props) => ({}), (dispatch, props) => ({}))(Chat);