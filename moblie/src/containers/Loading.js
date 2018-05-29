import React, { Component } from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { headerBackground } from '../public/config'

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

const styles = StyleSheet.create({
    box: {
        flex: 1
    }
})

class Container extends Component {
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