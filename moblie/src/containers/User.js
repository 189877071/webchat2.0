import React, { PureComponent, Component } from 'react'

import { View } from 'react-native'

import { connect } from 'react-redux'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { UserItem, Classify } from '../components/NewUserList'

import { borderColor } from '../public/config'

import { ratio } from '../public/fn'

import { setUShow } from '../store/users/action'

class User extends PureComponent {

    setShow = (index) => {
        let show = [...this.props.show];

        show[index] = !show[index];

        this.props.dispatch(setUShow(show));
    }

    render() {
        const { users, show } = this.props;

        const UserList = users.map((item, index) => {

            const isend = (index == users.length - 1);

            const userlen = item.users.length - 1;

            let ouser = item.users.map((uitem, uindex) => (
                < UserItem key={uindex} {...uitem} end={(uindex == userlen && !isend)} />
            ));

            return (
                <View key={index} style={{
                    borderBottomWidth: (isend && !show[index]) ? 1 : 0,
                    borderColor: borderColor
                }}>
                    <Classify {...item.class} show={show[index]} onshow={() => { this.setShow(index) }} />
                    <View style={{ display: show[index] ? 'flex' : 'none' }}>
                        {ouser}
                    </View>
                </View>
            )
        });
        return (
            <Box>
                <Background active="user" />
                <Header title="好友列表" />
                <ScrollBox>
                    <SearchBtn />
                    {UserList}
                    <View style={{ height: ratio(200) }}></View>
                </ScrollBox>
            </Box >
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    users: state.u.users,
    show: state.u.show
}))(User);