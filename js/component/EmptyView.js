/**
 * Created by lizhj on 2017/7/17.
 */
import React, {Component} from 'react'
import {View, Text, StyleSheet, Image} from 'react-native';
import screen from '../utils/screen'
export default class EmptyView extends Component {

    render() {
        return (
            <View style={styles.content}>
                <Image source={require('../img/icon_no_data.png')} style={styles.img}/>
                <Text style={styles.tipText}>
                    暂无数据
                </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    content: {
        width: screen.width,
        height: screen.height,
        paddingTop: 150,
        alignItems: 'center',
        backgroundColor: '#F1F1F8'
    },
    img: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginTop: 100,
    },
    tipText: {
        color: '#AEAEAE',
        fontSize: 14,
        marginTop: 15,
    },
});