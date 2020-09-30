import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image, Text, View, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';


const { width, height } = Dimensions.get('window')
import Video from 'react-native-video';
class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.videoDuration = 0
        this.state = {
            videoId: this.props.route.params ? this.props.route.params.videoId : '',
            title: this.props.route.params ? this.props.route.params.title : '',
        }
    }


    goBack = () => {
        this.props.navigation.goBack()
    }
    render() {

        return (
            <View style={{
                flex: 1,

            }}>
                <SafeAreaView>
                    <StatusBar
                        barStyle="light-content"
                    />
                    <View style={{ flexDirection: 'row', width: width }}>
                        <TouchableOpacity
                            onPress={this.goBack}
                            style={{ flex: 1, paddingLeft: 15, marginTop: Platform.OS == 'ios' ? 40 : 15 }}>
                            <Text> Back</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        backgroundColor: "black",
                        width: "100%",
                        height: 200
                    }}>

                        <Video source={{ uri: `${this.state.videoId}` }}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                                      // Store reference
                            onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            onError={this.videoError}               // Callback when video cannot be loaded
                            style={styles.backgroundVideo}
                            controls={true}
                        />




                    </View>
                    <Text style={{
                        fontSize: 20,
                        width: Dimensions.get("screen").width - 50,
                        margin: 9
                    }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {this.state.title}
                    </Text>
                    <View
                        style={{ borderBottomWidth: 1 }}
                    />
                </SafeAreaView>
            </View>
        )
    }
}
// Later on in your styles..
var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
export default VideoPlayer