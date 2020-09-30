import { Color } from '../../res/index';
import React, { Component } from 'react'
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native'

export default class OtpBox extends Component {

    constructor(props) {
        super(props)
        this.state = {
            a: '',
            b: '',
            c: '',
            d: '',
            e: '',
            f: '',
        }
    }

    getinput() {
        return this.state.a +
            this.state.b +
            this.state.c +
            this.state.d +
            this.state.e +
            this.state.f
    }

    clearViea() {
        this.setState({ a: '', b: '', c: '', d: '', e: '', f: '' })
        this.refs.a.focus()
    }
    componentDidMount = () => {
        // this.setText();
    }
    setText(otpNumber) {
        if (otpNumber.length == 6) {
            let otpArr = otpNumber.split('');
            this.setState({ a: otpArr[0], b: otpArr[1], c: otpArr[2], d: otpArr[3], e: otpArr[4], f: otpArr[5] })

        }
    }
    setCode(otpnumber) {
        if (this.state.a == '') {
            this.setState({
                a: otpnumber
            })
        }

    }
    componentWillReceiveProps = (prevProps, prevState) => {



        if (prevProps != undefined) {
            if (prevProps.otpCode[0] != undefined && prevProps.otpCode[0].length == 6) {

                let otpNumber = prevProps.otpCode[0].toString().split('');;
                this.setState({
                    a: otpNumber[0],
                    b: otpNumber[1],
                    c: otpNumber[2],
                    d: otpNumber[3],
                    e: otpNumber[4],
                    f: otpNumber[5],
                })
            }
        }
    }

    render() {
        return (
            <View style={[{ marginVertical: 5 }, this.props.containerStyle,]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <View style={[styles.digitWrapper, this.props.digitWrapper]}>

                            <TextInput
                                {...this.props}
                                value={this.state.a}
                                ref={'a'}
                                maxLength={1}
                                keyboardType={'number-pad'}
                                textContentType={'oneTimeCode'}
                                secureTextEntry={false}
                                onFocus={() => this.setState({ a: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                style={[styles.digitInput, this.props.digitInput]}
                                onChangeText={a => {
                                    if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                    if (this.state.a.length == 0 && a.length != 0) { }
                                    this.refs.b.focus()
                                    this.setState({ a: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))
                                }}
                            />
                        </View>
                        <View style={[styles.digitWrapper, this.props.digitWrapper]}>
                            <TextInput
                                {...this.props}
                                value={this.state.b}
                                ref={'b'}
                                keyboardType={'number-pad'}
                                textContentType={'oneTimeCode'}
                                maxLength={1}
                                secureTextEntry={false}
                                onFocus={() => this.setState({ b: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                style={[styles.digitInput, this.props.digitInput]}
                                onChangeText={a => {
                                    if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                    if (this.state.b.length != 0 && a.length == 0) { }
                                    else
                                        this.refs.c.focus()
                                    this.setState({ b: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))
                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace') {
                                        if (this.state.b == '') {
                                            this.refs.a.focus();
                                            this.setState({ a: '' })  // modified
                                        }
                                    }
                                }}
                            />
                        </View>
                        <View style={[styles.digitWrapper, this.props.digitWrapper]}>
                            <TextInput
                                {...this.props}
                                value={this.state.c}
                                ref={'c'}
                                secureTextEntry={false}
                                contextMenuHidden={true}
                                keyboardType={'number-pad'}
                                textContentType={'oneTimeCode'}
                                maxLength={1}
                                onFocus={() => this.setState({ c: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                style={[styles.digitInput, this.props.digitInput]}
                                onChangeText={a => {
                                    if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                    if (this.state.c.length != 0 && a.length == 0) { }
                                    else if (a != '') {
                                        this.refs.d.focus()
                                    }
                                    else
                                        this.refs.d.focus()
                                    this.setState({ c: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))
                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace') {
                                        if (this.state.c == '') {
                                            this.refs.b.focus()
                                            this.setState({ b: '' })   // modified
                                        }
                                    }
                                }}
                            />
                        </View>
                        <View style={[styles.digitWrapper, this.props.digitWrapper]}>

                            <TextInput
                                {...this.props}
                                value={this.state.d}
                                ref={'d'}
                                secureTextEntry={false}
                                contextMenuHidden={true}
                                keyboardType={'number-pad'}
                                textContentType={'oneTimeCode'}
                                maxLength={1}
                                onFocus={() => this.setState({ d: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                style={[styles.digitInput, this.props.digitInput]}
                                onChange={text => {
                                }}
                                onChangeText={a => {
                                    if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                    if (this.state.d.length != 0 && a.length == 0) { }

                                    else this.refs.e.focus()
                                    this.setState({ d: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))

                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace') {
                                        if (this.state.d == '') {
                                            this.refs.c.focus();
                                            this.setState({ c: '' })  // modified
                                        }
                                    }
                                }}
                            />
                        </View>
                        {
                            this.props.length != 4 &&
                            <View style={[styles.digitWrapper, this.props.digitWrapper]}>
                                <TextInput
                                    {...this.props}
                                    value={this.state.e}
                                    ref={'e'}
                                    secureTextEntry={false}
                                    contextMenuHidden={true}
                                    maxLength={1}
                                    keyboardType={'number-pad'}
                                    textContentType={'oneTimeCode'}
                                    onFocus={() => this.setState({ e: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                    style={[styles.digitInput, this.props.digitInput]}
                                    onChangeText={a => {
                                        if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                        if (this.state.e.length != 0 && a.length == 0) { }
                                        else
                                            this.refs.f.focus()
                                        this.setState({ e: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))
                                    }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            if (this.state.e == '') {
                                                this.refs.d.focus();
                                                this.setState({ d: '' })   // modified
                                            }
                                        }
                                    }}
                                />
                            </View>
                        }
                        {
                            this.props.length != 4 &&
                            <View style={[styles.digitWrapper, this.props.digitWrapper]}>
                                <TextInput
                                    {...this.props}
                                    value={this.state.f}
                                    ref={'f'}
                                    secureTextEntry={false}
                                    contextMenuHidden={true}
                                    maxLength={1}
                                    keyboardType={'number-pad'}
                                    textContentType={'oneTimeCode'}
                                    onFocus={() => this.setState({ f: '' }, () => this.props.onComplete && this.props.onComplete(this.getinput()))}
                                    style={[styles.digitInput, this.props.digitInput]}
                                    onChangeText={a => {
                                        if (a.includes(',') || a.includes('.') || a.includes('-') || a.includes(' ')) return
                                        if (this.state.f.length != 0 && a.length == 0) { }
                                        this.setState({ f: a }, () => this.props.onComplete && this.props.onComplete(this.getinput()))
                                    }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            if (this.state.f == '') {       // modified 5/20/2020
                                                this.refs.e.focus()
                                                this.setState({ e: '' })   // modified 5/20/2020
                                            }
                                        }
                                    }}
                                />
                            </View>
                        }
                    </View>

                    {this.props.info ? <TouchableOpacity style={{
                        marginLeft: 15,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'grey',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: '500', textAlign: 'center', color: '#fff' }}>i</Text>
                    </TouchableOpacity> : <View />}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    digitWrapper: {
        borderBottomColor: Color.textColor.tertiary,
        borderBottomWidth: 1,
        marginHorizontal: 10,
        height: 50,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    digitInput: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '500'
    },
});