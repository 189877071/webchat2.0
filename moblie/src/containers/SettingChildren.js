import React, { Component, PureComponent } from 'react';

import { View, ToastAndroid } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { InlineHeader } from '../components/Header'

import { AlterName, AlterEmail, AlterPassword, AlterSynopsis } from '../components/Alter'

import { setAName, setAEmail, setSynopsis } from '../store/active/action'

import { ofetch, hint } from '../public/fn'

const [emailRex] = [
    /^([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})$/
];

class SettingChildren extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            maneerr: '',
            email: this.props.email,
            emailerr: '',
            verify: '',
            verifyerr: '',
            verifybtnval: '获取验证码',
            password: '',
            passworderr: '',
            repass: '',
            repasserr: '',
            synopsis: this.props.synopsis
        };
        this.isCountDown = false;
        this.isload = false;
        this.countDownNum = 0;
        this.time = null;
    }
    // 返回
    backup = () => {
        clearInterval(this.time);
        this.props.navigation.goBack();
    }
    // 设置 昵称
    setname = async () => {
        const name = this.state.name;

        if (this.isload) {
            hint('正在提交请求请稍后……');
            return;
        }

        if (!name) {
            this.setState({ nameerr: '昵称不能为空' });
            return;
        }

        if (name.length > 15) {
            this.setState({ nameerr: '昵称长度不能超过15位字符' });
            return;
        }

        this.isload = true;

        const { success } = await ofetch('/setting?optation=name', { name });

        this.isload = false;

        if (!success) {
            hint('昵称修改失败');
            return;
        }

        hint('修改成功');

        this.props.dispatch(setAName(name));

        this.backup();
    }
    // 修改邮箱
    setEmail = async () => {
        if (this.isload) {
            hint('正在提交请求请稍后……');
            return;
        }

        const { verify } = this.state;

        if (!verify) {
            this.setState({ verifyerr: '请输入验证码' });
            return;
        }
        this.isload = true;
        const { success, error } = await ofetch('/setting?optation=email', { verify });
        this.isload = false;
        if (!success) {
            if (error == 1) {
                this.setState({ verifyerr: '验证码不正确' });
            }
            else {
                hint('邮箱修改失败');
            }
            return;
        }

        hint('修改成功');

        this.props.dispatch(setAEmail(this.state.email));

        this.backup();
    }
    // 修改密码
    setPass = async () => {
        if (this.isload) {
            hint('正在提交请求请稍后……')
            return;
        }

        const { password, repass } = this.state;

        if (!password) {
            this.setState({ passworderr: '密码不能为空' });
            return;
        }

        if (!repass) {
            this.setState({ repasserr: '请确认密码' });
            return;
        }

        if (password !== repass) {
            this.setState({ repasserr: '两次密码输入不正确' });
            return;
        }
        this.isload = true;
        const { success } = await ofetch('/setting?optation=pass', { password });
        this.isload = false;
        if (!success) {
            hint('修改失败');
            return;
        }

        hint('修改成功');

        this.backup();
    }
    // 修改简介
    setSynopsis = async () => {
        if (this.isload) {
            hint('正在提交请求请稍后……')
            return;
        }

        const { synopsis } = this.state;

        if(!synopsis) {
            hint('请先输入内容……');
            return;
        }

        this.isload = true;

        const { success } = await ofetch('/setting?optation=synopsis', { synopsis });

        this.isload = false;

        if(!success) {
            hint('修改失败');
            return;
        }

        this.props.dispatch(setSynopsis(synopsis));

        this.backup();
    }
    // 提交
    submit = (value) => {
        const optation = this.props.navigation.getParam('optation', 'name');
        switch (optation) {
            case 'name':
                this.setname();
                break;
            case 'email':
                this.setEmail();
                break;
            case 'pass':
                this.setPass();
                break;
            case 'synopsis':
                this.setSynopsis();
                break;
        }
    }
    // 倒计时
    countdown = () => {
        clearInterval(this.time);
        let num = 120;
        this.countDownNum = num;
        this.time = setInterval(() => {
            num--;
            this.countDownNum = num;
            let str = `倒计时 ${num > 9 ? num : '0' + num} 秒`;
            if (num <= 0) {
                num = 0;
                clearInterval(this.time);
                str = '获取验证码';
            }
            this.setState({ verifybtnval: str });
        }, 1000);
    }
    // 获取验证码
    getverify = async () => {
        // 验证邮箱是否合法
        if (this.countDownNum > 0) {
            return;
        }

        if (this.isload) {
            hint('正在提交请求请稍后……');
            return;
        }

        const email = this.state.email;

        if (!email) {
            this.setState({ emailerr: '邮箱不能为空' });
            return;
        }

        if (!emailRex.test(email)) {
            this.setState({ emailerr: '邮箱格式不正确' });
            return;
        }

        this.isload = true;

        const { success, error } = await ofetch('/setting?optation=emailverify', { email });

        this.isload = false;

        if (!success) {
            if (error == 1) {
                this.setState({ emailerr: '邮箱已存在' });
            }
            else {
                hint('验证码发送失败');
            }
            return;
        }

        hint('验证码发送成功');
        // 倒计时
        this.countdown();
    }
    render() {
        const optation = this.props.navigation.getParam('optation', 'name');
        let title = '';
        let Main = null;
        switch (optation) {
            case 'name':
                title = '修改昵称';
                Main = (
                    <AlterName
                        name={this.state.name}
                        error={this.state.nameerr}
                        change={value => this.setState({ name: value, nameerr: '' })}
                    />
                );
                break;
            case 'email':
                title = '修改邮箱';
                Main = (
                    <AlterEmail
                        value={this.state.email}
                        error={this.state.emailerr}
                        change={value => this.setState({ email: value, emailerr: '' })}
                        verify={this.state.verify}
                        verifychange={value => this.setState({ verify: value, verifyerr: '' })}
                        verifyerror={this.state.verifyerr}
                        getverify={this.getverify}
                        verifbuttonvalue={this.state.verifybtnval}
                        submit={this.submit}
                    />
                );
                break;
            case 'pass':
                title = '修改密码';
                Main = (
                    <AlterPassword
                        passvalue={this.state.password}
                        passerr={this.state.passworderr}
                        passchange={
                            (value) => this.setState({ password: value, passworderr: '' })
                        }
                        revalue={this.state.repass}
                        reerr={this.state.repasserr}
                        rechange={
                            (value) => this.setState({ repass: value, repasserr: '' })
                        }
                        submit={this.submit}
                    />
                );
                break;
            case 'synopsis':
                title = '修改介绍';
                Main = (
                    <AlterSynopsis
                        value={this.state.synopsis}
                        change={value => this.setState({ synopsis: value })}
                    />
                );
                break;
        }
        return (
            <Box>
                <Background active="settingchildren" />
                <InlineHeader title={title} backup={this.backup} submit={this.submit} />
                {Main}
            </Box>
        )
    }
}

export default connect((state, props) => ({
    // 
    navigation: props.navigation,
    // 
    id: state.a.id,
    // 用户名
    username: state.a.username,
    // 头像
    headphoto: state.a.headphoto,
    // 邮箱
    email: state.a.email,
    // 性别
    sex: state.a.sex,
    // 年龄
    age: state.a.age,
    // 昵称
    name: state.a.name,
    // 简介
    synopsis: state.a.synopsis,
}))(SettingChildren);