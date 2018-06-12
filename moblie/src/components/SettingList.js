import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text, Image, TouchableNativeFeedback, Switch, DatePickerAndroid, TouchableOpacity } from 'react-native'

import Icons from '../Icons'

import { BoxShadow } from 'react-native-shadow'

import Redio from './Redio'

import { ratio, getAge, hint, ofetch } from '../public/fn'

import { listBg, hostname } from '../public/config'

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
                    <TouchableOpacity onPress={this.props.open}>
                        <Image
                            source={{ uri: this.props.uri }}
                            resizeMode='cover'
                            style={styles.img}
                        />
                    </TouchableOpacity>
                </BoxShadow>
            </View>
        )
    }
}

export class UserName extends PureComponent {
    render() {
        return (
            <View style={[styles.box, { height: w162 }]}>
                <Text style={styles.name}>{this.props.name}</Text>
            </View>
        )
    }
}

export class SettingItems extends PureComponent {
    // 修改性别
    sexchange = (value) => {
        this.props.setsex(value);
    }
    // 修改年龄
    setAge = async () => {
        const { action, year, month, day } = await DatePickerAndroid.open({
            date: new Date(this.props.age),
            mode: 'default'
        });

        // alert(action); // dismissedAction dateSetAction

        if (action !== 'dateSetAction') return;

        const oDate = new Date(year, month, day);

        const { success } = await ofetch('/setting?optation=age', { age: oDate.getTime() });

        if (!success) {
            hint('修改失败');
            return;
        }

        this.props.setage(oDate.getTime());
    }
    // 修改指定资料
    toSetting = (optation) => {
        this.props.navigation.navigate('settingChildren', { optation })
    }

    render() {
        const { name, email, age, sex, synopsis, audio, setaudio } = this.props;
        return (
            <View style={styles.itembox}>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons name='icon-shengyin' size={w46} style={{ transform: [{ translateY: w4 }] }} color={color} />
                        <Text style={styles.itemtitle}>声音</Text>
                    </View>
                    <Switch
                        value={audio}
                        onValueChange={setaudio}
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
                    <Text style={styles.itemrtext}>{name || '修改昵称……'}</Text>
                    <FeedBackBtn onPress={() => this.toSetting('name')} />
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
                    <Text style={styles.itemrtext}>{email}</Text>
                    <FeedBackBtn onPress={() => this.toSetting('email')} />
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
                    <FeedBackBtn onPress={() => this.toSetting('pass')} />
                </View>

                <View style={styles.item}>
                    <View style={styles.iteemleft}>
                        <Icons
                            name='icon-nianling'
                            size={w46}
                            style={{ transform: [{ translateY: w4 }] }}
                            color={color}
                        />
                        <Text style={styles.itemtitle}>年龄</Text>
                    </View>
                    <Text style={styles.itemrtext}>{getAge(age)}岁</Text>
                    <FeedBackBtn onPress={this.setAge} />
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
                        <Redio value={1} active={sex} onChange={this.sexchange}>男</Redio>
                        <Redio value={2} active={sex} onChange={this.sexchange}>女</Redio>
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
                    <Text style={styles.itemrtext}>{synopsis || '来点什么，巴拉巴拉一下吧…'}</Text>
                    <FeedBackBtn onPress={() => this.toSetting('synopsis')} />
                </View>
            </View>
        )
    }
}