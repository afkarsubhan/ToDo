import React, { Component } from 'react';
import {
    AsyncStorage,
    Button,
    KeyboardAvoidingView,
    TextInput,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { DotIndicator } from 'react-native-indicators';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
        }
    }

    async saveData(data) {
        try{
          await AsyncStorage.setItem('UserAccount', JSON.stringify(data));
        } catch(error){
          alert(error);
        }
      }

    login() {
        this.setState({isLoading: true});
        const {
            username,
            password,
        } = this.state;
       
        if (username.length == 0) {
            alert('Username Cannot Be Empty');
            this.setState({isLoading: false});
        } else if(password.length == 0){
            alert('Password Cannot Be Empty !!');
            this.setState({isLoading: false});
        } else {
        fetch('https://ngc-todo.herokuapp.com/api//users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                 this.setState({isLoading: false});
                if(responseJson.success == true){
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Main' })],
                  });
                  this.saveData(responseJson.data);
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
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#537776', justifyContent: 'center', alignItems: 'center' }}>

                {this.state.isLoading ? (
                    <DotIndicator color='white' />
                ) : (                
                    <KeyboardAvoidingView
                        style={{ flex: 0.7, backgroundColor: '#FFFFFF', width: '80%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 15, elevation: 1.5, alignItems: 'center', position: 'absolute' }}
                        behavior="padding">
                        {/* <View style={{ backgroundColor: '#FFFFFF', width: '80%', height: '50%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 15, elevation: 1.5, alignItems: 'center' }}> */}
                        <Text style={{ fontSize: 33, fontStyle: 'italic', fontWeight: '500' }}>LOGIN TODO</Text>
                        <TextInput
                            style={{ height: 40, width: '90%', marginBottom: 20, marginTop: 40, backgroundColor: '#c2c6c6', borderColor: 'gray', borderRadius: 25, borderWidth: 1 }}
                            onChangeText={(username) => this.setState({ username })}
                            value={this.state.username}
                            underlineColorAndroid="transparent"
                            placeholder="Username"
                        />
                        <TextInput
                            style={{ height: 40, width: '90%', marginBottom: 25, backgroundColor: '#c2c6c6', borderColor: 'gray', borderRadius: 25, borderWidth: 1 }}
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}
                            secureTextEntry={true}
                            placeholder="Password"
                        />
                        <TouchableOpacity
                            style={{ marginBottom: 15, right: -30 }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{ color: 'black', fontSize: 15, fontStyle: 'italic' }}>You Don't Have Account</Text>
                        </TouchableOpacity>
                        <View style={{ width: '50%', backgroundColor: "#c2c6c6", marginTop: 5, marginBottom:10, padding: 12, borderRadius: 50, elevation: 0.5, justifyContent: "center", alignItems: "center", }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.login()}>
                                <Text>LOGIN</Text>
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