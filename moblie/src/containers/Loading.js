import React, { Component } from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { headerBackground, hostname } from '../public/config'

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
        // 先获取 
        const response = await fetch(hostname + '/init', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': "include"
            },
        });

        this.props.navigation.navigate(response.success ? 'index' : 'login');
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