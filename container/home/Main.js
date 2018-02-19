import React, { Component } from 'react';
import {
    AsyncStorage,
    FlatList,
    Image,
    Picker,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import {
    Body,
    Button,
    Container,
    Content,
    Fab,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Right,
    Title,
    View,
} from 'native-base';
import * as Animatable from 'react-native-animatable';
import Modal from "react-native-modal";
import Accordion from 'react-native-collapsible/Accordion';
import { Text } from 'react-native-animatable';
import { NavigationActions } from 'react-navigation';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';

export default class Main extends Component {
    state = {
        visibleModal: null
    };
    constructor(props) {
        super(props);
        this.state = {
            active: true,
            user: [],
            dueDate: '',
            dateHolder: null,
            taskName: '',
            status: false,
            isShow: false,
            category: [],
            data: [],

        };
    }

    setSection(section) {
        this.setState({ activeSection: section });
    }

    async getDataLogin() {
        try {
            const user = await AsyncStorage.getItem('UserAccount');
            console.log(user);
            if (user !== null) {
                this.setState({
                    user: JSON.parse(user),
                });
                this.getData();
            }
        } catch (error) {
            alert("ini 4" + error);
        }
    }

    getData() {
        const userId = this.state.user._id;
        console.log(userId);
        fetch('https://ngc-todo.herokuapp.com/api/tasks/' + userId, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == true) {
                    this.setState({
                        data: responseJson.data,
                    });
                    // this.saveData(responseJson.data);
                } else {
                    alert("ini ini" + responseJson.message)
                }
            })
            .catch((error) => {
                alert("ini 1" + error);
            });
    }

    componentWillMount() {
        this.getDataLogin();
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
            dueDate: moment(date).format("MM-DD-YYYY"),
        })
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('UserAccount');
            const value = await AsyncStorage.getItem('UserAccount')
            this.setState({ user: value });
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Login' })],
            });
            this.props.navigation.dispatch(resetAction);
        } catch (error) {
            alert(error);
        }
    }

    addTask() {
        const userData = this.state.user;
        const {
            status,
            taskName,
            dueDate,
            category,
        } = this.state;

        if (taskName.length == 0) {
            alert('Task Name Cannot Be Empty');
        } else if (dueDate.length == 0) {
            alert('Due Date Cannot Be Empty');
        } else {
            fetch('https://ngc-todo.herokuapp.com/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData._id,
                    status: status,
                    task: taskName,
                    dueDate: dueDate,
                    category: category,
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ isLoading: false });
                    if (responseJson.success == true) {
                        this.setState({ visibleModal: null })
                        // this.saveData(responseJson.data);
                        this.getData();
                        console.log(responseJson.data)
                    } else {
                        alert(responseJson.message)
                    }
                })
                .catch((error) => {
                    alert("ini 2" + error);
                });
        }

    }

    async saveData(data) {
        try {
            await AsyncStorage.setItem('UserAccount', JSON.stringify(data));
        } catch (error) {
            alert("ini 3" + error);
        }
    }

    toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });


    renderHeader(section, i, isActive) {
        return (
            <Animatable.View duration={400} style={[localStyles.header, isActive ? localStyles.active : localStyles.inactive]} transition="backgroundColor">
                <View style={localStyles.topicItem}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Title style={{ color: '#18293F' }}>{section.task}</Title>
                        </View>
                    </View>
                    {isActive ?
                        <Image
                            source={require('../../assets/arrow-down-drop-circle-outline.png')} />
                        :
                        <Image
                            source={require('../../assets/arrow-right-drop-circle-outline.png')} />
                    }
                </View>
            </Animatable.View>
        )
    }

    renderContent(section, i, isActive) {
        // const { data } = this.state;
        return (
            <Animatable.View duration={400} style={[localStyles.header, isActive ? localStyles.active : localStyles.inactive]} transition="backgroundColor">
                <View style={localStyles.topicItem}>
                    <View style={{ flex: 1 }}>
                        {/* {section.map((data, index)=>{
                            return(
                                <Title>{data}</Title>
                            )
                        })}  */}
                        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Title style={{ color: '#18293F' }}>{section.task}</Title>
                        </View> */}
                        {/* <FlatList
                            data={data}
                            renderItem={({ item }) =>
                                <ItemTask
                                    onDelete={(item) => this.deleteItem(item)}
                                    item={item}
                                    OnChecked={(item, isCheck) => this.updateIsCheck(item, isCheck)}
                                    onDatePicked={item.date}
                                />
                            }
                            extraData={this.state}
                        /> */}
                    </View>
                </View>
            </Animatable.View>
        )
    }

    render() {
        return (
            <Container>
                <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                    <Header style={{ backgroundColor: '#5067FF' }}>
                        <Body>
                            <Title style={{ fontSize: 20, fontWeight: '500', color: '#111214' }}>Home</Title>
                        </Body>
                        <Right>
                            <TouchableOpacity
                                onPress={() => this.logout()}>
                                <Title style={{ fontSize: 20, fontWeight: '500', color: '#111214' }}>LogOut</Title>
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    <View style={{ flex: 1 }}>
                        <Accordion
                            activeSection={this.state.activeSection}
                            sections={this.state.data}
                            renderHeader={this.renderHeader}
                            renderContent={this.renderContent}
                            duration={400}
                            onChange={this.setSection.bind(this)}
                        />
                        <Modal isVisible={this.state.visibleModal == 4}
                            backdropOpacity={0.5}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={1000}
                            backdropTransitionOutTiming={1000}
                        >
                            <View style={[{ width: '100%', height: 350, backgroundColor: '#FFFFFF', },]}>
                                <Container>
                                    <Header>
                                        <Body>
                                            <Title style={{ fontSize: 15, fontWeight: '500', color: '#111214' }}>Create New Task</Title>
                                        </Body>

                                        <View style={{ marginTop: 10 }}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({ visibleModal: null })}>
                                                <Image
                                                    source={require('../../assets/close-circle.png')} />
                                            </TouchableOpacity>
                                        </View>
                                    </Header>
                                    <Content>
                                        <Form>
                                            <Item fixedLabel>
                                                <Label>Task Name</Label>
                                                <Input
                                                    onChangeText={(taskName) => this.setState({ taskName })}
                                                    value={this.state.taskName}
                                                />
                                            </Item>
                                            <Item fixedLabel>
                                                <Label>Due Date</Label>
                                                <Input
                                                    onChangeText={(dueDate) => this.setState({ dueDate })}
                                                    value={this.state.dueDate}
                                                    onTouchStart={this.datePickerMain.bind(this)}
                                                />
                                                <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePicked.bind(this)} />
                                            </Item>
                                            <Item fixedLabel>
                                                <Label>Category</Label>
                                                <Picker
                                                    style={{ height: 40, width: '68%', }}
                                                    selectedValue={this.state.category}
                                                    onValueChange={(itemValue, itemIndex) => itemValue == "newCategory" ? this.setState({ isShow: true }) : this.setState({ category: itemValue })}>
                                                    <Picker.Item label="Select Category" value="Uncategories" />
                                                    <Picker.Item label="Hutang" value="Hutang" />
                                                    <Picker.Item label="Pinjaman" value="Pinjaman" />
                                                    <Picker.Item label="New Category" value="newCategory" />
                                                </Picker>
                                            </Item>
                                            {
                                                this.state.isShow == true ?
                                                    <Item fixedLabel>
                                                        <Label>New Category</Label>
                                                        <Input
                                                            onChangeText={(category) => this.setState({ category })}
                                                            value={this.state.category}
                                                        />
                                                    </Item> : null
                                            }

                                            <Body>
                                                <View style={{ width: '30%', backgroundColor: "#5067FF", marginTop: 25, padding: 12, borderRadius: 50, elevation: 0.5, marginBottom: 10 }}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => this.addTask()}>
                                                        <Text style={{ fontSize: 15, color: 'black' }}>SUBMIT</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </Body>
                                        </Form>
                                    </Content>
                                </Container>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
                <Fab
                    active={this.state.active}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setState({ visibleModal: 4 })}>
                    <Image
                        source={require('../../assets/plus.png')} />
                </Fab>
            </Container>
        );
    }
}

class ItemTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheck: false,
        };
    }

    click() {
        const {
        OnChecked,
            item
      } = this.props;
        OnChecked(item, !item.isCheck);
        // this.setState({
        //   isCheck: !this.state.isCheck
        // })
    }
    render() {
        // const { isCheck } = this.state;
        const { onDelete, item, onDatePicked } = this.props;
        return (
            <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 0.1 }}
                    onPress={() => this.click()}>
                    <Image
                        style={{ flex: 1 }}
                        source={item.isCheck ? require('../../assets/checkbox-marked.png') : require('../../assets/checkbox-blank-outline.png')}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                    <Text>{item.name}</Text>
                    <Text>{onDatePicked}</Text>
                </View>
                <TouchableOpacity
                    style={{ flex: 0.1 }}
                    onPress={() => onDelete(item)}>
                    <Image
                        style={{ flex: 1 }}
                        source={require('../../assets/delete-forever.png')}
                    />
                </TouchableOpacity>

            </View>
        )
    }
}


const localStyles = StyleSheet.create({
    header: {
        backgroundColor: '#537776',
        padding: 10,
        width: '100%'
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    topicItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 8,
        paddingLeft: 16,
        paddingRight: 8,
        borderRadius: 15,
        elevation: 1.5,
    },
})