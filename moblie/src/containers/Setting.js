import React, { Component } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import Box, { ScrollBox } from '../components/Box'

import { BigButton } from '../components/Button'

import { Background } from '../components/Image'

import { ratio, ofetch } from '../public/fn'

import { setLoginActiveState } from '../store/common/action'

import { UserPhoto, UserName, SettingItems } from '../components/SettingList'

class Setting extends Component {
    exit = async () => {
        const { success, error } = await ofetch('/exit', this.props.socketInfor);
        if (!success) {
            alert(error);
            return;
        }
        this.props.exit();
    }
    render() {
        return (
            <Box>
                <Background active="setting" />
                <ScrollBox>
                    <UserPhoto />
                    <UserName />
                    <SettingItems navigation={this.props.navigation} />
                    <BigButton title='退出' onPress={this.exit} />
                    <View style={{ paddingBottom: ratio(100) }} />
                </ScrollBox>
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    socketInfor: state.c.socketInfor,
}), (dispatch, props) => ({
    exit: () => dispatch(setLoginActiveState(2))
}))(Setting);