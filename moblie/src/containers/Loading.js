import React, { Component } from 'react';

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

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.init();
    }
    async init() {

        const data = await ofetch('/init');

        this.props.navigation.navigate(data.success ? 'index' : 'login');
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
    navigation: props.navigation
}), (dispatch, props) => ({}))(Container);