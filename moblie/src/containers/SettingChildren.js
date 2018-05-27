import React, { Component, PureComponent } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { InlineHeader } from '../components/Header'

import { AlterName, AlterEmail ,AlterPassword, AlterSynopsis } from '../components/Alter'

class SettingChildren extends Component {
    render() {
        return (
            <Box>
                <Background active="settingchildren" />
                <InlineHeader title="修改昵称" />
                <AlterSynopsis />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation
}), (dispatch, props) => ({}))(SettingChildren);