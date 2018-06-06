import React, { Component } from 'react';

import { View, KeyboardAvoidingView, ScrollView } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { ChatHeader } from '../components/Header'

import { ChatTab, MiTextMessage, HeTextMessage } from '../components/Chat'

import { EditorInput } from '../components/Input'

import { getuser, ofetch, ratio, uuid } from '../public/fn'

import { setUActiveid, setUAddChat } from '../store/users/action'

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defvalue: '',
        }
        this.value = '';
    }

    backup = () => {
        this.props.dispatch(setUActiveid(null));
        this.props.navigation.goBack();
    }

    setvalue = value => this.value = value;

    send = async () => {
        // 发送消息
        if (!this.value) return;

        const oid = uuid();

        const data = {
            heid: this.props.navigation.getParam('id'),
            otype: 'message',
            content: this.value
        };

        let odata = {
            time: Date.now(),
            id: oid,
            sender: 'mi',
            otype: data.otype,
            content: data.content,
            userid: data.heid,
            state: 'transmit'
        };

        this.props.dispatch(setUAddChat(odata));

        const { success, id } = await ofetch('/message', data);

        odata.alertid = oid;

        if (success) {
            odata.id = id;
            odata.state = 'read';
        }
        else {
            odata.state = 'error';
        }

        this.props.dispatch(setUAddChat(odata));

        this.value = '';
        this.updatevalue();
    }

    updatevalue = () => this.setState({ defvalue: this.value });

    render() {
        const user = getuser(this.props.navigation.getParam('id'), this.props.users);

        if (!user) {
            this.backup();
        }

        return (
            <Box>
                <Background active="chat" />
                <ChatHeader
                    goBack={this.backup}
                    name={user.name || user.username}
                    state={user.isonline}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ height: ratio(50) }} />
                    <MiTextMessage />
                    <HeTextMessage />
                </ScrollView>
                <EditorInput
                    value={this.state.defvalue}
                    setvalue={this.setvalue}
                    send={this.send}
                />
                <ChatTab />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    users: state.u.users,
}), (dispatch, props) => ({}))(Chat);