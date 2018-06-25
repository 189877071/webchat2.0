import React, { Component, PureComponent } from 'react';

import { View, Text, StyleSheet, Animated, PanResponder, UIManager, findNodeHandle } from 'react-native';

import { getuser, ofetch, windowH, windowW, ratio, hint, customEvent, callAudio } from '../public/fn'

import { iceServers, hostname } from '../public/config'

import Box from '../components/Box'

import { Background } from '../components/Image'

import { connect } from 'react-redux';

import { setVideoCall } from '../store/common/action'

import { UserPhoto, UserName, AnswerOptation, CallBtn } from '../components/VidoeCall'

import { getUserMedia, RTCView, MediaStreamTrack, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc'

const videoWidth = windowH / 4 * 3;

const translateX = (windowW - videoWidth) / 2;

const oCustomEvent = customEvent();

const styles = StyleSheet.create({
    box: {
        flex: 1,
        backgroundColor: '#000'
    },
    answerbox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    callbox: {
        flex: 1,
        position: 'relative'
    },
    bigRtcView: {
        height: windowH,
        width: videoWidth,
        transform: [{ translateX }]
    },
    smallRtcView: {
        width: ratio(300),
        height: ratio(300 / 3 * 4)
    },
    smallBox: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ratio(300),
        height: ratio(300 / 3 * 4)
    }
})

class SmallStream extends PureComponent {
    constructor(props) {
        super(props);

        const [x, y] = [
            windowW - ratio(350),
            windowH - ratio(300 / 3 * 4 + 100)
        ];

        this.state = {
            pan: new Animated.ValueXY({ x, y }),
            x: 0,
            y: 0,
            upx: 0,
            upy: 0,
        };

        this.state.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._true,
            onMoveShouldSetPanResponder: this._true,
            onPanResponderMove: this._move,
            onPanResponderRelease: this._release
        });

        this.boxPageX = 0;
        this.boxPageY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.box = React.createRef();
    }

    _true = () => true;

    _move = (evt, gestureState) => {
        let [x, y] = [
            gestureState.dx + this.state.upx,
            gestureState.dy + this.state.upy
        ];
        if (x < -this.boxPageX) {
            x = -this.boxPageX;
        }
        else if (x > this.maxX) {
            x = this.maxX;
        }
        if (y < -this.boxPageY) {
            y = -this.boxPageY;
        }
        else if (y > this.maxY) {
            y = this.maxY;
        }
        this.state.pan.setOffset({ x, y });
        this.setState({ x, y });
    }

    _release = (evt, gestureState) => {
        if (gestureState.dx === 0) {
            // 点击事件 切换视频
            this.props.toggle();
            return;
        }
        this.setState({ upx: this.state.x, upy: this.state.y });
    }

    componentDidMount() {
        setTimeout(() => {
            UIManager.measure(findNodeHandle(this.box.current), (x, y, width, height, pageX, pageY) => {
                this.boxPageX = pageX;
                this.boxPageY = pageY;
                this.maxX = windowW - width - pageX;
                this.maxY = windowH - height - pageY - ratio(50);
            });
        }, 0);
    }

    render() {
        return (
            <Animated.View
                {...this.state.panResponder.panHandlers}
                style={[styles.smallBox, { transform: this.state.pan.getTranslateTransform() }]}
                ref={this.box}
            >
                <RTCView style={styles.smallRtcView} streamURL={this.props.streamURL} />
            </Animated.View>
        )
    }
}

class VideoCall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFront: true,
            bigStreamURL: '',
            smallStreamURL: '',
            init: true,
            showCom: this.props.isAnswer,
            toggle: false,
            bigshow: false,
        };

        this.ice = [];
        this.peer = null;
        this.icetime = null;
        this.rejectTime = null;
        this.sdp = null;
    }

    componentDidMount() {
        const { user, goback, setcall, isAnswer } = this.props;
        if (!user) {
            goback();
            return;
        }
        setcall(true);

        if (!isAnswer) {
            this._offer();
        }
    }

    componentWillUnmount() {
        this.props.setcall(false);
        clearTimeout(this.rejectTime);
        clearTimeout(this.icetime);
        callAudio().setKSO(false);
        this.peer && this.peer.close();
        oCustomEvent.delet('answer');
    }

    _offer = () => {
        this._getcamera();

        oCustomEvent.on('answer', ({ sdp, ice, userid, reject }) => {
            const { user, goback } = this.props;
            if (userid !== user.id) return;

            if (reject === 1) {
                hint('对方拒绝了你的请求……');
                this.rejectTime = setTimeout(() => goback(), 2000);
                return;
            }

            this._addAnswer({ sdp, ice });
        }, 1);
    }

    // 接听电话
    toAnswer = () => {
        if (!this.props.isAnswer || !this.state.showCom) return;
        callAudio().stop();
        callAudio().setKSO(true);
        this.setState({ showCom: false, init: true });
        this._getcamera();
    }

    // 拒绝接听
    toReject = () => {
        callAudio().stop();
        ofetch('/message?optation=call', { heid: this.props.user.id, answer: true, reject: 1 });
        this.props.goback();
    }

    // 接听电话 tfei
    AnswerCom = () => {
        const { user } = this.props;
        return (
            <View style={styles.answerbox}>
                <View style={{ alignItems: 'center' }}>
                    <UserPhoto uri={hostname + user.headphoto} />
                    <UserName name={user.name || user.username} />
                </View>
                <AnswerOptation
                    answer={this.toAnswer}
                    reject={this.toReject}
                />
            </View>
        )
    }

    // 通话 
    CallCom = () => {
        const { init, smallStreamURL, bigStreamURL, toggle, bigshow } = this.state;

        if (init) {
            hint('正在初始化');
            const { user } = this.props;
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <UserPhoto uri={hostname + user.headphoto} />
                    <UserName name={user.name || user.username} />
                </View>
            );
        }
        else {
            if (!bigshow) {
                this._bigshow();
            }
        }

        let [big, small] = ['', ''];

        if (!toggle) {
            big = smallStreamURL;
            small = bigStreamURL;
        }
        else {
            small = smallStreamURL;
            big = bigStreamURL;
        }


        return (
            <View style={styles.callbox}>
                {bigshow && <RTCView style={styles.bigRtcView} streamURL={big} />}
                <CallBtn close={() => this.props.goback()} />
                <SmallStream toggle={() => this.setState({ toggle: !toggle })} streamURL={small} />
            </View>
        )
    }

    _bigshow = () => {
        setTimeout(() => {
            this.setState({ bigshow: true });
        }, 300);
    }

    _getcamera = () => {
        MediaStreamTrack.getSources(sourceInfos => {
            let videoSourceId;
            for (const i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "video" && sourceInfo.facing == (this.state.isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
            getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minFrameRate: 30,
                        minWidth: videoWidth,
                        minHeight: windowH
                    },
                    facingMode: (this.state.isFront ? 'user' : 'environment'),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            }, (stream) => {
                this.setState({ bigStreamURL: stream.toURL(), step: 1 });
                this._connect(stream);
            }, () => {
                alert('打开摄像头失败');
            })
        });
    }

    _connect = (stream) => {
        this.peer = new RTCPeerConnection(iceServers);
        // 当一个ICE候选人被添加时触发
        this.peer.onicecandidate = this._addIcecandidate;

        this.peer.onnegotiationneeded = this._createOffer;

        this.peer.onaddstream = this._addStream;

        this.peer.addStream(stream);

        this._toAnswer();
    }

    _addIcecandidate = (ev) => {
        if (ev.candidate) {
            this.ice.push(ev.candidate);
        }
        else {
            clearTimeout(this.icetime);
            this.icetime = setTimeout(() => this._sendData(), 1000);
        }
    }

    _createOffer = () => {
        if (!this.peer || this.props.isAnswer) return;
        this.peer.createOffer((sdp) => {
            this.sdp = sdp;
            this.peer.setLocalDescription(sdp);
        }, this._logError);
    }

    _logError = () => {
        alert('出错');
    }

    _addStream = (ev) => {
        // 接收到对方的视频流
        this.setState({ init: false, smallStreamURL: ev.stream.toURL() });
    }

    _sendData = async () => {
        const { user, isAnswer } = this.props;

        if (!user || !this.sdp || !this.ice.length) {
            return;
        }

        hint('正在发送通话请求……');

        let params = { heid: this.props.user.id, sdp: this.sdp, ice: this.ice };

        if (isAnswer) params.answer = true;

        const { success } = await ofetch('/message?optation=call', params);

        if (!success) {
            hint('通话请求失败……');
            return;
        }
    }

    _toAnswer = () => {
        const { isAnswer, hePeerData: { sdp, ice } } = this.props;

        if (!isAnswer || !sdp || !ice || !this.peer) return;

        this._addAnswer({ sdp, ice });
    }

    _addAnswer = ({ sdp, ice }) => {
        hint('正在连接……');
        this.peer.setRemoteDescription(new RTCSessionDescription(sdp), () => {
            if (this.peer.remoteDescription.type == "offer") {
                this.peer.createAnswer(sdp => {
                    this.sdp = sdp;
                    this.peer.setLocalDescription(sdp);
                });
            }
        }, this._logError);

        ice.forEach(item => this.peer.addIceCandidate(new RTCIceCandidate(item)));
    }

    render() {
        return (
            <Box>
                <Background active="call" />
                {this.state.showCom ? this.AnswerCom() : this.CallCom()}
            </Box>
        )
    }
}

const states = (state, props) => {
    const user = getuser(props.navigation.getParam('id', 0), state.u.users);
    const isAnswer = props.navigation.getParam('answer', false);
    return {
        user,
        isAnswer,
        hePeerData: state.c.peerData
    }
}

const actions = (dispatch, props) => {
    return {
        goback: () => props.navigation.goBack(),
        setcall: (bool) => dispatch(setVideoCall(bool)),
    }
}

export default connect(states, actions)(VideoCall);