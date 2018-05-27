import React, { PureComponent, Component } from 'react'

import { connect } from 'react-redux'

import Box, { ScrollBox } from '../components/Box'

import { Background } from '../components/Image'

import { Header } from '../components/Header'

import SearchBtn from '../components/SearchBtn'

import { UserItem } from '../components/UserList'


class User extends PureComponent {
    render() {
        return (
            <Box>
                <Background active="user" />
                <Header title="好友列表" />
                <ScrollBox>
                    <SearchBtn />
                    <UserItem />
                </ScrollBox>
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation
}))(User);