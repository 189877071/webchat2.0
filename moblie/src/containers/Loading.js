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
    async constructor(props) {
        super(props);
        this.state = {};
        // 先获取 
        await fetch(hostname + '/init', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'credentials': "include"
            },
        })
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

export default connect((state, props) => ({}), (dispatch, props) => ({}))(Container);