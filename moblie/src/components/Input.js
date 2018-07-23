import React, { PureComponent, Component } from 'react'

import { View, TextInput, StyleSheet, Button, Text, AsyncStorage } from 'react-native'

import { inputBorderColor, btnColor, pleft, pright } from '../public/config'

import { ratio, windowW, ofetch, uuid, hint, uniqueId } from '../public/fn'

import { BigButton, EditorBtn } from './Button'

import Icons from '../Icons'

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
        position: 'relative'
    },
    err: {
        position: 'absolute',
        right: ratio(10),
        top: 0,
        height: ratio(116),
        justifyContent: 'center'
    },
    errText: {
        color: '#f00',
        fontSize: ratio(38)
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
        position: 'relative'
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
    },
    editor: {
        flex: 1,
        paddingTop: ratio(20),
        paddingBottom: ratio(20),
        paddingLeft: ratio(20),
        paddingRight: ratio(20),
        lineHeight: ratio(68),
        fontSize: ratio(40),
        color: '#333',
        backgroundColor: '#fff',
        borderRadius: ratio(10),
    },
    editorbox: {
        flexDirection: 'row',
        paddingLeft: pleft,
        paddingRight: pright,
        maxHeight: ratio(324)
    },
    search: {
        borderBottomWidth: 1,
        borderColor: '#07bb98',
        flexDirection: 'row',
        height: ratio(120),
        marginTop: ratio(27)
    },
    searchicon: {
        width: ratio(60),
        justifyContent: 'center',
    },
    searchinput: {
        flex: 1,
        color: '#111',
        fontSize: ratio(40),
        height: ratio(120),
        paddingBottom: 0,
        paddingTop: 0,
        lineHeight: ratio(120)
    }
});

const ErrorCom = (props) => (
    <View style={style.err}>
        <Text style={style.errText}>{props.error}</Text>
    </View>
)


export class BigInput extends PureComponent {
    errorView = () => (
        <View style={style.err}>
            <Text style={style.errText}>{this.props.error}</Text>
        </View>
    )
    render() {
        const { borderColor, placeholder, password, value, change, maxlength, error } = this.props;

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
                    value={value}
                    onChangeText={change}
                    maxLength={maxlength}
                    autoCorrect={false}
                    blurOnSubmit={true}
                />
                <ErrorCom error={error} />
            </View>
        )
    }
}

export class VerifyInput extends PureComponent {
    render() {
        const { borderColor, placeholder, value, change, error } = this.props;

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
                    value={value}
                    onChangeText={change}
                />
                <ErrorCom error={error} />
            </View>
        )
    }
}

export class Textarea extends PureComponent {
    render() {
        const { placeholder, value, change, maxlength } = this.props;
        return (
            <View style={style.textarea}>
                <TextInput
                    multiline={true}
                    placeholder={placeholder}
                    placeholderTextColor='#aba7a8'
                    underlineColorAndroid="transparent"
                    style={style.textareainput}
                    onChangeText={change}
                    maxLength={maxlength}
                >
                    <Text style={{ lineHeight: ratio(80) }}>{value}</Text>
                </TextInput>
                <View style={style.bottomnum}>
                    <Text style={style.bottomnumt}>{value.length} / {maxlength}</Text>
                </View>
            </View>
        )
    }
}

export class LoginForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            autologin: false,
            username: '',
            password: '',
            usererr: '',
            passerr: ''
        }

        this.isload = false;
    }

    checkBoxChange = () => this.setState({ autologin: this.state.checkbox ? false : true });

    usernameChange = (value) => this.setState({ username: value });

    passwordChange = (value) => this.setState({ password: value });

    submit = async () => {
        const { username, password, autologin } = this.state;

        const [userRex, passRex, emailRex] = [
            /^[A-Za-z0-9_]{5,20}$/,
            /^[A-Za-z0-9_]{6,20}$/,
            /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
        ];

        if (!emailRex.test(username)) {
            if (!/^.{5,20}$/.test(username)) {
                this.setState({ usererr: '用户名长度为5~20位字符' });
                return;
            }
            if (!userRex.test(username)) {
                this.setState({ usererr: '用户名只能是字母/数字/下划线' });
                return;
            }
        }
        if (!/^.{6,20}$/.test(password)) {
            this.setState({ usererr: '密码长度为6~20位字符' });
            return;
        }
        if (!passRex.test(password)) {
            this.setState({ passerr: '密码只能是字母/数字/下划线' });
            return;
        }

        let autokey = '';

        // 如果自动登录为true要生成一个唯一的key值并保存在本地
        if (autologin) {
            autokey = uuid();
            await AsyncStorage.setItem('autokey', autokey);
        }
        else {
            await AsyncStorage.removeItem('autokey');
        }

        if (this.isload) {
            hint('正在发送请求……');
            return;
        }

        this.isload = true;

        const { success, data, activeuser, error, unreadMessage, notice } = await ofetch('/login', { username, password, autokey, ...this.props.socketInfor, uniqueId });

        this.isload = false;

        if (!success) {
            this.setState({ passerr: '密码输入不正确！' });
            return;
        }

        notice.read = activeuser.readnotice;

        this.props.callback({ data, activeuser, unreadMessage, notice });
    }

    // 测试登录
    testSubmit = async () => {

        let { success, data, activeuser, error, unreadMessage, notice, rd } = await ofetch('/login?optation=test', { ...this.props.socketInfor, uniqueId });

        if (rd) {
            hint('正在请求中请勿着急……')
            return;
        }

        if (!success) {
            alert('登录失败！');
            return;
        }

        notice.read = activeuser.readnotice;

        this.props.callback({ data, activeuser, unreadMessage, notice });
    }

    render() {
        const { autologin, username, password, usererr, passerr } = this.state;
        return (
            <View style={style.box}>
                <BigInput
                    placeholder="用户名/邮箱"
                    value={username}
                    change={this.usernameChange}
                    maxlength={20}
                    error={usererr}
                />
                <BigInput
                    placeholder="密码"
                    password
                    value={password}
                    change={this.passwordChange}
                    maxlength={20}
                    error={passerr}
                />
                <BigButton
                    title="登 录"
                    onPress={this.submit}
                />
                <LoginFormBottom
                    value={autologin}
                    valueChange={this.checkBoxChange}
                    submit={this.testSubmit}
                />
            </View>
        )
    }
}

export class EditorInput extends PureComponent {
    render() {
        return (
            <View style={style.editorbox}>
                <TextInput
                    multiline={true}
                    underlineColorAndroid="transparent"
                    style={style.editor}
                    onChangeText={this.props.setvalue}
                    defaultValue={this.props.value}
                >
                </TextInput>
                <EditorBtn submit={this.props.send} />
            </View>
        )
    }
}

export class SearchInput extends PureComponent {
    render() {
        const { value, change } = this.props;
        const transfrom = {
            transform: [{
                translateY: ratio(5)
            }]
        }
        return (
            <View style={style.search}>
                <View style={style.searchicon}>
                    <Icons name='icon-sousuo' style={transfrom} size={ratio(50)} color='#627385' />
                </View>
                <TextInput
                    underlineColorAndroid="transparent"
                    placeholder='账户/邮箱/昵称'
                    placeholderTextColor='#999'
                    style={style.searchinput}
                    defaultValue={value}
                    onChangeText={change}
                />
            </View>
        )
    }
}