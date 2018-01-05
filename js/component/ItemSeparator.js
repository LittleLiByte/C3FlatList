/**
 * Created by lizhj on 2017/7/17.
 */
import React, {Component} from 'react'
import {View} from 'react-native';
import screen from '../utils/screen'

export default class ItemSeparator extends Component {
    render() {
        return <View style={{width: screen.width, height: screen.onePixel, backgroundColor: '#f2f2f2'}}/>
    }
}