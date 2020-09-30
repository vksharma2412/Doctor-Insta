import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';


class BidsRecieved extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            colorSet: false,
            startCancelSession: Strings.session.startSession,
            Data: [
                {
                    "id": 1,
                    "name": "Leanne Graham",
                    "username": "Bret",
                    "email": "Sincere@april.biz",
                    "address": {
                        "street": "Kulas Light",
                        "suite": "Apt. 556",
                        "city": "Gwenborough",
                        "zipcode": "92998-3874",
                        "geo": {
                            "lat": "-37.3159",
                            "lng": "81.1496"
                        }
                    },
                    "phone": "1-770-736-8031 x56442",
                    "website": "hildegard.org",
                    "company": {
                        "name": "Romaguera-Crona",
                        "catchPhrase": "Multi-layered client-server neural-net",
                        "bs": "harness real-time e-markets"
                    }
                },
                {
                    "id": 2,
                    "name": "Ervin Howell",
                    "username": "Antonette",
                    "email": "Shanna@melissa.tv",
                    "address": {
                        "street": "Victor Plains",
                        "suite": "Suite 879",
                        "city": "Wisokyburgh",
                        "zipcode": "90566-7771",
                        "geo": {
                            "lat": "-43.9509",
                            "lng": "-34.4618"
                        }
                    },
                    "phone": "010-692-6593 x09125",
                    "website": "anastasia.net",
                    "company": {
                        "name": "Deckow-Crist",
                        "catchPhrase": "Proactive didactic contingency",
                        "bs": "synergize scalable supply-chains"
                    }
                },
                {
                    "id": 3,
                    "name": "Clementine Bauch",
                    "username": "Samantha",
                    "email": "Nathan@yesenia.net",
                    "address": {
                        "street": "Douglas Extension",
                        "suite": "Suite 847",
                        "city": "McKenziehaven",
                        "zipcode": "59590-4157",
                        "geo": {
                            "lat": "-68.6102",
                            "lng": "-47.0653"
                        }
                    },
                    "phone": "1-463-123-4447",
                    "website": "ramiro.info",
                    "company": {
                        "name": "Romaguera-Jacobson",
                        "catchPhrase": "Face to face bifurcated interface",
                        "bs": "e-enable strategic applications"
                    }
                },
                {
                    "id": 4,
                    "name": "Patricia Lebsack",
                    "username": "Karianne",
                    "email": "Julianne.OConner@kory.org",
                    "address": {
                        "street": "Hoeger Mall",
                        "suite": "Apt. 692",
                        "city": "South Elvis",
                        "zipcode": "53919-4257",
                        "geo": {
                            "lat": "29.4572",
                            "lng": "-164.2990"
                        }
                    },
                    "phone": "493-170-9623 x156",
                    "website": "kale.biz",
                    "company": {
                        "name": "Robel-Corkery",
                        "catchPhrase": "Multi-tiered zero tolerance productivity",
                        "bs": "transition cutting-edge web services"
                    }
                },
                {
                    "id": 5,
                    "name": "Chelsey Dietrich",
                    "username": "Kamren",
                    "email": "Lucio_Hettinger@annie.ca",
                    "address": {
                        "street": "Skiles Walks",
                        "suite": "Suite 351",
                        "city": "Roscoeview",
                        "zipcode": "33263",
                        "geo": {
                            "lat": "-31.8129",
                            "lng": "62.5342"
                        }
                    },
                    "phone": "(254)954-1289",
                    "website": "demarco.info",
                    "company": {
                        "name": "Keebler LLC",
                        "catchPhrase": "User-centric fault-tolerant solution",
                        "bs": "revolutionize end-to-end systems"
                    }
                },
                {
                    "id": 6,
                    "name": "Mrs. Dennis Schulist",
                    "username": "Leopoldo_Corkery",
                    "email": "Karley_Dach@jasper.info",
                    "address": {
                        "street": "Norberto Crossing",
                        "suite": "Apt. 950",
                        "city": "South Christy",
                        "zipcode": "23505-1337",
                        "geo": {
                            "lat": "-71.4197",
                            "lng": "71.7478"
                        }
                    },
                    "phone": "1-477-935-8478 x6430",
                    "website": "ola.org",
                    "company": {
                        "name": "Considine-Lockman",
                        "catchPhrase": "Synchronised bottom-line interface",
                        "bs": "e-enable innovative applications"
                    }
                },
                {
                    "id": 7,
                    "name": "Kurtis Weissnat",
                    "username": "Elwyn.Skiles",
                    "email": "Telly.Hoeger@billy.biz",
                    "address": {
                        "street": "Rex Trail",
                        "suite": "Suite 280",
                        "city": "Howemouth",
                        "zipcode": "58804-1099",
                        "geo": {
                            "lat": "24.8918",
                            "lng": "21.8984"
                        }
                    },
                    "phone": "210.067.6132",
                    "website": "elvis.io",
                    "company": {
                        "name": "Johns Group",
                        "catchPhrase": "Configurable multimedia task-force",
                        "bs": "generate enterprise e-tailers"
                    }
                },
                {
                    "id": 8,
                    "name": "Nicholas Runolfsdottir V",
                    "username": "Maxime_Nienow",
                    "email": "Sherwood@rosamond.me",
                    "address": {
                        "street": "Ellsworth Summit",
                        "suite": "Suite 729",
                        "city": "Aliyaview",
                        "zipcode": "45169",
                        "geo": {
                            "lat": "-14.3990",
                            "lng": "-120.7677"
                        }
                    },
                    "phone": "586.493.6943 x140",
                    "website": "jacynthe.com",
                    "company": {
                        "name": "Abernathy Group",
                        "catchPhrase": "Implemented secondary concept",
                        "bs": "e-enable extensible e-tailers"
                    }
                },
                {
                    "id": 9,
                    "name": "Glenna Reichert",
                    "username": "Delphine",
                    "email": "Chaim_McDermott@dana.io",
                    "address": {
                        "street": "Dayna Park",
                        "suite": "Suite 449",
                        "city": "Bartholomebury",
                        "zipcode": "76495-3109",
                        "geo": {
                            "lat": "24.6463",
                            "lng": "-168.8889"
                        }
                    },
                    "phone": "(775)976-6794 x41206",
                    "website": "conrad.com",
                    "company": {
                        "name": "Yost and Sons",
                        "catchPhrase": "Switchable contextually-based project",
                        "bs": "aggregate real-time technologies"
                    }
                },
                {
                    "id": 10,
                    "name": "Clementina DuBuque",
                    "username": "Moriah.Stanton",
                    "email": "Rey.Padberg@karina.biz",
                    "address": {
                        "street": "Kattie Turnpike",
                        "suite": "Suite 198",
                        "city": "Lebsackbury",
                        "zipcode": "31428-2261",
                        "geo": {
                            "lat": "-38.2386",
                            "lng": "57.2232"
                        }
                    },
                    "phone": "024-648-3804",
                    "website": "ambrose.net",
                    "company": {
                        "name": "Hoeger LLC",
                        "catchPhrase": "Centralized empowering task-force",
                        "bs": "target end-to-end models"
                    }
                }
            ]
        }
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 25, justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={Assets.session.sampleProfile}
                            style={{ width: 50, height: 50, marginTop: 25 }}
                        ></Image>
                        <View style={{ alignItems: 'flex-start', paddingLeft: 10, paddingTop: 25 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#474747', paddingVertical: 3 }}>
                                Jasmine Merlette
                            </Text>
                            <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, fontWeight: '700' }}>
                                {Strings.session.viewProfile}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ color: Color.textColor.pentaColor, paddingTop: 25, fontSize: 16, fontWeight: 'bold' }}>
                        $20
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: .19 }}>
                    </View>
                    <View style={{ flex: .81 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: Color.textColor.resendOtp, paddingTop: 10, paddingRight: 10 }}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting i...see more
                    </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: .19 }}>
                    </View>
                    <View style={{ flex: .81, flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 20 }}>
                        <TouchableOpacity
                            style={[styles.buttonContainer,
                            {
                                backgroundColor: this.state.startCancelSession == Strings.session.startSession ? Color.buttonColor.enableButton : Color.secondayTextColor,
                                borderWidth: 1,
                                borderColor: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton,
                            }]}
                            activeOpacity={0.8}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.startSession })
                                // this.props.navigation.navigate('')
                            }
                            }
                        >
                            <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.rejectBid}</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonSeprateView}></View>
                        <TouchableOpacity
                            style={[styles.buttonContainer,
                            {
                                backgroundColor: this.state.startCancelSession == Strings.session.cancelSession ? Color.buttonColor.enableButton : Color.secondayTextColor,
                                borderWidth: 1,
                                borderColor: this.state.startCancelSession == Strings.session.cancelSession ? Color.secondayTextColor : Color.buttonColor.enableButton,
                            }]}
                            activeOpacity={0.8}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.cancelSession })
                                // this.props.navigation.navigate('')
                            }
                            }
                        >
                            <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.cancelSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.acceptBid}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )

    }



    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <CommonHeader
                        backImage={Assets.common.blackBackButton}
                        headerTitleColor={Color.appBackgroundColor}
                        headerTtileFontWieght={'600'}
                        headerTitleFontsize={16}
                        headerTrue={'Bids Recieved'}
                    />
                </View>
                <View style={styles.bottomView}>
                    <FlatList
                        numColumns={1}
                        data={this.state.Data}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                        keyExtractor={(item, index) => `${index}_users`}
                    />
                </View>
            </View>
        )
    };
};

export default BidsRecieved;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },

    topView: {
        flex: .07,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 25
    },
    bottomView: {
        flex: .93,
        backgroundColor: Color.appBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    buttonContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderRadius: 25,
    },

});
