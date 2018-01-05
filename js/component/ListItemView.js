/**
 * Created by littlebyte on 17/5/5.
 */
import React, {PureComponent} from 'react';
import {View, Text,Image} from 'react-native';

export default class ListItemView extends PureComponent {
    render() {
        let {data} = this.props;
        return (
            <View style={{backgroundColor: '#F2F2F2'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 30, height: 30, borderRadius: 15, marginLeft: 10}}
                           source={{uri: data.img}}/>
                    <Text style={{marginLeft: 7, fontSize: 14, fontWeight: 'bold'}}>{data.name}</Text>
                </View>
                <View style={{
                    marginLeft: 40,
                    backgroundColor: 'white',
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: '#CECECE',
                    padding: 10,
                    marginRight: 10
                }}>
                    <Text style={{fontSize: 14}}>{data.title}</Text>
                    <View style={{flexDirection: 'row', marginTop: 6}}>
                        <View style={{width: 2, backgroundColor: '#FF676B'}}/>
                        <Text style={{marginLeft: 10, fontSize: 13}}>{data.summary}</Text>
                    </View>
                    <Text style={{fontSize: 11, alignSelf: 'flex-end', marginTop: 6}}>{`摘自 ${data.source}`}</Text>
                </View>
            </View>
        );
    }
}
