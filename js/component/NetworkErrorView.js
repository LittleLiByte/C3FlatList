/**
 * Created by littlebyte on 2017/5/24.
 */
import React,{Component,PropTypes} from 'react'
import {View, Text,Button,StyleSheet,Image} from 'react-native';
export default class NoNetworkView extends Component{
    static propTypes = {
        onPress: PropTypes.func
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../img/icon_no_network.png')} style={styles.img}/>
                <Text style={styles.tipText}>
                    加载网络数据失败，请重新加载
                </Text>
                <Button  title={'重新加载'} buttonStyle={styles.reloadBtn} onPress={this.props.onPress}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: 150,
        alignItems:'center',
        backgroundColor:'#F1F1F8'
    },
    tipText: {
        color: '#AEAEAE',
        fontSize: 14,
        marginTop:8,
        marginBottom:10,
    },
    img:{
        width:200,
        height:100,
        resizeMode:'contain'
    },
    reloadBtn:{
        borderRadius:5,
        color:'white',
        fontSize:14,
        padding:5,
        backgroundColor:'#25A5E1'
    },
})