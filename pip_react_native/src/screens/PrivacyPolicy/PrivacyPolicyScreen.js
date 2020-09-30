import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native'
import { CommonHeader, SafeAreaComponent} from '../../components';
import { Color, Dimen, Strings } from '../../../res';

class PrivacyPolicyScreen extends Component {
  
    constructor(props) {
        super(props)

    }

    render() {
        console.log('this.props.route.params.data' + JSON.stringify(this.props.route.params))
        return (
                <SafeAreaComponent>
                                <View style={{ flex: 1 , backgroundColor: Color.secondayTextColor  }}>
                                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, paddingVertical: 10 }}>
                                        <CommonHeader
                                            containerStyle={{ flex: 1, marginHorizontal: '3%' }}
                                            headerTrue={Strings.PrivacyPolicy.privacyPolicy}
                                            headerTitleFontsize={Dimen.mediumTextSize}
                                            headerTitleColor={Color.secondayTextColor}
                                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.88, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor, height: '100%' }}>
                                        <Text style={{alignSelf: 'center', fontSize: 18}}> No Data Found</Text>
                                    </View>
                                </View>     
                </SafeAreaComponent>
        )
    };

};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
});