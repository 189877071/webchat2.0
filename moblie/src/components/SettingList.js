import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image, TouchableNativeFeedback, Switch } from 'react-native'

import Icons from '../Icons'

import { BoxShadow } from 'react-native-shadow'

import Redio from './Redio'

import { ratio } from '../public/fn'

import { listBg } from '../public/config'

import { FeedBackBtn } from './Button'

const [w380, w30, w100, w162, w40, w46, color, w42, w34, bordercolor, w4, w38, w330] = [
    ratio(380),
    ratio(30),
    ratio(100),
    ratio(162),
    ratio(50),
    ratio(46),
    '#565656',
    ratio(42),
    ratio(34),
    '#dddee0',
    ratio(4),
    ratio(38),
    ratio(330),
]

const styles = StyleSheet.create({
    img: {
        width: w380,
        height: w380,
        borderRadius: w380
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: w40,
        color
    },
    itembox: {
        borderTopWidth: 1,
        borderColor: bordercolor
    },
    item: {
        height: w162,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: bordercolor,
        backgroundColor: listBg,
        paddingRight: w46,
        paddingLeft: w46,
        position: 'relative'
    },
    iteemleft: {
        flexDirection: 'row',
    },
    itemtitle: {
        color,
        fontSize: w42,
        paddingLeft: w34
    },
    itemrtext: {
        fontSize: w38,
        color: '#9e9ea0'
    },
    sex: {
        width: w330,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})


const setting = {
    width: w380,
    height: w380,
    color: '#000',
    border: w30,
    radius: w380 / 2,
    opacity: .3,
    x: 0,
    y: 0
}

export class UserPhoto extends PureComponent {
    render() {
        return (
            <View style={[styles.box, { marginTop: w100 }]}>
                <BoxShadow setting={setting}>
                    <Image
                        source={require('../public/image/user-photo.jpg')}
                        resizeMode='cover'
                        style={styles.img}
                    />
                </BoxShadow>
            </View>
        )
    }
}

export class UserName extends PureComponent {
    render() {
        return (
            <View style={[styles.box, { height: w162 }]}>
                <Text style={styles.name}>189877071</Text>
            </View>
        )
    }
}

export class SettingItems extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            audio: false,
            sex: 1
        };
    }
    audiochange = (newval) => {
        this.setState({
            audio: newval
        })
    }
    sexchange = (value) => {
        this.setState({
            sex: value
        })
    }
    render() {
        return (
            <View style={styles.itembox}>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-shengyin' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>声音</Text>
                    </View>
                    <Switch
                        value={this.state.audio}
                        onValueChange={this.audiochange}
                        thumbTintColor='#1bbc9b'
                        onTintColor='#627385'
                        tintColor='#c4c8d4'
                    />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-xingming' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>昵称</Text>
                    </View>
                    <Text style={styles.itemrtext}>忘语</Text>
                    <FeedBackBtn />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-youxiang' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>邮箱</Text>
                    </View>
                    <Text style={styles.itemrtext}>189877071@qq.com</Text>
                    <FeedBackBtn />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-password' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>密码</Text>
                    </View>
                    <Text style={styles.itemrtext}>********</Text>
                    <FeedBackBtn />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-nianling' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>年龄</Text>
                    </View>
                    <Text style={styles.itemrtext}>27岁</Text>
                    <FeedBackBtn />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-xingbie' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>性别</Text>
                    </View>
                    <View style={styles.sex}>
                        <Redio value={1} active={this.state.sex} onChange={this.sexchange}>男</Redio>
                        <Redio value={2} active={this.state.sex} onChange={this.sexchange}>女</Redio>
                    </View>
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-jianjie' size={w46} style={{
                            transform: [{
                                translateY: w4
                            }]
                        }} color={color} />
                        <Text style={styles.itemtitle}>简介</Text>
                    </View>
                    <Text style={styles.itemrtext}>来点什么，巴拉巴拉一下吧…</Text>
                    <FeedBackBtn />
                </View>
            </View>
        )
    }
}