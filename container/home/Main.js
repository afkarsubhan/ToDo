import React, { Component } from 'react';
import {
    AsyncStorage,
    Image,
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
            user: '',
            dueDate: '',
            dateHolder: null,
            taskName: '',
            data: [
                {
                    _id: '11111',
                    userId: '11111',
                    status: 'false',
                    task: 'Task 1',
                    dueDate: '2018-02-20T00:00:00Z',
                    createdAt: '2018-02-20T00:00:00Z',
                    updatedAt: '2018-02-20T00:00:00Z',
                    __v: '0',
                },
                {
                    _id: '22222',
                    userId: '22222',
                    status: 'false',
                    task: 'Task 2',
                    dueDate: '2018-02-20T00:00:00Z',
                    createdAt: '2018-02-20T00:00:00Z',
                    updatedAt: '2018-02-20T00:00:00Z',
                    __v: '0',
                },
                {
                    _id: '33333',
                    userId: '33333',
                    status: 'false',
                    task: 'Task 3',
                    dueDate: '2018-02-20T00:00:00Z',
                    createdAt: '2018-02-20T00:00:00Z',
                    updatedAt: '2018-02-20T00:00:00Z',
                    __v: '0',
                },
            ],
        };
    }

    setSection(section) {
        this.setState({ activeSection: section });
    }

    async componentWillMount() {
        try {
            const value = await AsyncStorage.getItem('UserAccount');
            this.setState({ user: value });
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
        return (
            <Animatable.View duration={400} style={[localStyles.header, isActive ? localStyles.active : localStyles.inactive]} transition="backgroundColor">
                <View style={localStyles.topicItem}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Title style={{ color: '#18293F' }}>{section.task}</Title>
                        </View>
                    </View>
                </View>
            </Animatable.View>
        )
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <Container>
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
                        <Fab
                            active={this.state.active}
                            direction="up"
                            style={{ backgroundColor: '#5067FF' }}
                            position="bottomRight"
                            onPress={() => this.setState({ visibleModal: 4 })}>
                            <Image
                                source={require('../../assets/plus.png')} />
                        </Fab>
                        <Modal isVisible={this.state.visibleModal == 4}
                            backdropOpacity={0.5}
                            animationIn="zoomInDown"
                            animationOut="zoomOutUp"
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={1000}
                            backdropTransitionOutTiming={1000}
                        >
                            <View style={[{ width: '100%', height: 250, backgroundColor: '#FFFFFF', },]}>
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
                                            <Item fixedLabel last>
                                                <Label>Due Date</Label>
                                                <Input
                                                    onChangeText={(dueDate) => this.setState({dueDate})}
                                                    value={this.state.dueDate}
                                                    onTouchStart={this.datePickerMain.bind(this)}
                                                />
                                                <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePicked.bind(this)} />
                                            </Item>
                                        </Form>
                                    </Content>
                                </Container>
                            </View>
                        </Modal>
                    </View>
                </Container>
            </ScrollView>
        );
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