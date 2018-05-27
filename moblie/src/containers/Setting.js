import React, { Component } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import Box, { ScrollBox } from '../components/Box'

import { BigButton } from '../components/Button'

import { Background } from '../components/Image'

import { ratio } from '../public/fn'

import { UserPhoto, UserName, SettingItems } from '../components/SettingList'

class Setting extends Component {
    render() {
        return (
            <Box>
                <Background active="setting" />
                <ScrollBox>
                    <UserPhoto />
                    <UserName />
                    <SettingItems navigation={this.props.navigation} />
                    <BigButton title='退出' />
                    <View style={{ paddingBottom: ratio(100) }} />
                </ScrollBox>
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation
}), (dispatch, props) => ({}))(Setting);