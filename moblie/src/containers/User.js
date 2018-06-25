import React, { PureComponent, Component } from 'react'

import { View, SectionList } from 'react-native'

import { connect } from 'react-redux'

import Box from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { UserItem, Classify } from '../components/NewUserList'

import { borderColor } from '../public/config'

import { ratio } from '../public/fn'

import { setUShow, setUActiveid } from '../store/users/action'

class User extends PureComponent {

    setShow = (id) => {
        let show = [...this.props.show];

        const index = show.indexOf(id);

        if (index > -1) {
            show.splice(index, 1);
        }
        else {
            show.push(id);
        }
        setTimeout(() => {
            this.props.dispatch(setUShow(show));
        }, 0);
    }

    renderItem = ({ item }) => (
        <UserItem
            {...item}
            href={this.tochat}
            show={this.props.show.indexOf(item.class) > -1}
        />
    );
    // 分类标题
    renderSectionHeader = ({ section }) => (
        <Classify
            {...section.class}
            show={this.props.show.indexOf(section.class.id) > -1}
            onshow={this.setShow}
        />
    );

    tochat = (data) => {
        setTimeout(() => {
            // this.props.dispatch(setUActiveid(data.id));
            this.props.navigation.navigate('chat', data);
        }, 0);
    }

    toSearch = () => {
        this.props.navigation.navigate('search');
    }

    render() {
        const { users, show } = this.props;

        for (let i = 0; i < users.length; i++) {
            users[i].data[users[i].data.length - 1].end = true;
        }

        return (
            <Box>
                <Background active="user" />

                <Header title="好友列表" />

                <SectionList
                    ListHeaderComponent={<SearchBtn href={this.toSearch} />}
                    ListFooterComponent={(
                        <View style={{ height: ratio(200), borderTopWidth: 1, borderColor: borderColor }}></View>
                    )}
                    sections={users}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}
                />
            </Box >
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    users: state.u.users,
    show: state.u.show
}))(User);