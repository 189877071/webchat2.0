import React, { Component } from 'react';

import { View, ScrollView, TouchableWithoutFeedback, StyleSheet, TextInput, Modal } from 'react-native';

import ImagePicker from 'react-native-image-picker'


import { connect } from 'react-redux';

import Sound from 'react-native-sound'

import Box from '../components/Box'

import { Background } from '../components/Image'

import { ChatHeader } from '../components/Header'

import { ChatTab, TextMessage, PhizIcon, Voicebox } from '../components/Chat'

import { ShowImageZoom } from '../components/NoticeList'

import { getuser, ofetch, ratio, uuid, editorTranition, hint, uploadImage, uploadvoice } from '../public/fn'

import { setUActiveid, setUAddChat, setUDeletChat, setUunrad, setUrefresh, setUVoiceRead } from '../store/users/action'

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
            id: this.props.navigation.getParam('id'),
            playid: null,
            uri: '',
            zoomimgw: 0,
            zoomimgh: 0
        }

        this.value = '';

        this.myRef = React.createRef();

        this.inputRef = React.createRef();

        const data = this.props.chatting[user.id] || [];

        this.messageLen = this.getMessage().length;

        this.whoosh = null;
    }

    // 获取消息记录
    getMessage = () => {
        return this.props.chatting[this.state.user.id] || [];
    }

    componentDidMount() {
        this.props.dispatch(setUActiveid(this.state.id));
        this.props.dispatch(setUunrad());
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

    componentWillUnmount() {
        this.stopAudio();
    }

    // 停止声音播放
    stopAudio = () => {
        if (this.whoosh && this.state.playid) {
            this.whoosh.stop(() => this.whoosh.release());
            this.setState({ playid: null });
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
    send = () => {
        // 发送消息
        if (!this.value) return;

        const [oid, content, otype, id] = [
            uuid(),
            editorTranition(this.value),
            'message',
            this.state.id
        ]

        this.osend(
            { heid: id, otype, content: this.value, oid },
            { time: Date.now(), id: oid, sender: 'mi', otype, content, userid: id, state: 'transmit' }
        );

        this.setState({ defvalue: this.value, deepbut: false });

        setTimeout(() => {
            this.value = '';
            this.updatevalue();
        }, 0);
    }

    // 提交上传
    osend = async (data, odata) => {

        this.props.dispatch(setUAddChat(odata));

        const { success } = await ofetch('/message', data);

        odata.alter = true;

        odata.state = success ? 'read' : 'error';

        this.props.dispatch(setUAddChat(odata));
    }

    // 发送图片
    sendimg = async (uri, width, height) => {
        if (!uri || !width || !height) {
            return;
        }

        const [oid, content, otype, id] = [
            uuid(),
            { uri, width, height },
            'image',
            this.state.id
        ];

        this.osend(
            { heid: id, otype, content, oid },
            { time: Date.now(), id: oid, sender: 'mi', otype, content, userid: id, state: 'transmit' }
        );
    }

    // 发送语音
    sendvoice = async (uri, time) => {
        if (!uri) {
            return;
        }

        // 上传语音
        const { success, name } = await uploadvoice(uri);

        if (!success) {
            hint('语音文件上传失败');
            return;
        }

        const [oid, content, otype, id] = [
            uuid(),
            { uri: name, time },
            'voice',
            this.state.id
        ];

        this.osend(
            { heid: id, otype, content, oid },
            { time: Date.now(), id: oid, sender: 'mi', otype, content, userid: id, state: 'transmit' },
            true
        );
    }

    // 震动
    sendshock = async () => {
        const [oid, content, otype, id] = [
            uuid(),
            '',
            'shock',
            this.state.id
        ];

        this.osend(
            { heid: id, otype, content, oid },
            { time: Date.now(), id: oid, sender: 'mi', otype, content, userid: id, state: 'transmit' }
        );
    }

    // 跟新聊天记录
    refreshMessage = async () => {
        const { success, message } = await ofetch('/message?optation=refresh', { id: this.state.id });

        if (!success) {
            hint('获取数据失败');
            return;
        }

        this.props.dispatch(setUrefresh(message));
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
    EditorInputCom = () => {
        return (
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
        )
    }

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
        this.stopAudio();
    }

    // 打开图片
    openimg = () => {

        const photoOptions = {
            title: '请选择',
            quality: 0.8,
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            allowsEditing: true,
            noData: false,
            maxWidth: 700,
            maxHeight: 1200,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(photoOptions, async (response) => {

            if (response.didCancel || response.error || response.customButton) {
                hint('操作失败……');
                return;
            }

            hint('正在上传图片……');

            const { width, height, uri } = response;

            const { success, name } = await uploadImage(uri, true);

            if (!success) {
                hint('图片上传失败');
                return;
            }

            // 发送图片地址
            await this.sendimg(name, ratio(Math.floor(width)), ratio(Math.floor(height)));
        });

    }

    // 播放语音
    playVoice = (uri, playid, onoff) => {
        if (this.whoosh && playid === this.state.playid) {
            this.whoosh.stop(() => this.whoosh.release());
            this.setState({ playid: null });
            return;
        }

        if (onoff) {
            this.props.dispatch(setUVoiceRead(playid));
        }

        if (this.state.playid) {
            this.whoosh.stop(() => this.whoosh.release());
        }

        this.whoosh = new Sound(hostname + uri, '', (error) => {
            if (error) {
                hint('音频文件加载失败');
                return;
            }
            this.setState({ playid });
            this.whoosh.play(() => {
                this.whoosh.release();
                this.setState({ playid: null });
            });
        });
    }

    // 显示大图
    seturi = (uri, zoomimgw, zoomimgh) => {
        this.setState({ uri, zoomimgw, zoomimgh });
    }

    // 视频通话
    callvoide = () => {
        if (!this.state.user.isonline) {
            hint('对方没有在线，无法进行视频通话');
            return;
        }
        this.props.navigation.navigate('call', { id: this.state.id });
        this.stopAudio();
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
                    play={this.playVoice}
                    playid={this.state.playid}
                    seturi={this.seturi}
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

                <ChatTab
                    toggle={this.showTab}
                    active={this.state.showTab}
                    openimg={this.openimg}
                    shock={this.sendshock}
                    refresh={this.refreshMessage}
                    callvideo={this.callvoide}
                />

                {this.state.showTab === 'phiza' && <PhizIcon addIcon={this.addIcon} />}
                {this.state.showTab === 'yuyin' && <Voicebox send={this.sendvoice} />}
                <ShowImageZoom
                    uri={this.state.uri}
                    close={() => this.seturi('', 0, 0)}
                    width={this.state.zoomimgw}
                    height={this.state.zoomimgh}
                />
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