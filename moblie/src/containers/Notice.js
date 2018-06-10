import React, { Component } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import { FlatList } from 'react-native'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import { NoticeItem } from '../components/NoticeList'

import { ratio } from '../public/fn'

class Notice extends Component {
    toContent = (data) => {
        setTimeout(() => {
            this.props.navigation.navigate('noticechildren', data);
        }, 0);
    }
    render() {
      
        return (
            <Box>
                <Background active="notice" />
                <Header title="公告" />
                <FlatList
                    data={this.props.list}
                    ListHeaderComponent={<View style={{ height: ratio(50) }} />}
                    ListFooterComponent={<View style={{ height: ratio(50) }} />}
                    renderItem={({ item }) => (
                        <NoticeItem
                            {...item}
                            read={this.props.read.indexOf(item.id) !== -1}
                            href={this.toContent}
                        />
                    )}
                />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    list: state.n.list,
    page: state.n.page,
    active: state.n.active,
    read: state.n.read
}))(Notice);

