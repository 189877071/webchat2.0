import React, { Component, PureComponent } from 'react';

import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

import { connect } from 'react-redux';

import { BoxShadow } from 'react-native-shadow'

import Box from '../components/Box'

import { Background } from '../components/Image'

import { InlineHeader } from '../components/Header'

import { ratio, windowH, getAge, getClass } from '../public/fn'

import { hostname } from '../public/config'

const styles = StyleSheet.create({
    box: {
        alignItems: 'center',
        transform: [{ translateY: -ratio(475 / 2) }],
        paddingTop: ratio(20),
        paddingBottom: ratio(20),
    },
    scroll: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,.6)',
    },
    clbox: {
        alignItems: 'center',
        height: ratio(475),
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
    },
    headphoto: {
        width: ratio(435),
        height: ratio(435),
        borderRadius: ratio(435),
    },
    list: {
        borderTopWidth: 1,
        borderColor: '#d1d1d3',
        flexDirection: 'row'
    },
    listText: {
        lineHeight: ratio(60), // 164 104 52
        fontSize: ratio(40),
        color: '#65778f'
    },
    listl: {
        width: ratio(190),
        alignItems: 'center',
        paddingTop: ratio(52),
        paddingBottom: ratio(52)
    },
    listr: {
        flex: 1,
        paddingTop: ratio(52),
        paddingBottom: ratio(52)
    }
});

const settingbox = {
    width: ratio(975),
    height: windowH - ratio(275 + 147 + 100),
    color: '#b3b3b3',
    opacity: .5,
    radius: 1,
    border: ratio(20),
    x: 0,
    y: 0
}

const settingimg = {
    width: ratio(435),
    height: ratio(435),
    color: '#b3b3b3',
    opacity: .5,
    radius: ratio(435 / 2),
    border: ratio(20),
    x: 0,
    y: 0
}

class List extends PureComponent {
    render() {
        const { nob, name, value } = this.props;
        return (
            <View style={[styles.list, { borderTopWidth: nob ? 0 : 1 }]}>
                <View style={styles.listl}>
                    <Text style={[styles.listText, { fontWeight: 'bold' }]}>{name}：</Text>
                </View>
                <View style={styles.listr}>
                    <Text style={styles.listText}>{value || '未填写'}</Text>
                </View>
            </View>
        )
    }
}

class Infor extends Component {
    // 返回
    backup = () => {
        this.props.navigation.goBack();
    }

    Content = () => {
        const user = this.props.navigation.getParam('user', {});
        const { headphoto, username, name, sex, age, email, synopsis } = user;

        return (
            <View>
                <View style={styles.clbox}>
                    <BoxShadow setting={settingimg}>
                        <Image
                            source={{ uri: hostname + headphoto }}
                            style={styles.headphoto}
                        />
                    </BoxShadow>
                </View>
                <View style={styles.box}>
                    <BoxShadow setting={settingbox}>
                        <ScrollView style={styles.scroll}>
                            <View style={{ height: ratio(180) }} />
                            <List nob={true} name='账号' value={username} />
                            <List name='昵称' value={name} />
                            <List name='性别' value={sex == 1 ? '男' : '女'} />
                            <List name='年龄' value={getAge(age) + '岁'} />
                            <List name='邮箱' value={email} />
                            <List name='分组' value={getClass(user.class, this.props.classify)} />
                            <List name='介绍' value={synopsis} />
                        </ScrollView>
                    </BoxShadow>
                </View>
            </View >
        )
    }
    render() {
        return (
            <Box>
                <Background active="infor" />
                <InlineHeader title='用户详情' hideBtn={true} backup={this.backup} />
                {this.Content()}
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    classify: state.u.classify
}))(Infor);