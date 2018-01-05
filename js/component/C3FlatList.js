/**
 * 通用FlatList组件封，支持下拉刷新和上拉加载
 * Created by lizhj on 2017/8/28.
 */

import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
    InteractionManager,
    TouchableOpacity,
} from 'react-native';
import NetworkErrorView from "./NetworkErrorView";

const {width} = Dimensions.get('window');
const PaginationStatus = {
    idle: 0,
    waiting: 1,
    allLoaded: 2,
    loadError: 3,
};
export default class C3FlatList extends Component {

    static defaultProps = {
        initialNumToRender: 10,
        horizontal: false,

        firstLoader: true,
        scrollEnabled: true,
        onFetch: null,
        enableEmptySections: true,

        //Custom View
        header: null,
        item: null,
        paginationAllLoadedView: null,
        paginationWaitingView: null,
        firstLoadingView: null,
        renderErrorPage: null,
        emptyView: null,
        separator: null,

        //Refreshable
        refreshable: true,

        //RefreshControl
        refreshableTitle: null,
        refreshableColors: ['dimgray', 'tomato', 'limegreen'],
        refreshableProgressBackgroundColor: 'white',
        refreshableSize: undefined,
        refreshableTintColor: 'lightgray',
        customRefreshControl: null,

        //Pagination
        hasAllLoadedTips: true,
        pagination: true,
        autoPagination: true,
        allLoadedText: '没有更多的内容',

        //Spinner
        spinnerColor: undefined,
        fetchingSpinnerSize: 'large',
        waitingSpinnerSize: 'small',
        waitingSpinnerText: '加载更多',
        loadErrorText: '加载错误，点击重新加载',

        //Pagination Button
        paginationBtnText: '加载更多',

    };

    static propTypes = {
        initialNumToRender: React.PropTypes.number,
        horizontal: React.PropTypes.bool,
        hasAllLoadedTips: React.PropTypes.bool,
        firstLoader: React.PropTypes.bool,
        scrollEnabled: React.PropTypes.bool,
        onFetch: React.PropTypes.func,
        enableEmptySections: React.PropTypes.bool,

        //Custom ListView
        header: React.PropTypes.func,
        item: React.PropTypes.func,
        sectionHeaderView: React.PropTypes.func,
        paginationAllLoadedView: React.PropTypes.func,
        paginationWaitingView: React.PropTypes.func,
        firstLoadingView: React.PropTypes.func,
        renderErrorPage: React.PropTypes.func,

        emptyView: React.PropTypes.func,
        separator: React.PropTypes.func,

        //Refreshable
        refreshable: React.PropTypes.bool,

        //RefreshControl
        refreshableTitle: React.PropTypes.string,
        refreshableColors: React.PropTypes.array,
        refreshableProgressBackgroundColor: React.PropTypes.string,
        refreshableSize: React.PropTypes.string,
        refreshableTintColor: React.PropTypes.string,
        customRefreshControl: React.PropTypes.func,

        //Pagination
        pagination: React.PropTypes.bool,
        autoPagination: React.PropTypes.bool,
        allLoadedText: React.PropTypes.string,
        loadErrorText: React.PropTypes.string,

        //Spinner
        spinnerColor: React.PropTypes.string,
        fetchingSpinnerSize: React.PropTypes.any,
        waitingSpinnerSize: React.PropTypes.any,
        waitingSpinnerText: React.PropTypes.string,

        //Pagination Button
        paginationBtnText: React.PropTypes.string,

    };

    constructor(props) {
        super(props);
        this.setPage(1);
        this.setRows([]);

        this.state = {
            firstLoad: true,
            dataSource: [],
            isRefreshing: true,
            loadSuccess: true,
            paginationStatus: PaginationStatus.idle,
        };
    }

    componentDidMount() {
        this.mounted = true;
        //等到初始页面加载完毕且动画完成后再请求数据，这样切换到本页面时不会有卡顿
        InteractionManager.runAfterInteractions(() => {
            if (this.props.firstLoader) {
                this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch);
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setPage = (page) => {
        this.page = page;
    };

    getPage = () => {
        return this.page;
    };

    setRows = (rows) => {
        this.rows = rows;
    };

    getRows = () => {
        return this.rows;
    };

    sleep = (time) => {
        return new Promise(resolve => setTimeout(() => resolve(), time));
    };

    refresh = () => {
        this.onRefresh();
    };

    deleteAndUpdateDataSource = (index) => {
        this.getRows().splice(index, 1);
        this.setRows(this.getRows());
        this.setState({
            dataSource: this.getRows()
        });
    };

    scrollToOffset = (option) => {
        this.cccflatList.scrollToOffset(option);
    };

    scrollToIndex = (option) => {
        this.cccflatList.scrollToIndex(option);
    };

    scrollToItem = (option) => {
        this.cccflatList.scrollToItem(option);
    };

    scrollToEnd = (option) => {
        this.cccflatList.scrollToEnd(option);
    };

    onRefresh = () => {
        console.log('onRefresh');
        if (this.mounted) {
            this.setState({
                isRefreshing: true
            });
            this.setPage(1);
            this.props.onFetch(this.getPage(), this.postRefresh, this.endFetch);
        }
    };

    postRefresh = (rows = [], pageLimit) => {
        if (this.mounted) {
            let paginationStatus = PaginationStatus.waiting;
            if (rows.length < pageLimit) {
                paginationStatus = PaginationStatus.allLoaded;
            }
            this.updateRows(rows, paginationStatus);
        }
    };

    endFetch = () => {
        if (this.mounted) {
            if (this.state.firstLoad) {
                this.setState({
                    isRefreshing: false,
                    loadSuccess: false,
                });
            } else if (this.props.refreshable) {
                this.setState({
                    isRefreshing: false,
                    loadSuccess: false,
                    paginationStatus: PaginationStatus.loadError,
                });
            }
        }
    };

    onPaginate = () => {
        if (this.state.paginationStatus === PaginationStatus.allLoaded) {
            return null;
        } else {
            this.setState({
                paginationStatus: PaginationStatus.waiting
            });
            this.props.onFetch(this.getPage() + 1, this.postPaginate, this.endFetch);
        }
    };

    postPaginate = (rows = [], pageLimit) => {
        this.setPage(this.getPage() + 1);
        let mergedRows;
        let paginationStatus;
        if (rows.length === 0) {
            paginationStatus = PaginationStatus.allLoaded;
        } else {
            mergedRows = this.getRows().concat(rows);
            paginationStatus = PaginationStatus.waiting;
        }

        this.updateRows(mergedRows, paginationStatus);
    };

    updateRows = (rows, paginationStatus) => {
        if (rows) {
            this.setRows(rows);
            this.setState({
                dataSource: rows,
                isRefreshing: false,
                firstLoad: false,
                paginationStatus
            });
        } else {
            this.setState({
                dataSource: this.getRows().slice(),
                isRefreshing: false,
                paginationStatus
            });
        }

    };

    updateDataSource(rows = []) {
        this.setRows(rows);
        this.setState({
            dataSource: rows
        });
    }

    onEndReached = () => {
        if (this.props.pagination && this.props.autoPagination &&
            this.state.paginationStatus === PaginationStatus.waiting) {
            this.onPaginate();
        }
    };

    /**
     * 加载完毕
     * @returns {*}
     */
    paginationAllLoadedView = () => {
        if (this.props.hasAllLoadedTips && this.props.pagination) {
            if (this.props.paginationAllLoadedView) {
                return this.props.paginationAllLoadedView();
            }

            return (
                <View style={styles.footerView}>
                    <Text style={{alignSelf: 'center', color: '#999'}}>
                        {this.props.allLoadedText}
                    </Text>
                </View>
            );
        }

        return null;
    };

    paginationErrorView = () => {
        if (this.props.paginationErrorView) {
            return this.props.paginationErrorView();
        }
        return (
            <View style={styles.footerView}>
                <TouchableOpacity onPress={() => {
                    this.props.onFetch(this.getPage() + 1, this.postPaginate, this.endFetch);
                }}>
                    <Text style={{alignSelf: 'center'}}>
                        {this.props.loadErrorText}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    /**
     * 这里自定义正在上拉加载时的UI
     * @returns {XML}
     */
    paginationWaitingView = (paginateCallback) => {
        if (this.props.pagination) {
            if (this.props.autoPagination) {
                if (this.props.paginationWaitingView) {
                    return this.props.paginationWaitingView(paginateCallback);
                }

                return (
                    <View style={styles.footerView}>
                        <ActivityIndicator
                            color={this.props.spinnerColor}
                            size={this.props.waitingSpinnerSize}
                        />
                        <Text style={[styles.paginationViewText, {marginLeft: 5}]}>
                            {this.props.waitingSpinnerText}
                        </Text>
                    </View>
                );
            }
        }

        return null;
    };

    /**
     * 这里自定义首次进入页面初始化的页面
     * @returns {XML}
     */
    renderFirstLoadingView = () => {
        if (this.props.firstLoadingView) {
            return this.props.firstLoadingView;
        }
        return (
            <View style={styles.container}>
                <Text>
                </Text>
            </View>
        )
    }

    renderErrorPage = () => {
        if (this.props.renderErrorPage) {
            return this.props.renderErrorPage;
        }
        return (
            <NetworkErrorView onPress={()=>{
                this.refresh();
            }}/>
        );
    }

    /**
     * 这里自定义列表头部，注意，如果列表头部包含图片组件，属性必须添加
     * removeClippedSubviews={false}
     * 否则无法显示图片
     */
    renderHeader = () => {
        if (this.props.header) {
            return this.props.header();
        }
        return null;
    };

    /**
     * 自定义列表item
     */
    renderItem = ({item, index, separators}) => {
        if (this.props.item) {
            return this.props.item(item, index, separators);
        }
        return null;
    };

    /**
     * 自定义列表分割线
     */
    renderSeparator = () => {
        if (this.props.separator) {
            return this.props.separator();
        }

        return null;
    };

    /**
     * 自定义列表为空显示的视图
     */
    renderEmptyView = () => {
        if (this.props.emptyView) {
            return this.props.emptyView();
        }
        return null;
    };

    /**
     * 自定义列表底部
     */
    renderFooter = () => {
        if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === false) {
            return this.paginationWaitingView(this.onPaginate);
        } else if (this.state.paginationStatus === PaginationStatus.waiting && this.props.autoPagination === true) {
            return this.paginationWaitingView();
        } else if (this.state.paginationStatus === PaginationStatus.allLoaded) {
            return this.paginationAllLoadedView();
        } else if (this.state.paginationStatus === PaginationStatus.loadError) {
            return this.paginationErrorView();
        }

        return null;
    };


    /**
     * 自定义RefreshControl
     * @returns {*}
     */
    renderRefreshControl = () => {
        if (this.props.refreshable) {
            if (this.props.customRefreshControl) {
                return this.props.customRefreshControl(this.state.isRefreshing, this.onRefresh);
            }

            return (
                <RefreshControl
                    onRefresh={this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    colors={['red', '#ffd500', '#0080ff', '#99e600']}//this.props.refreshableColors
                    progressBackgroundColor={this.props.refreshableProgressBackgroundColor}
                    size={this.props.refreshableSize}
                    tintColor={this.props.refreshableTintColor}
                    title={this.props.refreshableTitle}
                />
            );
        }

        return null;
    };


    render() {
        if (!this.state.loadSuccess) {
            return this.renderErrorPage();
        } else {
            return (
                <FlatList
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={0.1}
                    {...this.props}
                    ref={(ref) => this.cccflatList = ref}
                    data={this.state.dataSource}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmptyView}
                    onEndReached={this.onEndReached}
                    refreshControl={this.renderRefreshControl()}
                />
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerView: {
        width,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#fff'
    },
    paginationViewText: {
        fontSize: 16
    },

    paginationBtn: {
        backgroundColor: 'tomato',
        margin: 10,
        borderRadius: 20,
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationBtnText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold'
    },
    separator: {
        height: 0.5,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: 'lightgray'
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    allLoadedText: {
        alignSelf: 'center'
    },
});