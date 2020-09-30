import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { AppButton, AppImageComponent } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, AsyncStorageValues } from '../../../res/index';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { _storeData } from '../../utils/Utility';


const IntroScreen = (props) => {
    const [item, setItem] = useState([
        {
            key: 1,
            image: Assets.tutor.tutor_discoverSession,
            header: Strings.Intro.discoverTeacherHeader,
            description: Strings.Intro.discoverDesc,
            color: Color.introColor.primaryColor,
            bottomImage: Assets.common.yellowCut

        },
        {
            key: 11,
            image: Assets.tutor.tutor_bookSession,
            header: Strings.Intro.bookSessionHeader,
            description: Strings.Intro.bookSessionDesc,
            color: Color.introColor.secondaryColor,
            bottomImage: Assets.common.greenCut

        },
        {
            key: 111,
            image: Assets.tutor.tutor_enjoySession,
            header: Strings.Intro.enjoySessionHeader,
            description: Strings.Intro.enjoySessionDesc,
            color: Color.introColor.tertiaryColor,
            bottomImage: Assets.common.redCut

        },
    ])
    const [currentPagIndex, setcurrentPagIndex] = useState(0)
    const listRef = useRef(null);

    const _onChangeIndex = async (item) => {
        let current = listRef.current.getCurrentIndex();
        let prev = listRef.current.getPrevIndex();
        setcurrentPagIndex(current);
        return current
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column', }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, }}
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        {carousalView()}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            {getStartedButton()}
        </KeyboardAvoidingView>
    )

    function carousalView() {
        return (
            <View style={{ flexGrow: 1, }}>
                <View style={{ flex: 0.5, backgroundColor: 'white' }}>
                    <SwiperFlatList
                        ref={listRef}
                        autoplay
                        autoplayDelay={6}
                        autoplayLoop
                        onChangeIndex={_onChangeIndex}>
                        {item && item.map((_obj) => {
                            return (
                                <View style={{ width: Dimen.phoneWidth }}>
                                    <AppImageComponent
                                        backgroundColor={_obj.color}
                                        src={_obj.image}
                                        bottomImg={_obj.bottomImage}
                                    />
                                </View>
                            )
                        })}
                    </SwiperFlatList>
                </View>
                <View style={{ flex: 0.5, backgroundColor: item[currentPagIndex].color }}>
                    <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 60 }}>
                        <View style={{
                            flexDirection: 'row',
                            paddingTop: 40,
                            justifyContent: 'center'
                        }}>
                            {item && item.map((_obj, index) => {
                                return (
                                    <View style={{ marginHorizontal: 10, }}>
                                        <View style={{
                                            height: carousalIndexMatcher(index) ? 10 : 6,
                                            width: carousalIndexMatcher(index) ? 10 : 6,
                                            borderRadius: 5,
                                            backgroundColor: index === currentPagIndex ? item[currentPagIndex].color : Color.introColor.disabledDots
                                        }} />
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            flex: 1,
                            paddingLeft: 40,
                            paddingRight: 40,
                            alignItems: 'center'
                        }}>
                            <Text style={Styles.textHeader}>{item[currentPagIndex].header}</Text>
                            <Text style={styles.textDesc}>{item[currentPagIndex].description}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    function getStartedButton() {
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'white', padding: 20 }}>
                <AppButton
                    buttonStyle={{ alignSelf: 'center', width: '100%' }}
                    onPress={() => {
                        onPressStarted()
                    }}
                    isEnabled={true}
                    buttonText={Strings.Intro.buttonText} />
            </View>
        )
    }

    function onPressStarted() {
        _storeData(AsyncStorageValues.intro, 'true')
            .then(() => {
                props.navigation.navigate('Login')
            }).catch((e) => {
            })

    }


    function carousalIndexMatcher(index) {
        return index === currentPagIndex
    }


};

export default IntroScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    textDesc: {
        marginTop: 20,
        color: Color.textColor.secondaryColor,
        fontSize: Dimen.smallTextSize,
        lineHeight: 25,
        textAlign: 'center'

    },
    buttonStyle: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20
    },
    textStyle: {
        fontSize: 14
    },
    child: {
        height: 400,
        width: '100%',
        justifyContent: 'center'
    },

    Pagincontainer: {
        position: 'absolute',
        flexDirection: 'row',
        // marginVertical: ,
        justifyContent: 'center',
        bottom: 0,
        width: '100%',
    },
    pagination: {
        width: 10,
        height: 10,
        borderRadius: 25,
        marginHorizontal: Dimen.phoneWidth,
        backgroundColor: 'orange'
    },
});
