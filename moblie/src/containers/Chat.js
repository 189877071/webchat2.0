import React, { Component } from 'react';

import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, TextInput } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { ChatHeader } from '../components/Header'

import { ChatTab, TextMessage, PhizIcon } from '../components/Chat'

import { getuser, ofetch, ratio, uuid, editorTranition } from '../public/fn'

import { setUActiveid, setUAddChat, setUDeletChat } from '../store/users/action'

import { hostname, showtimenum, pleft, pright } from '../public/config'

import { EditorBtn } from '../components/Button'

const styles = StyleSheet.create({
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
    }
})

class Chat extends Component {
    constructor(props) {
        super(props);

        const user = getuser(this.props.navigation.getParam('id', 0), this.props.users);

        if (!user) {
            this.backup();
        }

        this.state = {
            defvalue: '',
            showdelet: [],
            user,
            mlminh: 0,
            showTab: '',
            deepbut: false,
            isdelet: false,
        }

        this.value = '';

        this.myRef = React.createRef();

        this.inputRef = React.createRef();

        const data = this.props.chatting[user.id] || [];

        this.messageLen = this.getMessage().length;
    }
    // 获取消息记录
    getMessage = () => {
        return this.props.chatting[this.state.user.id] || [];
    }

    componentDidMount() {
        setTimeout(() => {
            this.myRef.current.scrollToEnd({ animated: true });
        }, 0)
    }

    componentDidUpdate() {
        let messagelen = this.getMessage().length;

        if (this.messageLen !== messagelen) {
            this.messageLen = messagelen;
            if (!this.state.isdelet) {
                setTimeout(() => {
                    this.myRef.current.scrollToEnd({ animated: true });
                }, 0);
            }
            else {
                this.setState({ isdelet: false });
            }
        }


    }
    // 返回
    backup = () => {
        this.props.dispatch(setUActiveid(null));
        this.props.navigation.goBack();
    }
    // 更新输入框内容
    setvalue = value => {
        if (value && !this.state.deepbut) {
            this.setState({ deepbut: true });
        }
        else if (!value && this.state.deepbut) {
            this.setState({ deepbut: false });
        }
        this.value = value;
    }
    // 发送按钮发送消息
    send = async () => {
        // 发送消息
        if (!this.value) return;

        const oid = uuid();

        const value = editorTranition(this.value);

        const data = {
            heid: this.props.navigation.getParam('id'),
            otype: 'message',
            content: this.value,
            oid
        };

        let odata = {
            time: Date.now(),
            id: oid,
            sender: 'mi',
            otype: data.otype,
            content: value,
            userid: data.heid,
            state: 'transmit'
        };

        this.setState({ defvalue: this.value, deepbut: false });

        setTimeout(() => {
            this.value = '';
            this.updatevalue();
        }, 0);

        this.props.dispatch(setUAddChat(odata));

        const { success } = await ofetch('/message', data);

        odata.alter = true;

        odata.state = success ? 'read' : 'error';

        this.props.dispatch(setUAddChat(odata));
    }
    // 跟新TextInput组件的 value值
    updatevalue = () => this.setState({ defvalue: this.value });
    // 显示 消息列表组件的删除按钮 与隐藏删除按钮
    setShowDelet = (id) => {

        if (!id) {
            this.setState({ showdelet: [], showTab: '', isdelet: false });
            return;
        }

        let showdelet = [...this.state.showdelet];

        if (showdelet.indexOf(id) === -1) {
            showdelet.push(id);
            this.setState({ showdelet, isdelet: true });
        }
    }
    // 删除消息
    deletMessage = (id) => {
        if (!id) return;
        this.props.dispatch(setUDeletChat(id));
    }
    // 当消息列表 ScrollView 高度跟新时触发事件 用来设置消息box的最小高度
    layout = ({ nativeEvent }) => {
        this.setState({ mlminh: nativeEvent.layout.height });
    }
    // 显示指定的 tab选项 
    showTab = (tab) => {
        this.inputRef.current.blur();
        setTimeout(() => {
            this.setState({ showTab: (this.state.showTab === tab) ? '' : tab });
        }, 0);
    }
    // 当输入框获取焦点时隐藏 tab
    focus = () => {
        this.setState({ showTab: '' });
    }
    // 输入框组件
    EditorInputCom = () => (
        <View style={styles.editorbox}>
            <TextInput
                multiline={true}
                underlineColorAndroid="transparent"
                style={styles.editor}
                onChangeText={this.setvalue}
                defaultValue={this.state.defvalue}
                ref={this.inputRef}
                onFocus={this.focus}
            />
            <EditorBtn submit={this.send} deep={this.state.deepbut} />
        </View>
    );
    // 添加 图标
    addIcon = (icon) => {
        this.value += icon;
        this.updatevalue();
        if (!this.state.deepbut) {
            this.setState({ deepbut: true });
        }
    }
    // 转跳到用户信息页
    toInfor = () => {
        this.props.navigation.navigate('infor', { user: this.state.user });
    }
    render() {
        const user = this.state.user;
        const messageArr = this.getMessage();
        const Message = messageArr.map((item, index) => {
            const [userphoto, showtime] = [
                hostname + (item.sender === 'mi' ? this.props.headphoto : user.headphoto),
                (messageArr[index - 1] && item.time - messageArr[index - 1].time < showtimenum) ? false : true
            ];

            return (
                <TextMessage
                    {...item}
                    userphoto={hostname + this.props.headphoto}
                    key={item.id}
                    showtime={showtime}
                    showDelet={this.state.showdelet.indexOf(item.id) !== -1}
                    setDeletId={this.setShowDelet}
                    delet={this.deletMessage}
                />
            );
        });

        return (
            <Box>
                <Background active="chat" />
                <ChatHeader
                    goBack={this.backup}
                    name={user.name || user.username}
                    state={user.isonline}
                    infor={this.toInfor}
                />

                <ScrollView style={{ flex: 1 }} ref={this.myRef} onLayout={this.layout} >
                    <TouchableWithoutFeedback onPress={() => this.setShowDelet(false)}>
                        <View style={{ minHeight: this.state.mlminh }}>
                            <View style={{ height: ratio(70) }} />
                            {Message}
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>

                {this.EditorInputCom()}

                <ChatTab toggle={this.showTab} active={this.state.showTab} />

                {this.state.showTab === 'phiza' && <PhizIcon addIcon={this.addIcon} />}
            </Box>
        )
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    users: state.u.users,
    headphoto: state.a.headphoto,
    chatting: state.u.chatting
}))(Chat);