import React, { Component } from 'react';
import {
  AsyncStorage,
  Button,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  View,
} from 'react-native';

import { DatePickerDialog } from 'react-native-datepicker-dialog';
import moment from 'moment';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      data: [],
      dateText: '',
      dateHolder: null,
    };
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
    const data = [
      ...this.state.data,{
        name : this.state.name,
        date : moment(date).format('DD-MMM-YYYY'),
        isCheck : false
      }
    ]
    this.setState({
      data: data,
      name: '',
      dateText: moment(date).format('DD-MMM-YYYY'),
    }),
    this.saveData(data);
    // // item.push({
    // //   isCheck: false,
    // //   task : this.state.name,
    // //   dobDate: date,
    // //   dateText: moment(date).format('DD-MMM-YYYY'),
    // // });
    // this.setState({
    //   data: item,
    //   name: null,
    //   // item : [...this.state.isCheck,this.state.dateText]
    //   dobDate: date,
    //   dateText: moment(date).format('DD-MMM-YYYY'),
    // });
  }

  async saveData(data) {
    try{
      await AsyncStorage.setItem('TaskItem', JSON.stringify(data));
    } catch(error){
      alert(error);
    }
  }

  updateIsCheck(item, isCheck){
    const data = this.state.data;
    const index = data.indexOf(item);
    data[index].isCheck = isCheck;
    this.setState({
      data: data,
    });
    this.saveData(data);
  }

  deleteItem(item) {
    const data = this.state.data;
    const index = data.indexOf(item);
    data.splice(index, 1);
    this.setState({
      data: data
    });
    this.saveData(data);
  }

  async componentWillMount(){
    try {
      const data = await AsyncStorage.getItem('TaskItem');
      if (data !== null){
        this.setState({
          data: JSON.parse(data),
        });
      }
    } catch (error){
      alert(error);
    }
  }


  render() {
    return (
      <ScrollView style={{ margin: 5 }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={styles.welcome}>To do List</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={{ height: '100%', width: '100%' }}
              placeholder="Enter new item"
              onSubmitEditing={this.datePickerMain.bind(this)}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}/>
            
            <DatePickerDialog ref="DatePickerDialog" onDatePicked={this.onDatePicked.bind(this)} />

          </View>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) =>
              <ItemTask
                onDelete={(item) => this.deleteItem(item)}
                item={item}
                OnChecked={(item,isCheck) => this.updateIsCheck(item, isCheck)}
                onDatePicked={item.date}
              />
            }
            extraData={this.state}
          />
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
  item: {
    fontSize: 20,
    fontWeight: '500',
    margin: 10,
    color: 'black',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  datePickerBox: {
    marginTop: 29,
    borderWidth: 0.5,
    padding: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    height: 38,
    justifyContent: 'center'
  },
  datePickerText: {
    fontSize: 14,
    marginLeft: 5,
    borderWidth: 0,
    color: '#000',

  },
});
