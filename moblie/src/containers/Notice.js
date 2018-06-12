import React, { Component } from 'react';

import { View, FlatList, RefreshControl, Text } from 'react-native';

import { connect } from 'react-redux';

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import { NoticeItem } from '../components/NoticeList'

import { ratio, ofetch, hint } from '../public/fn'

import { setNInit, setNAddList } from '../store/notice/action'

class Notice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            isload: false
        };
    }
    // 查看公告
    toContent = (data) => {
        setTimeout(() => {
            this.props.navigation.navigate('noticechildren', data);
        }, 0);
    }
    // 刷新
    refresh = async () => {
        this.setState({ refresh: true });
        const { success, data } = await ofetch('/notice?optation=refresh');

        this.setState({ refresh: false });

        if (!success) {
            hint('数据获取失败');
            return;
        }

        this.props.dispatch(setNInit(data));
    }
    // 加载
    loaddata = async () => {

        let { active, page } = this.props;

        if (active >= page || this.state.refresh) {
            return;
        }

        this.setState({ isload: true });

        const { success, data } = await ofetch('/notice?optation=load', { page: active });

        this.setState({ isload: false });

        if (!success) {
            hint('数据获取失败');
            return;
        }

        this.props.dispatch(setNAddList(data));
    }

    render() {

        return (
            <Box>
                <Background active="notice" />
                <Header title="公告" />
                <FlatList
                    data={this.props.list}
                    ListHeaderComponent={<View style={{ height: ratio(50) }} />}
                    ListFooterComponent={(
                        <View style={{ height: ratio(100), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: ratio(35), color: '#333' }}>
                                {this.state.isload ? '正在加载数据……' : ''}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id + ''}
                    renderItem={({ item }) => (
                        <NoticeItem
                            {...item}
                            read={this.props.read.indexOf(item.id) !== -1}
                            href={this.toContent}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            colors={['#4a6f8a', '#6790AD', '#8EADC2', '#AD8467', '#C2A48E']}
                            onRefresh={this.refresh}
                        />
                    }
                    onEndReached={this.loaddata}
                    onEndReachedThreshold={0.2}
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

