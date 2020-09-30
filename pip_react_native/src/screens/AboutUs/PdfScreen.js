import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { CommonHeader, SafeAreaComponent } from '../../components';
import { Color, Dimen, Strings, URL } from '../../../res';
import Pdf from 'react-native-pdf';
import { NetworkManager } from '../../utils';


class PdfScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            error: false,
            uri: ''
        }

    }

    componentDidMount() {
        this.getPages()
    }

    render() {
        const source = {
            uri: this.state.uri,
            cache: true,

        };
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}
                StatusBarTextColor={'light-content'}

            >
                <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 0.10, backgroundColor: Color.textColor.pentaColor, paddingBottom: 20 }}>
                        <CommonHeader
                            containerStyle={{ flex: 1, marginHorizontal: '3%' }}
                            onPress={() => this.props.navigation.goBack()}
                            headerTrue={this.props.route.params.header}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                        />
                    </View>
                    <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', paddingTop: 30, backgroundColor: Color.secondayTextColor, height: '100%' }}>
                        {this.state.uri != '' && <Pdf
                            source={source}
                            onLoadComplete={(numberOfPages, filePath) => {
                            }}
                            onPageChanged={(page, numberOfPages) => {
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            style={styles.pdf}
                        />
                        }
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };



    getPages = async () => {
        let data = {}

        data.title = this.props.route.params.fileType
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getPages, URL.postRequest, true, data, () => this.getPages())
        if (res.statusCode == 200) {
            this.setState({ uri: res.data.uploaded_file })
        } else {
            console.log('FILE NOT FOUND')
        }
    }


};

export default PdfScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    pdf: {
        flexGrow: 1,

    },

});


