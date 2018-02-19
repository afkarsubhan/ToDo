import React, { Component } from 'react';
import {
    AsyncStorage,
    Button,
    KeyboardAvoidingView,
    Picker,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';
import { DotIndicator } from 'react-native-indicators';


export default class Register extends Component {
    static navigationOptions = {
        title: 'Register',
    };


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            gender: '',
            birthdate: '',
            dateHolder: null,
            isLoading: false,
        }
    }

    async saveData(data) {
        try {
            await AsyncStorage.setItem('UserAccount', JSON.stringify(data));
        } catch (error) {
            alert(error);
        }
    }

    datePickerMain = () => {
        let dateHolder = this.state.dateHolder;

        if (!dateHolder || dateHolder == null) {
            dateHolder = new Date();
            this.setState({
                dateHolder: dateHolder
            });
        }

        this.refs.DatePickerDialog.open({
            date: dateHolder,
        });
    }

    onDatePicked = (date) => {
        date: moment(date).format("MM-DD-YYYY")
        this.setState({
            birthdate: moment(date).format("MM-DD-YYYY"),
        })
    }

    register() {
        this.setState({ isLoading: true });
        const {
            username,
            password,
            gender,
            birthdate,
        } = this.state;

        if (username.length == 0) {
            alert('Username Cannot Be Empty');
            this.setState({ isLoading: false });
        } else if (username.length < 4) {
            alert('Username Minimal 5 Character');
            this.setState({ isLoading: false });
        }  else if (password.length == 0) {
            alert('Password Cannot Be Empty !!');
            this.setState({ isLoading: false });
        } else if (password.length < 7) {
            alert('Password Minimal 8 Character');
            this.setState({ isLoading: false });
        } else if (gender.length == 0) {
            alert('Gender Cannot Be Empty !!');
            this.setState({ isLoading: false });
        } else if (birthdate.length == 0) {
            alert('Birthdate Cannot Be Empty !!');
            this.setState({ isLoading: false });
        } else {
            fetch('https://ngc-todo.herokuapp.com/api//users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    gender: gender,
                    birthdate, birthdate,
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ isLoading: false });
                    if (responseJson.success == true) {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'Home' })],
                        });
                        this.saveData(responseJson.data);
                        console.log(responseJson.data)
                        this.props.navigation.dispatch(resetAction);
                    } else {
                        alert(responseJson.message)
                    }
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#537776', alignItems: 'center' }}>
                {this.state.isLoading ?
                    (<DotIndicator color='white' />
                    ) : (
                        <KeyboardAvoidingView
                            style={{ height: '80%', marginTop: '10%', backgroundColor: '#FFFFFF', width: '80%', borderRadius: 15, elevation: 1.5, alignItems: 'center', position: 'absolute' }}
                            behavior="padding">
                            <TextInput
                                style={{ height: 45, width: '90%', fontSize: 16, marginBottom: 20, marginTop: 30, backgroundColor: '#c2c6c6', borderRadius: 50, borderColor: 'gray', borderWidth: 1 }}
                                onChangeText={(username) => this.setState({ username })}
                                value={this.state.username}
                                placeholderTextColor='black'
                                underlineColorAndroid="transparent"
                                placeholder="Username"
                            />
                            <TextInput
                                style={{ height: 45, width: '90%', fontSize: 16, backgroundColor: '#c2c6c6', borderColor: 'gray', borderRadius: 50, borderWidth: 1 }}
                                onChangeText={(password) => this.setState({ password })}
                                value={this.state.password}
                                placeholderTextColor='black'
                                secureTextEntry
                                placeholder="Password"
                            />
                            <View style={{ width: '90%', backgroundColor: "#c2c6c6", marginTop: 25, padding: 15, borderRadius: 50, elevation: 0.5, justifyContent: "center", alignItems: "center", }}>
                                <Picker
                                    style={{ height: 20, width: '90%', marginLeft: -45, backgroundColor: '#c2c6c6', borderColor: 'gray', borderWidth: 1 }}
                                    selectedValue={this.state.gender}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}>
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="Male" />
                                    <Picker.Item label="Female" value="Female" />
                                </Picker>
                            </View>

                            <TextInput
                                style={{ height: 45, width: '90%', marginTop: 25, fontSize: 16, backgroundColor: '#c2c6c6', borderRadius: 50, borderColor: 'gray', borderWidth: 1 }}
                                onChangeText={(birthdate) => this.setState({ birthdate })}
                                value={this.state.birthdate}
                                placeholderTextColor='black'
                                onTouchStart={this.datePickerMain.bind(this)}
                                placeholder="Pick Birthdate"
                            />

                            <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePicked.bind(this)} />

                            <View style={{ width: '50%', backgroundColor: "#c2c6c6", marginTop: 25, padding: 12, borderRadius: 50, elevation: 0.5, justifyContent: "center", alignItems: "center", }}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => this.register()}>
                                    <Text style={{ fontSize: 17, color: 'black' }}>REGISTER</Text>
                                </TouchableOpacity>
                            </View>
                            {/* </View> */}
                        </KeyboardAvoidingView>

                    )
                }
            </View>
        )
    }
}