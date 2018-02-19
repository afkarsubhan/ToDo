import Login from './login/Login';
import Register from './register/Register';
import Home from './home/Home';
import Main from './home/Main';
import { StackNavigator } from 'react-navigation';
  
export default StackNavigator({
    Login : {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    Register : {
        screen : Register,
    },
    Main : {
        screen : Main,
        navigationOptions: {
            header: null
        }
    },
    Home : {
        screen : Home,
        navigationOptions: {
            header: null
        }
    },
})