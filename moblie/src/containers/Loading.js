import React, { Component, PureComponent } from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { headerBackground, hostname } from '../public/config'

import { ofetch } from '../public/fn'

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

const styles = StyleSheet.create({
    box: {
        flex: 1
    }
})

class Container extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        // alert(this.props.loginActiveState)
    }
    componentDidUpdate() {
        const { loginActiveState } = this.props;

        switch (loginActiveState) {
            case 1:
                this.props.navigation.navigate('index');
                break;
            case 2:
                this.props.navigation.navigate('login');
                break;
        }
    }
    async init() {
        const data = await ofetch('/init');
    }
    render() {
        return (
            <Box>
                <ActivityIndicator
                    style={styles.box}
                    color={headerBackground}
                    size='large'
                />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    loginActiveState: state.c.loginActiveState,
}), (dispatch, props) => ({}))(Container);