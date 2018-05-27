import React, { PureComponent } from 'react'

import { View, TextInput, StyleSheet, Button, Text } from 'react-native'

import { inputBorderColor, btnColor, pleft, pright } from '../public/config'

import { ratio, windowW } from '../public/fn'

import { BigButton } from './Button'

import { LoginFormBottom } from './Bottom'

const style = StyleSheet.create({
    box: {
        justifyContent: 'center',
    },
    inputbox: {
        flexDirection: 'row',
        marginLeft: pleft,
        marginRight: pright,
        borderBottomWidth: 1,
        height: ratio(116),
        marginTop: ratio(50),
        paddingLeft: ratio(20),
    },
    input: {
        width: windowW - pleft - pright - ratio(20),
        height: ratio(116),
    },
    verifybox: {
        flexDirection: 'row',
        width: ratio(600),
        marginTop: ratio(20),
        paddingLeft: ratio(20),
        borderBottomWidth: 1,
    },
    verifyinput: {
        width: ratio(580),
        height: ratio(116),
    },
    textarea: {
        marginTop: ratio(60),
        marginLeft: pleft,
        marginRight: pright,
        flexDirection: 'row',
        borderColor: '#07bb98',
        height: ratio(210),
        borderRadius: ratio(10),
        backgroundColor: 'rgba(255,255,255,.7)',
        position: 'relative',
        paddingLeft: ratio(30),
        paddingRight: ratio(30),
        borderWidth: 1
    },
    textareainput: {
        width: windowW - pleft - pright - ratio(60) - 2
    },
    bottomnum: {
        position: 'absolute',
        right: ratio(30),
        bottom: ratio(25)
    },
    bottomnumt: {
        fontSize: ratio(30),
        color: '#646464'
    }
});

export class BigInput extends PureComponent {
    render() {
        const { borderColor, placeholder, password } = this.props;

        const ostyle = { borderColor: inputBorderColor };

        if (borderColor) {
            ostyle.borderColor = borderColor;
        }

        return (
            <View style={[style.inputbox, ostyle]}>
                <TextInput
                    style={style.input}
                    placeholder={placeholder}
                    placeholderTextColor="#afa6a7"
                    underlineColorAndroid="transparent"
                    secureTextEntry={password ? true : false}
                />
            </View>
        )
    }
}

export class LoginForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkbox: false
        }
    }
    checkBoxChange = () => {
        this.setState({ checkbox: this.state.checkbox ? false : true });
    }
    render() {
        return (
            <View style={style.box}>
                <BigInput
                    placeholder="用户名/邮箱"
                />
                <BigInput
                    placeholder="密码"
                    password
                />
                <BigButton
                    title="登 录"
                />
                <LoginFormBottom
                    value={this.state.checkbox}
                    valueChange={this.checkBoxChange}
                />
            </View>
        )
    }
}

export class VerifyInput extends PureComponent {
    render() {
        const { borderColor, placeholder } = this.props;

        const ostyle = { borderColor: '#07bb98' };

        if (borderColor) {
            ostyle.borderColor = borderColor;
        }

        return (
            <View style={[style.verifybox, ostyle]}>
                <TextInput
                    style={style.verifyinput}
                    placeholder={placeholder}
                    placeholderTextColor="#afa6a7"
                    underlineColorAndroid="transparent"
                />
            </View>
        )
    }
}

export class Textarea extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            val: ''
        };
    }
    render() {
        const { placeholder } = this.props;
        return (
            <View style={style.textarea}>
                <TextInput
                    multiline={true}
                    placeholder={placeholder}
                    returnKeyLabel='done'
                    placeholderTextColor='#aba7a8'
                    underlineColorAndroid="transparent"
                    style={style.textareainput}
                    onChangeText={(val) => this.setState({ val })}
                >
                    <Text style={{ lineHeight: ratio(80) }}>{this.state.val}</Text>
                </TextInput>
                <View style={style.bottomnum}>
                    <Text style={style.bottomnumt}>0 / 50</Text>
                </View>
            </View>
        )
    }
}