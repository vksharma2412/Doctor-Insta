import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Utility, NavUtil } from '../../utils';
import { Dimen, Color, Constant, Assets, Strings } from '../../../res';
import ReadMore from 'react-native-read-more-text';
import String from '../../../res/String';
import { AppButton } from '../../components';

const BidListItem = ({ item, props, onPressCallback, bid_id }) => {
    console.log("JSON.stringify(item)", bid_id)

    console.log("JSON.stringify(item)" + JSON.stringify(item))

    const _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={{ color: Color.borderColor.secondaryColor, marginTop: 5, textAlign: 'right' }} onPress={handlePress}>
                see more
            </Text>
        );
    }

    const _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={{ color: Color.borderColor.secondaryColor, marginTop: 5 }} onPress={handlePress}>
                show less
            </Text>
        );
    }

    const _handleTextReady = () => {

    }



    const acceptBid = () => {
        onPressCallback(Constant.updateBid.accept, item)
    }

    const rejectBid = () => {
        onPressCallback(Constant.updateBid.reject, item)
    }



    return (
        <TouchableOpacity style={{ width: '90%', flexDirection: 'row', overflow: 'visible', }}>

            <View style={{ flex: 0.2, alignItems: 'center' }}>
                <Image
                    style={{ height: 50, width: 50, borderRadius: 25 }}
                    source={{ uri: item.BidPostedBy[0].profile_picture }} />
            </View>
            <View style={{ flex: 0.8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.primaryTextStyle}>{item.BidPostedBy[0].name}</Text>
                        <TouchableOpacity
                            onPress={() => Utility.sharedInstance.navigation.navigate(Constant.routeName.tutorBidDetails, { tutorDetails: item, bid_id: bid_id })}
                            style={{ paddingBottom: 10 }}>
                            <Text style={styles.secondaryTextStyle}>{String.bidList.viewProfile}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={styles.priceTextStyle}>{item.currency} {item.bid_amount}</Text>
                    </View>
                </View>

                <ReadMore
                    numberOfLines={2}
                    renderTruncatedFooter={_renderTruncatedFooter}
                    renderRevealedFooter={_renderRevealedFooter}
                    onReady={_handleTextReady}>
                    <Text style={styles.readMoreStyle}>
                        {item.description}
                    </Text>
                </ReadMore>

                <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between' }}>
                    <AppButton
                        buttonStyle={{ alignSelf: 'center', width: '45%', marginBottom: 20, backgroundColor: Color.appBackgroundColor, borderColor: Color.buttonColor.enableButton, borderWidth: 1, borderRadius: 25, }}
                        onPress={rejectBid}
                        isEnabled={true}
                        // buttonText={Strings.bidList.rejectBid}
                        camelCaseText={Strings.bidList.rejectBid}
                        isUpperCase={true}
                        buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                    />

                    <AppButton
                        buttonStyle={{ alignSelf: 'center', width: '45%', marginBottom: 20 }}
                        onPress={acceptBid}
                        isEnabled={true}
                        camelCaseText={Strings.bidList.acceptBid}
                        isUpperCase={true}
                        buttonTextStyle={{ fontSize: 14 }}

                    />

                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: Color.borderColor.tertiaryColor }}></View>
            </View>

        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    readMoreStyle: {
        fontSize: 16,

        // fontWeight: font.regular,
        // color: colors.grayDarkColor,
        marginTop: 10,
        textAlign: 'justify'
    },
    primaryTextStyle: {
        paddingVertical: 5,
        fontSize: 16,
        color: Color.textColor.hexaColor
    },
    secondaryTextStyle: {
        color: Color.textColor.sessionProfileText,
        fontSize: 12
    },
    priceTextStyle: {
        fontSize: 16,
        color: Color.textColor.pentaColor

    }
});

export default BidListItem;