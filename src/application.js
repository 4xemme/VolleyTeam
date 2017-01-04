import React, { Component } from 'react';
import { Navigator, Alert, BackAndroid, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Firebase from './utils/firebase';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import Loader from './components/loader';
import Login from './components/login';
import Start from './components/start';
import LiveGames from './components/live-games';
import LiveGame from './components/live-game';
import Test from './components/test';

class Application extends Component {
  constructor(props) {
    super(props);

    Firebase.initialise();

    this.state = {
      loading: false,
      started: false,
      user: null,
      role: '',
    };

    this.backQuitApp = true;
    this._setupBackButton();
  }

  componentDidMount() {
    this._subscribeAuthListener();
  }

  componentWillUnmount() {
    console.log('Unmount')
    if (this.authListener) {
      console.log('Removing listener')
      this.authListener();
    }
  }

  _setupBackButton() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.backQuitApp) {
        return false;
      }
      this._goBack();
      return true;
    });
  }

  _subscribeAuthListener() {
    this.authListener = Firebase.subscribeAuthListener((user) => {
      console.log('Auth state changed')
      if (user) {
        console.log(`Logged as ${user.email}`)
        Firebase.userRole(user.email)
        .then((role) => {
          console.log(`Role for user ${role}`)
          this.setState({
            user,
            role,
            started: true,
          });
        });
      } else {
        console.log('Not logged')
        this.setState({
          user,
          started: true,
        });
      }
    });
    console.log(this.authListener)
  }

  _login(email, password) {
    this.setState({
      loading: true,
    });

    Firebase.login(email, password)
    .then((user) => {
      this.setState({
        loading: false,
      });
    })
    .catch((error) => {
      this.setState({
        loading: false,
      });
      Alert.alert('Errore', Firebase.formatError(error));
    });
  }

  _logout() {
    Firebase.logout()
    .then(() => {
    })
    .catch((error) => {
      Alert.alert('Errore', Firebase.formatError(error));
    });
  }

  _signUp(email, password) {
    this.setState({
      loading: true,
    });

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

    this.setState({
      loading: false,
    });
  }

  _goBack() {
    this.navigator.pop();
  }

  _renderScene(route, navigator) {
    let component = null;

    console.log(`Route to component: ${route.component}`)
    switch (route.component.toLowerCase()) {
      case 'start':
        component = <Start navigator={navigator} />;
        break;
      case 'livegames':
        component = <LiveGames navigator={navigator} />;
        break;
      case 'livegame':
        component = <LiveGame navigator={navigator} {...route.data} />;
        break;
      case 'test':
        component = <Test navigator={navigator} />;
        break;
      default:
        component = <Start navigator={navigator} />;
        break;
    }

    this.backQuitApp = route.component === 'Start';

    return component;
  }

  _navigationBarRouteMapper() {
    return {
      LeftButton: (route, navigator, index, navState) => {
        if (index === 0) {
          return null;
        }

        return (
          <TouchableOpacity style={styles.navbarTextContainer} onPress={() => navigator.pop()}>
            <MdIcon name="arrow-back" size={25} />
          </TouchableOpacity>
        );
      },
      RightButton: (route, navigator, index, navState) => {
        if (index !== 0) {
          switch (route.component.toLowerCase()) {
            case 'livegames':
              return (this.state.role === 'admin' ?
                <TouchableOpacity style={styles.navbarTextContainer} onPress={() => navigator.push({ component: 'Test' })}>
                  <MdIcon name="note-add" size={25} />
                </TouchableOpacity> :
                null
              );
            default:
              return null;
          }
        }
        return (
          <TouchableOpacity style={styles.navbarTextContainer} onPress={() => this._logout()}>
            <MdIcon name="exit-to-app" size={25} />
          </TouchableOpacity>
        );
      },
      Title: (route, navigator, index, navState) => {
        return (
          <View style={styles.navbarTextContainer}>
            <View style={styles.navbarTitle}>
              <Text>{`${this.state.user.email} `}</Text>
              <MdIcon name={this.state.role === 'admin' ? 'supervisor-account' : 'tv'} size={25} style={{ color: 'blue' }} />
            </View>
          </View>
        );
      },
    };
  }

  render() {
    if (!this.state.started) {
      return (
        <Loader />
      );
    } else if (!this.state.user) {
      return (
        <Login
          loading={this.state.loading}
          onLogin={(email, password) => this._login(email, password)}
          onSignUp={(email, password) => this._signUp(email, password)}
        />
      );
    }
    return (
      <Navigator
        ref={(n) => { this.navigator = n; }}
        initialRoute={{ component: 'Start' }}
        renderScene={(route, navigator) => { return this._renderScene(route, navigator); }}
        navigationBar={<Navigator.NavigationBar routeMapper={this._navigationBarRouteMapper()} style={styles.navbar} />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
      backgroundColor: 'rgba(52,52,52,0.3)',
      borderBottomColor: '#eee',
      borderColor: 'transparent',
      borderWidth: 1,
  },
  navbarTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  navbarTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Application;
