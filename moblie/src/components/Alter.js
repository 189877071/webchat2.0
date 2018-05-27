import React, { PureComponent, Component } from 'react'

import { View, StyleSheet, Text } from 'react-native'

import { ratio, windowW } from '../public/fn'

import { pleft, pright } from '../public/config'

import { BigInput, VerifyInput, Textarea } from './Input'

import { SmallButton, BigButton } from './Button'

const styles = StyleSheet.create({
    box: {
        paddingTop: ratio(10),
    },
    nameexplan: {
        height: ratio(100),
        justifyContent: 'center'
    },
    nameexplantext: {
        fontSize: ratio(40),
        color: '#666',
        paddingLeft: pleft
    },
    verify: {
        marginLeft: pleft,
        marginRight: pright,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textareabottom: {
        marginLeft: pleft,
        fontSize: ratio(40),
        color: '#767674',
        lineHeight: ratio(112)
    }
});

export class AlterName extends PureComponent {
    render() {
        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    placeholder='输入您的昵称'
                />
                <View style={styles.nameexplan}>
                    <Text style={styles.nameexplantext}>昵称可以方便您的朋友更快速的找到您！</Text>
                </View>
            </View>
        )
    }
}

export class AlterEmail extends PureComponent {
    render() {
        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    placeholder='输入新的邮箱地址'
                />
                <View style={styles.verify}>
                    <VerifyInput placeholder='输入验证码' />
                    <View style={{
                        justifyContent: 'flex-end',
                    }}>
                        <SmallButton title='获取验证码' width={ratio(325)} height={ratio(85)} />
                    </View>

                </View>
                <BigButton title='保存' />
            </View>
        )
    }
}

export class AlterPassword extends PureComponent {
    render() {
        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    password={true}
                    placeholder='输入新密码'
                />
                <BigInput
                    borderColor='#07bb98'
                    password={true}
                    placeholder='确认密码'
                />
                <View style={{ marginTop: ratio(20) }}>
                    <BigButton title='保存' />
                </View>
            </View>
        )
    }
}

export class AlterSynopsis extends PureComponent {
    render() {
        return (
            <View>
                <Textarea placeholder='填写您的个性签名'/>
                <Text style={styles.textareabottom}>个人介绍 更好的展示自己！</Text>
            </View>
        )
    }
}