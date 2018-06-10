import React, { Component } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import { FlatList } from 'react-native'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import { NoticeItem } from '../components/NoticeList'

class Notice extends Component {
    render() {
        return (
            <Box>
                <Background active="notice" />
                <Header title="公告" />
                {/* <ScrollBox>
                    <NoticeItem />
                </ScrollBox> */}
                <FlatList 
                    
                />
            </Box>
        )
    }
}

export default connect((state, props) => ({}), (dispatch, props) => ({}))(Notice);

