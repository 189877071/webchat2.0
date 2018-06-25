import React, { PureComponent } from 'react'

import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback, Animated, Platform, PermissionsAndroid } from 'react-native'

import { pleft, pright, hostname } from '../public/config'

import { ratio, getTextDate, getRecordTime, hint, windowW } from '../public/fn'

import Icons from '../Icons'

import dashed from '../public/image/dashed.png'

import { SmallButton, FeedBackBtn } from './Button'

import { AudioRecorder, AudioUtils } from 'react-native-audio'


const styles = StyleSheet.create({
    phizimg: {
        width: ratio(100), height: ratio(100),
    },
    bqbbox: {
        height: ratio(615), borderTopWidth: 1, borderColor: '#eaebec', backgroundColor: 'rgba(255,255,255,.8)'
    },
    stbox: {
        width: ratio(70), height: ratio(70), justifyContent: 'center', alignItems: 'center',
    },
    stimg: {
        width: ratio(60), height: ratio(60)
    },
    tabbox: {
        flexDirection: 'row', height: ratio(120), alignItems: 'center'
    },
    tabItem: {
        flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', height: ratio(120)
    },
    messagebox: {
        flexDirection: 'row', paddingRight: pright, paddingLeft: pleft, position: 'relative', paddingTop: ratio(70), paddingBottom: ratio(50)
    },
    textbox: {
        padding: ratio(20), borderRadius: ratio(20), borderWidth: 1, borderColor: '#94a3a8', flexWrap: 'wrap', flexDirection: 'row'
    },
    rtext: {
        backgroundColor: 'rgba(227, 220, 222, .8)', marginRight: ratio(5),
    },
    ltext: {
        backgroundColor: 'rgba(255, 255, 255, .8)', marginLeft: ratio(5)
    },
    text: {
        fontSize: ratio(40), lineHeight: ratio(70), color: '#111'
    },
    img: {
        height: ratio(135), width: ratio(135), borderRadius: ratio(135), borderColor: '#94a3a8', borderWidth: 1
    },
    content: {
        paddingTop: ratio(10), maxWidth: ratio(760), position: 'relative',
    },
    timebox: {
        position: 'absolute', left: 0, right: 0, top: ratio(20), alignItems: 'center',
    },
    timetext: {
        backgroundColor: '#fff', paddingLeft: ratio(10), paddingRight: ratio(10), fontSize: ratio(24), color: '#333', lineHeight: ratio(40)
    },
    zzfsbox: {
        position: 'absolute', top: ratio(20)
    },
    lzzfs: {
        left: pleft,
    },
    rzzfs: {
        right: pright,
    },
    zzfs: {
        fontSize: ratio(32), color: '#045a99', lineHeight: ratio(50),
    },
    lerr: {
        right: ratio(-80),
    },
    rerr: {
        left: -ratio(80),
    },
    error: {
        position: 'absolute', bottom: ratio(20),
    },
    deletbox: {
        position: 'absolute', top: -ratio(110), width: ratio(120), height: ratio(116),
    },
    deleteimg: {
        width: ratio(120), height: ratio(116), position: 'absolute', left: 0, top: 0,
    },
    rdelet: {
        right: ratio(20)
    },
    ldelet: {
        left: ratio(20)
    },
    delete: {
        justifyContent: 'center', alignItems: 'center', height: ratio(100)
    },
    deltext: {
        fontSize: ratio(25), color: '#fff'
    },
    end: {
        justifyContent: 'flex-end'
    },
    shockbox: {
        width: ratio(150), height: ratio(150), justifyContent: 'center', alignItems: 'center'
    },
    anzsh: {
        height: ratio(143), justifyContent: 'center', alignItems: 'center', marginTop: ratio(50), flexDirection: 'row'
    },
    dashedimg: {
        width: ratio(88), height: ratio(8)
    },
    countdown: {
        marginLeft: ratio(20), marginRight: ratio(20), fontSize: ratio(40), color: '#435971'
    },
    endbtnbox: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: ratio(300)
    },
    voicebox: {
        alignItems: 'center'
    },
    voice: {
        borderRadius: ratio(328), width: ratio(328), height: ratio(328), justifyContent: 'center', alignItems: 'center'
    },
    shockt: {
        width: ratio(120), height: ratio(120), justifyContent: 'center', alignItems: 'center'
    },
    unreadvioce: {
        width: ratio(30), height: ratio(30), backgroundColor: '#f00', borderRadius: ratio(30)
    },
    voiceimg: {
        width: ratio(51), height: ratio(50), position: 'absolute', left: 0, top: 0
    },
    voicetext: {
        fontSize: ratio(40), color: '#999', paddingRight: ratio(20), paddingLeft: ratio(20)
    },
    voicebb: {
        flexDirection: 'row', alignItems: 'center', height: ratio(70)
    },
    voiceIb: {
        width: ratio(51), height: ratio(50), position: 'relative'
    }
});

const imgs = [];

for (let i = 0; i < 64; i++) {
    imgs.push({ uri: i, key: i });
}

const getImg = (n) => {
    switch (n) {
        case 1: return require('../public/image/biaoqing/1.png');
        case 2: return require('../public/image/biaoqing/2.png');
        case 3: return require('../public/image/biaoqing/3.png');
        case 4: return require('../public/image/biaoqing/4.png');
        case 5: return require('../public/image/biaoqing/5.png');
        case 6: return require('../public/image/biaoqing/6.png');
        case 7: return require('../public/image/biaoqing/7.png');
        case 8: return require('../public/image/biaoqing/8.png');
        case 9: return require('../public/image/biaoqing/9.png');
        case 10: return require('../public/image/biaoqing/10.png');
        case 11: return require('../public/image/biaoqing/11.png');
        case 12: return require('../public/image/biaoqing/12.png');
        case 13: return require('../public/image/biaoqing/13.png');
        case 14: return require('../public/image/biaoqing/14.png');
        case 15: return require('../public/image/biaoqing/15.png');
        case 16: return require('../public/image/biaoqing/16.png');
        case 17: return require('../public/image/biaoqing/17.png');
        case 18: return require('../public/image/biaoqing/18.png');
        case 19: return require('../public/image/biaoqing/19.png');
        case 20: return require('../public/image/biaoqing/20.png');
        case 21: return require('../public/image/biaoqing/21.png');
        case 22: return require('../public/image/biaoqing/22.png');
        case 23: return require('../public/image/biaoqing/23.png');
        case 24: return require('../public/image/biaoqing/24.png');
        case 25: return require('../public/image/biaoqing/25.png');
        case 26: return require('../public/image/biaoqing/26.png');
        case 27: return require('../public/image/biaoqing/27.png');
        case 28: return require('../public/image/biaoqing/28.png');
        case 29: return require('../public/image/biaoqing/29.png');
        case 30: return require('../public/image/biaoqing/30.png');
        case 31: return require('../public/image/biaoqing/31.png');
        case 32: return require('../public/image/biaoqing/32.png');
        case 33: return require('../public/image/biaoqing/33.png');
        case 34: return require('../public/image/biaoqing/34.png');
        case 35: return require('../public/image/biaoqing/35.png');
        case 36: return require('../public/image/biaoqing/36.png');
        case 37: return require('../public/image/biaoqing/37.png');
        case 38: return require('../public/image/biaoqing/38.png');
        case 39: return require('../public/image/biaoqing/39.png');
        case 40: return require('../public/image/biaoqing/40.png');
        case 41: return require('../public/image/biaoqing/41.png');
        case 42: return require('../public/image/biaoqing/42.png');
        case 43: return require('../public/image/biaoqing/43.png');
        case 44: return require('../public/image/biaoqing/44.png');
        case 45: return require('../public/image/biaoqing/45.png');
        case 46: return require('../public/image/biaoqing/46.png');
        case 47: return require('../public/image/biaoqing/47.png');
        case 48: return require('../public/image/biaoqing/48.png');
        case 49: return require('../public/image/biaoqing/49.png');
        case 50: return require('../public/image/biaoqing/50.png');
        case 51: return require('../public/image/biaoqing/51.png');
        case 52: return require('../public/image/biaoqing/52.png');
        case 53: return require('../public/image/biaoqing/53.png');
        case 54: return require('../public/image/biaoqing/54.png');
        case 55: return require('../public/image/biaoqing/55.png');
        case 56: return require('../public/image/biaoqing/56.png');
        case 57: return require('../public/image/biaoqing/57.png');
        case 58: return require('../public/image/biaoqing/58.png');
        case 59: return require('../public/image/biaoqing/59.png');
        case 60: return require('../public/image/biaoqing/60.png');
        case 61: return require('../public/image/biaoqing/61.png');
        case 62: return require('../public/image/biaoqing/62.png');
        case 63: return require('../public/image/biaoqing/63.png');
        default: return require('../public/image/biaoqing/1.png');
    }
}

const maxImgW = windowW - ratio(380);

export class ChatTab extends PureComponent {
    setColor = (active) => (this.props.active === active ? '#25b8a6' : '#617286');

    render() {
        const { active, toggle, openimg, shock, refresh, callvideo } = this.props;

        return (
            <View style={styles.tabbox}>
                <View style={styles.tabItem}>
                    <Icons name='icon-yuyin' size={ratio(70)} color={this.setColor('yuyin')} />
                    <FeedBackBtn onPress={() => { toggle('yuyin') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-biaoqing' size={ratio(70)} color={this.setColor('phiza')} />
                    <FeedBackBtn onPress={() => { toggle('phiza') }} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-llrandomshake' size={ratio(70)} color='#617286' />
                    <FeedBackBtn onPress={shock} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-tupian' size={ratio(70)} color='#617286' />
                    <FeedBackBtn onPress={openimg} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-shexiangtou' size={ratio(70)} color='#617286' />
                    <FeedBackBtn onPress={callvideo} />
                </View>
                <View style={styles.tabItem}>
                    <Icons name='icon-shuaxin1' size={ratio(70)} color='#617286' />
                    <FeedBackBtn onPress={refresh} />
                </View>
            </View>
        )
    }
}

export class TextMessage extends PureComponent {

    errorCom = () => {
        let style = [styles.error];

        style[1] = (this.props.sender == 'mi') ? styles.rerr : styles.lerr;

        return (
            <Icons
                name='icon-gantanhao'
                style={style}
                size={ratio(60)}
                color='#f00'
            />
        )
    }

    deletCom = () => {
        const { sender, delet, id } = this.props;

        let style = [styles.deletbox];

        style[1] = (sender == 'mi') ? styles.rdelet : styles.ldelet;

        return (
            <View style={style}>
                <Image
                    source={require('../public/image/delete.png')}
                    style={styles.deleteimg}
                />
                <View style={styles.delete}>
                    <Icons name='icon-shanchu' size={ratio(50)} color='#fff' />
                    <Text style={styles.deltext}>删除</Text>
                </View>
                <FeedBackBtn onPress={() => { delet(id) }} />
            </View>
        )
    }

    zzfsCom = () => {
        let style = [styles.zzfsbox];
        let content = '……正在发送';
        if (this.props.sender === 'mi') {
            style[1] = styles.rzzfs;
        }
        else {
            style[1] = styles.lzzfs;
            content = '正在发送……';
        }

        return (
            <View style={style}>
                <Text style={styles.zzfs}>{content}</Text>
            </View>
        )
    }

    timeCom = () => (
        <View style={styles.timebox}>
            <Text style={styles.timetext}>{getTextDate(this.props.time)}</Text>
        </View>
    )

    imgCom = () => (
        <Image
            source={{ uri: this.props.userphoto }}
            style={styles.img}
        />
    )

    ContentCom = () => {
        const { sender, content, setDeletId, id, otype, play, playid, seturi } = this.props;

        const textstyle = [styles.textbox, styles[sender === 'mi' ? 'rtext' : 'ltext']];

        let ocontent = null;

        // 文本
        if (otype === 'message') {
            const List = content.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <Text key={index} style={styles.text}>{item.content}</Text>
                    )
                }
                else if (item.type === 'img') {
                    return (
                        <View style={styles.stbox} key={index}>
                            <Image source={getImg(Number(item.content))} style={styles.stimg} />
                        </View>
                    )
                }
            });

            ocontent = <View style={textstyle}>{List}</View>;
        }
        // 图片
        else if (otype === 'image') {
            let { uri, width, height } = content;

            // 每个屏幕的宽度都是不同的所以要判断一下最大宽度
            if (width > maxImgW) width = maxImgW;

            uri = hostname + uri;

            return (
                <View style={textstyle}>
                    <TouchableWithoutFeedback
                        onPress={() => seturi(uri, width, height)}
                        onLongPress={() => setDeletId(id)}
                    >
                        <Image
                            source={{ uri }}
                            style={{ width, height }}
                            resizeMode='cover'
                        />
                    </TouchableWithoutFeedback>
                </View>
            );
        }
        // 震动
        else if (otype === 'shock') {
            ocontent = (
                <View style={textstyle}>
                    <View style={styles.shockt} >
                        <Icons
                            name='icon-llrandomshake'
                            size={ratio(120)}
                            style={{ transform: [{ translateY: ratio(10) }] }}
                            color='#627385'
                        />
                    </View>
                </View>
            );
        }
        // 语音
        else if (otype === 'voice') {
            const onoff = sender !== 'mi' && !content.read;
            return (
                <VoiceCom
                    textstyle={textstyle}
                    time={content.time} // 时间
                    sender={sender}
                    read={sender === 'mi' || content.read ? true : false} // 是否已读
                    longPress={() => setDeletId(id)}
                    play={() => play(content.uri, id, onoff)}
                    active={playid === id}
                />
            );
        }

        return (
            <TouchableWithoutFeedback onLongPress={() => setDeletId(id)}>
                {ocontent}
            </TouchableWithoutFeedback>
        )
    }

    render() {

        const { sender, content, id, state, showtime, lastTime, showDelet, userphoto, setDeletId } = this.props;

        let boxstyle = [styles.messagebox];
        let contextstyle = [styles.content];
        let imgstyle = [styles.img];

        if (sender == 'mi') {
            boxstyle[1] = styles.end;
        }

        return (
            <View style={boxstyle}>
                {sender !== 'mi' && this.imgCom()}
                <View style={contextstyle}>

                    {this.ContentCom()}
                    {/* 发送出错组件 */}
                    {state === 'error' && this.errorCom()}
                    {/* 删除组件 */}
                    {showDelet && this.deletCom()}
                </View>
                {sender === 'mi' && this.imgCom()}
                {/* 时间组件 */}
                {showtime && this.timeCom()}
                {/* 正在发送组件 */}
                {state === 'transmit' && this.zzfsCom()}
            </View>
        )
    }
}

class VoiceCom extends PureComponent {

    constructor(props) {
        super(props);
        this.time = null;
        this.state = {
            n: 3,
            sa: false
        }
    }

    componentDidUpdate() {
        if (this.props.active && !this.state.sa) {
            this.setState({ sa: true });
            this.andrt();
        }
        else if (!this.props.active) {
            this.setState({ sa: false, n: 3 });
            clearInterval(this.time);
        }
    }

    componentWillUnmount() {
        clearInterval(this.time);
    }

    _imageMixin = (uri) => (<Image source={uri} style={styles.voiceimg} />)

    _unread = () => {
        return this.props.read ? null : (<View key={3} style={styles.unreadvioce} />);
    }

    andrt = () => {
        this.setState({ n: 0 });
        this.time = setInterval(() => {
            let n = this.state.n + 1;
            if (n > 3) {
                n = 0;
            }
            this.setState({ n });
        }, 200);
    }

    _time = () => (<Text key={2} style={styles.voicetext}>{this.props.time}</Text>)

    _icon = () => {
        const transform = [{ rotateY: this.props.sender === 'mi' ? '180deg' : '0deg' }];

        const n = this.state.n;

        return (
            <View key={1} style={[styles.voiceIb, { transform }]}>
                {this._imageMixin(require('../public/image/voice1.png'))}
                {n > 0 && this._imageMixin(require('../public/image/voice2.png'))}
                {n > 1 && this._imageMixin(require('../public/image/voice3.png'))}
                {n > 2 && this._imageMixin(require('../public/image/voice4.png'))}
            </View>
        )
    }

    render() {
        let arr = null;

        if (this.props.sender === 'mi') {
            arr = [this._unread(), this._time(), this._icon()];
        }
        else {
            arr = [this._icon(), this._time(), this._unread()];
        }

        return (
            <View style={[this.props.textstyle, { position: 'relative' }]}>
                <View style={styles.voicebb}>{arr}</View>
                <FeedBackBtn onLongPress={this.props.longPress} onPress={this.props.play} />
            </View>
        )
    }
}

export class PhizIcon extends PureComponent {
    ItemCom = ({ item, index }) => {
        return (
            <View style={{ width: ratio(152), alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { this.props.addIcon(`{{icon${index}}}`) }}>
                    <Image
                        source={getImg(item.uri)}
                        style={styles.phizimg}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    ItemSeparatorComponent = () => (<View style={{ height: ratio(55) }} />);

    BothEndCom = () => (<View style={{ height: ratio(30) }} />);

    render() {
        return (
            <View style={styles.bqbbox}>
                <FlatList
                    data={imgs}
                    numColumns={7}
                    renderItem={this.ItemCom}
                    ItemSeparatorComponent={this.ItemSeparatorComponent}
                    ListHeaderComponent={this.BothEndCom}
                    ListFooterComponent={this.BothEndCom}
                />
            </View>
        )
    }
}


export class TypeMessage extends PureComponent {

    render() {
        const wlen = ratio(600);
        const { content } = this.props;
        let w = 0;
        const List = content.map((item, index) => {

            if (item.type == 'text') {
                let o = w;
                w += item.content.length * ratio(30);
                let content = item.content;
                if (w > wlen) {
                    Math.floor((wlen - o) / ratio(30));
                    content = content.slice(0, Math.floor((wlen - o) / ratio(30)));
                }
                return (
                    <Text key={index} style={[styles.text, { color: '#666' }]}>{content}</Text>
                )
            }
            else {
                w += ratio(60);
                if (w > wlen) {
                    return null;
                }
                return (
                    <View style={styles.stbox} key={index}>
                        <Image source={getImg(Number(item.content))} style={styles.stimg} />
                    </View>
                )
            }
        });
        return (
            <View style={{ flexDirection: 'row', height: ratio(70), alignItems: 'center' }}>{List}</View>
        )
    }
}

// 语音
export class Voicebox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            voicebg: new Animated.Value(0),
            scale: new Animated.Value(1),
            recordtime: 0,
            title: 0,
            countdown: 3,
            hasPermission: null,
            audioPath: '',
            start: false,
            stop: false,
        };
        this.counttime = null;
    }

    async componentDidMount() {
        const hasPermission = await this._checkPermission();

        this.setState({ hasPermission });

        this.prepareRecordingPath();
    }

    // 录音初始化
    prepareRecordingPath() {
        if (!this.state.hasPermission) {
            return;
        }

        if (!this.state.audioPath) {
            this.setState({ audioPath: AudioUtils.MusicDirectoryPath + '/message.aac' });
        }

        AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });

        AudioRecorder.onProgress = (data) => {
            this.setState({ recordtime: Math.floor(data.currentTime) });
        };

        // ios通过onFinished事件监听录音结束
        AudioRecorder.onFinished = (data) => {
            // Android callback comes in the form of a promise instead.
            if (Platform.OS === 'ios') {
                this._finishRecording(data.status === "OK", data.audioFileURL);
            }
        };
    }
    // 获取权限
    _checkPermission() {
        // 如果不是android 返回true
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': '申请麦克风权限',
            'message': '需要获取您的麦克风权限，才能录制声音。'
        };
        //申请权限
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
            });
    }

    // 开始录音按钮
    StartBtn = () => {
        return (
            <TouchableWithoutFeedback onPressIn={this.startRecord} onPressOut={this.endRecord} >
                <Animated.View style={[
                    styles.voicebox,
                    styles.voice,
                    {
                        backgroundColor: this.state.voicebg.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['#617188', '#25b8a6']
                        }),
                        transform: [
                            {
                                scaleX: this.state.scale.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1]
                                })
                            },
                            {
                                scaleY: this.state.scale.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.6, 1]
                                })
                            }
                        ]
                    }
                ]}>
                    <Icons name='icon-yuyin' size={ratio(190)} color='#fff' />
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }

    // 计时box
    TimeBox = (children) => {
        return (
            <View style={styles.anzsh}>
                <Image source={dashed} style={styles.dashedimg} />
                {children}
                <Image source={dashed} style={styles.dashedimg} />
            </View>
        )
    }

    // 发送取消按钮
    EndBtnMinix = (text, fn) => {
        return (
            <View style={{ marginRight: ratio(20), marginLeft: ratio(20) }}>
                <SmallButton
                    height={ratio(110)}
                    width={ratio(248)}
                    fontSize={ratio(40)}
                    title={text}
                    href={fn}
                />
            </View>
        )
    }

    // 最后状态
    EndBtn = () => {
        return (
            <View style={styles.endbtnbox}>
                {this.EndBtnMinix('立即发送', this.send)}
                {this.EndBtnMinix('取消', this.abolish)}
            </View>
        )
    }

    // 动画
    startbtnAnimated = () => {
        Animated.parallel([
            Animated.timing(this.state.voicebg, { toValue: 1, duration: 200 }),
            Animated.sequence([
                Animated.timing(this.state.scale, { toValue: 0, duration: 100 }),
                Animated.timing(this.state.scale, { toValue: 1, duration: 100 })
            ])
        ]).start();
    }

    // 开始录音
    startRecord = async () => {
        if (!this.state.hasPermission) {
            hint('没有相应的权限，无法录音');
            return;
        }
        // 动画
        this.startbtnAnimated();
        // 改变按钮颜色
        this.setState({ title: 1, recordtime: 0 });
        if (this.state.stop) {
            this.prepareRecordingPath();
        }
        try {
            await AudioRecorder.startRecording();
        }
        catch (e) {
            alert('报错');
        }
    }

    // 停止录音
    endRecord = async () => {
        if (!this.state.hasPermission) {
            return;
        }

        try {
            const file = await AudioRecorder.stopRecording();

            this.state.scale.setValue(1);

            this.state.voicebg.setValue(0);

            this.setState({ title: 2, countdown: 3, stop: true });

            this.countdownsend();
        }
        catch (e) { }
    }

    // 倒计时
    countdownsend = () => {
        clearInterval(this.counttime);
        this.counttime = setInterval(() => {
            if (this.state.countdown <= 1) {
                this.send();
            }
            else {
                this.setState({ countdown: this.state.countdown - 1 });
            }
        }, 1000);
    }
    // 取消发送
    abolish = () => {
        clearInterval(this.counttime);
        this.setState({ title: 0, recordtime: 0 });
    }
    // 立即发送
    send = () => {
        clearInterval(this.counttime);
        this.setState({ title: 0 });
        // 发送数据
        this.props.send(this.state.audioPath, this.state.recordtime);
    }

    render() {
        return (
            <View style={[styles.bqbbox, styles.voicebox]}>
                {this.state.title === 0 && <View style={styles.anzsh}><Text style={styles.countdown}>按住说话</Text></View>}
                {this.state.title === 1 && this.TimeBox(<Text style={styles.countdown}>{getRecordTime(this.state.recordtime)}</Text>)}
                {this.state.title === 2 && this.TimeBox(<Text style={styles.countdown}>语音还有 <Text style={{ color: '#ff5500' }}>0{this.state.countdown}</Text> 秒发送</Text>)}
                {this.state.title !== 2 && this.StartBtn()}
                {this.state.title === 2 && this.EndBtn()}
            </View>
        )
    }
}