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
        const { name, change, error } = this.props;
        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    placeholder='输入您的昵称'
                    value={name}
                    change={change}
                    error={error}
                    maxlength={15}
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
        const {
            value, error, change, verify, verifychange, verifyerror, getverify, verifbuttonvalue
            , submit
        } = this.props;

        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    placeholder='输入新的邮箱地址'
                    value={value}
                    error={error}
                    change={change}
                />
                <View style={styles.verify}>
                    <VerifyInput
                        placeholder='输入验证码'
                        value={verify}
                        change={verifychange}
                        error={verifyerror}
                        maxlength={6}
                    />
                    <View style={{ justifyContent: 'flex-end' }}>
                        <SmallButton
                            title={verifbuttonvalue}
                            width={ratio(325)}
                            height={ratio(85)}
                            href={getverify}
                        />
                    </View>
                </View>
                <BigButton title='保存' onPress={submit} />
            </View>
        )
    }
}

export class AlterPassword extends PureComponent {
    render() {
        const { passvalue, passchange, passerr, revalue, rechange, reerr, submit } = this.props;
        return (
            <View style={styles.box}>
                <BigInput
                    borderColor='#07bb98'
                    password={true}
                    placeholder='输入新密码'
                    maxlength={20}
                    value={passvalue}
                    error={passerr}
                    change={passchange}
                />
                <BigInput
                    borderColor='#07bb98'
                    password={true}
                    placeholder='确认密码'
                    maxlength={20}
                    value={revalue}
                    error={reerr}
                    change={rechange}
                />
                <View style={{ marginTop: ratio(20) }}>
                    <BigButton onPress={submit} title='保存' />
                </View>
            </View>
        )
    }
}

export class AlterSynopsis extends PureComponent {
    render() {
        const { value, change } = this.props;
        return (
            <View>
                <Textarea
                    placeholder='填写您的个性签名'
                    value={value}
                    change={change}
                    maxlength={50}
                />
                <Text style={styles.textareabottom}>个人介绍 更好的展示自己！</Text>
            </View>
        )
    }
}