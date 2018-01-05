/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import CCCFLatListApp from './js/index'

export default class App extends Component {
    render() {
        return <CCCFLatListApp/>
    }
}

AppRegistry.registerComponent('FlatListTest', () => App);
