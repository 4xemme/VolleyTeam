import React, { Component } from 'react';
import { Navigator, Alert, BackAndroid } from 'react-native';
import Firebase from './utils/firebase';
import NavigationBar from './components/navigation-bar';
import Loader from './components/loader';
import Login from './components/login';
import Start from './components/start';
import Test from './components/test';

class Application extends Component {
  constructor(props) {
    super(props);

    Firebase.initialise();

    this.state = {
      started: false,
      user: null,
      role: '',
    };

    this.currentComponent = '';
    this._setupBackButton();

    this._subscribeAuthListener();
  }

  _canGoBack() {
    console.log(this.currentComponent)
    return this.currentComponent !== '' && this.currentComponent !== 'Start';
  }

  _setupBackButton() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (!this._canGoBack()) {
        return false;
      }
      this._goBack();
      return true;
    });
  }

  _subscribeAuthListener() {
    Firebase.subscribeAuthListener((user) => {
      console.log('Auth state changed')
      if (user) {
        Firebase.userRole(user.email)
        .then((role) => {
          this.setState({
            user,
            role,
            started: true,
          });
        });
      } else {
        this.setState({
          user,
          started: true,
        });
      }
    });
  }

  _login(email, password) {
    Firebase.login(email, password)
    .then((user) => {
    })
    .catch((error) => {
      Alert.alert('Errore', Firebase.formatError(error));
    });
  }

  _signUp(email, password) {
    Firebase.signUp(email, password)
    .then((user) => {
      Firebase.addUser(user)
      .catch((error) => {
        Alert.alert('Errore', Firebase.formatError(error));
      });
    })
    .catch((error) => {
      Alert.alert('Errore', Firebase.formatError(error));
    });
  }

  _goBack() {
    this.navigator.pop();
  } 

  _renderScene(route, navigator) {
    if (!this.state.started) {
      return (
        <Loader />
      );
    } else if (!this.state.user) {
      return (
        <Login
          onLogin={(email, password) => this._login(email, password)}
          onSignUp={(email, password) => this._signUp(email, password)}
        />
      );
    }

    let component = null;

    switch (route.component.toLowerCase()) {
      case 'start':
        component = <Start navigator={navigator} />;
        break;
      case 'test':
        component = <Test navigator={navigator} />;
        break;
      default:
        component = <Start navigator={navigator} />;
        break;
    }

    this.currentComponent = route.component;

    return component;
  }

  render() {
    return (
      <Navigator
        ref={(n) => { this.navigator = n; }}
        initialRoute={{ component: 'Start' }}
        renderScene={(route, navigator) => { return this._renderScene(route, navigator); }}
        navigationBar={<NavigationBar showBack={() => this._canGoBack()} goBack={() => this._goBack()} role={this.state.role} />}
      />
    );
  }
}

export default Application;
