/**
 * Created by littlebyte on 17/5/11.
 * 正在加载组件
 */

import React, {Component} from 'react'
import {View, Text, Image, StyleSheet} from 'react-native';
export default class FirstLoadingView extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/view_loading.png')} style={styles.img}/>
                <Text style={styles.tipText}>
                    正在加载中...
                </Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: 100,
        alignItems:'center',
        backgroundColor:'#F1F1F8'
    },
    tipText: {
        color: '#AEAEAE',
        fontSize: 14,
        marginTop:15,
    },
    img:{
        width:200,
        height:100,
        resizeMode:'contain'
    }
})