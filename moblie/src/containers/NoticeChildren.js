import React, { Component, PureComponent } from 'react';

import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';

import { connect } from 'react-redux';

import Box from '../components/Box'

import { Background } from '../components/Image'

import { InlineHeader } from '../components/Header'

import { ofetch, ratio, getTextDate, windowW } from '../public/fn'

import { pleft, pright, borderColor } from '../public/config'

import { setNAddContent } from '../store/notice/action'



const styles = StyleSheet.create({
    nullbox: { height: ratio(300), justifyContent: 'center', alignItems: 'center' },
    nulltext: { fontSize: ratio(40), color: '#666' },
    title: {
        fontSize: ratio(40), color: '#333', lineHeight: ratio(60), paddingLeft: pleft, paddingRight: pright,
    },
    infor: {
        borderBottomWidth: 1, borderColor: '#07bb98', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
        height: ratio(80), paddingLeft: pleft, paddingRight: pright,
    },
    infortext: {
        fontSize: ratio(35), color: '#777',
    },
    description: {
        margin: ratio(30),
        backgroundColor: 'rgba(255,255,255,.6)', padding: ratio(30),
        borderWidth: 1, borderColor: '#ddd'
    },
    descriptiontext: {
        fontSize: ratio(40), color: '#666', lineHeight: ratio(60)
    },
    imagec: {
        width: windowW - pleft - pright, height: ratio(500)
    },
    imgcbox: {
        alignItems: 'center', marginTop: ratio(40), marginBottom: ratio(40)
    },
    titlecbox: {
        paddingLeft: pleft, paddingRight: pright,
    },
    titletext: {
        fontSize: ratio(50), fontWeight: 'bold', lineHeight: ratio(70), color: '#111'
    },
    ctext: {
        fontSize: ratio(40), lineHeight: ratio(60), color: '#555'
    }
});

class ContentCom extends PureComponent {
    render() {
        let { title, mobliecontent, description, otime } = this.props;
        let content = null;
        try {
            mobliecontent = JSON.parse(mobliecontent);
            content = mobliecontent.map((item, index) => {
                // image view title
                switch (item.type) {
                    case 'image':
                        return (
                            <View key={index} style={styles.imgcbox}>
                                <Image source={{ uri: item.src }} resizeMode='cover' style={styles.imagec} />
                            </View>
                        );
                    case 'title':
                        return (
                            <View key={index} style={styles.titlecbox}>
                                <Text style={styles.titletext}>{item.text}</Text>
                            </View>
                        );
                    case 'view':
                        return (
                            <View key={index} style={styles.titlecbox}>
                                <Text style={styles.ctext}>{item.text}</Text>
                            </View>
                        );
                    default:
                        return null;
                }
            })
        }
        catch (e) {
            content = (
                <View style={styles.nullbox}>
                    <Text style={styles.nulltext}>数据解析失败！</Text>
                </View>
            )
        }


        return (
            <ScrollView style={{ flex: 1 }}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.infor}>
                    <Text style={styles.infortext}>发布人：admin</Text>
                    <Text />
                    <Text style={styles.infortext}>日期：{getTextDate(otime)}</Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.descriptiontext}>{description}</Text>
                </View>
                {content}
                <View style={{ height: ratio(100) }} />
            </ScrollView>
        )
    }
}

class NoticeChildren extends Component {
    constructor(props) {
        super(props);
        this.state = {
            load: true
        }
        this.id = this.props.navigation.getParam('id', 0);
    }
    // 返回
    backup = () => {
        this.props.navigation.goBack();
    }
    NoDataCom = () => (
        <View style={styles.nullbox}>
            <Text style={styles.nulltext}>
                {this.state.load ? '正在获取数据中' : '数据获取失败'}……
            </Text>
        </View>
    )
    render() {
        let data = this.props.content[this.id];
        return (
            <Box>
                <Background active="settingchildren" />
                <InlineHeader title="公告内容" hideBtn={true} backup={this.backup} />
                {/* {!data ? this.NoDataCom() : false} */}
                {!data ? this.NoDataCom() : <ContentCom {...data} />}
            </Box>
        )
    }
    async componentDidMount() {

        // 查看 该条内容是否已经查看了
        if (this.props.content[this.id]) {
            // 已经阅读了
            return;
        }
        // 获取数据
        const { success, data } = await ofetch('/notice', { id: this.id });

        this.setState({ load: false });

        if (!success) {
            return;
        }
        // 获取成功
        this.props.dispatch(setNAddContent(data, this.id));
    }
}

export default connect((state, props) => ({
    navigation: props.navigation,
    content: state.n.content
}))(NoticeChildren);