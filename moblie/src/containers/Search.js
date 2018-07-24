import React, { Component } from 'react';

import { View, Text, FlatList, Keyboard } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { SearchHeaser } from '../components/Header'

import { searchUsers, ratio } from '../public/fn'

import { UserItem } from '../components/NewUserList'

import { setUActiveid } from '../store/users/action'

class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defvalue: '',
            search: ''
        };
        this.value = '';
        this.time = null;
        this.keyboard = false;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.keyboard = true);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.keyboard = false);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    change = (value) => {
        this.value = value;
        clearTimeout(this.time);
        this.time = setTimeout(() => {
            this.setState({ search: this.value });
        }, 100);
    }
    backup = () => {
        if (!this.keyboard) {
            this.props.navigation.goBack();
        }
        else {
            this.blur && this.blur();
        }
    }
    blurCallback = (fn) => {
        this.blur = fn;
    }
    renderItem = ({ item }) => (
        <UserItem
            {...item}
            href={this.tochat}
            end={false}
            show={true}
        />
    )
    tochat = (data) => {
        setTimeout(() => {
            this.props.dispatch(setUActiveid(data.id));
            this.props.navigation.navigate('chat', data);
        }, 0);
    }
    render() {

        const users = searchUsers(this.state.search, this.props.users);

        return (
            <Box>
                <Background active="search" />
                <SearchHeaser
                    value={this.state.defvalue}
                    change={this.change}
                    href={this.backup}
                    blurCallback={this.blurCallback}
                />
                <FlatList
                    data={users}
                    renderItem={this.renderItem}
                />
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    users: state.u.users,
}))(Container);