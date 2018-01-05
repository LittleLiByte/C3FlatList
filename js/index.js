/**
 * Created by lizhj on 2017/7/17.
 */
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FirstLoadingView from "./component/FirstLoadingView";
import ListItemView from "./component/ListItemView";
import NetworkErrorView from "./component/NetworkErrorView";
import EmptyView from "./component/EmptyView";
import ItemSeparator from "./component/ItemSeparator";
import C3FlatList from "./component/C3FlatList";
import LoadingSpinner from "./component/LoadingSpinner";
import screen from './utils/screen'
import jsonData from './component/data.json'

const url = 'https://coding.net/u/liubtest/p/GitTest/git/raw/master/firstView';
let cacheData = jsonData;

export default class CCCFLatListApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            firstLoad: true,
            renderError: false,
            data: [],
            pageNumber: 1,
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <C3FlatList
                    ref={(ref) => this.flatlist = ref}
                    onFetch={this.onFetch}
                    keyExtractor={(item, index) => index}  //this is required when you are using FlatList
                    refreshableMode="advanced" //basic or advanced
                    item={this.renderItemComponent}  //this takes three params (item, index, separator)
                    //----Extra Config----
                    paginationFetchingView={this.renderPaginationFetchingView}
                    paginationAllLoadedView={this.renderPaginationAllLoadedView}
                    paginationWaitingView={this.renderPaginationWaitingView}
                    emptyView={() => {
                        return <EmptyView/>
                    }}
                    separator={() => {
                        return <ItemSeparator/>
                    }}
                    onEndReachedThreshold={0.1}
                />
            </View>
        )
    }

    onFetch = async (page = 1, startFetch, abortFetch) => {
        try {
            startFetch(cacheData, 10);
        } catch (err) {
            abortFetch(); //manually stop the refresh or pagination if it encounters network error
            console.log("获取网络数据失败：", err);
        }
    };


    /**
     * 渲染FlatList 的单个item,注意此处item继承的是PureComponent而不是Component
     * @param item
     * @returns {XML}
     * @private
     */
    renderItemComponent = (item, index, separator) => {
        return (
            <ListItemView
                data={item}
                onPress={() => {

                }}
            />
        );
    };

    /**
     * 这里自定义首次加载还未加载出列表时的UI
     * @returns {XML}
     */
    renderPaginationFetchingView = () => {
        return (
            <FirstLoadingView/>
        )
    };

    /**
     * 这里自定义上拉加载无数据时的UI
     * @returns {XML}
     */
    renderPaginationAllLoadedView = () => {
        return (
            <View style={{
                flex: 0,
                width: screen.width,
                height: 55,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{alignSelf: 'center'}}>
                    我是有底线的
                </Text>
            </View>
        );
    };

    /**
     * 这里自定义正在上拉加载时的UI
     * @returns {XML}
     */
    renderPaginationWaitingView = () => {
        return (
            <LoadingSpinner height={screen.height * 0.1} text="正在拼命加载..."/>
        );
    }

}
const styles = StyleSheet.create({
    text: {
        fontSize: 14,
    },
    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    footerText: {
        fontSize: 14,
        color: '#555555'
    }
});