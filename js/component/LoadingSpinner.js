/**
 * Created by lizhj on 2017/7/19.
 */
import React, {Component} from "react";
import {View, Text, ActivityIndicator} from "react-native";
import screen from '../utils/screen'

export default class LoadingSpinner extends Component {

    static defaultProps = {
        width: screen.width,
        height: screen.height,
        spinnerColor: 'dimgray',
        textColor: 'dimgray',
        text: ''
    };

    render() {
        return (
            <View style={{
                width: this.props.width,
                height: this.props.height,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator color={this.props.spinnerColor}/>
                <View style={{height: 10}}/>
                <Text note style={{color: this.props.textColor}}>{this.props.text}</Text>
            </View>
        );
    }
}