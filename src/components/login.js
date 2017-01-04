import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const propTypes = {
  loading: PropTypes.bool.isRequired,
  onLogin: PropTypes.func.isRequired,
  onSignUp: PropTypes.func.isRequired,
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  _renderLogIn() {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => this.props.onLogin(this.state.email, this.state.password)}
      >
        <Text style={styles.button}>Accedi</Text>
      </TouchableOpacity>
    );
  }

  _renderSignIn() {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => this.props.onSignUp(this.state.email, this.state.password)}
      >
        <Text style={styles.button}>Registrati</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          {this.props.loading ?
            <ActivityIndicator size="large" /> : null
          }
          <Text style={styles.text}>email</Text>
          <TextInput style={styles.input} onChangeText={text => this.setState({ email: text })} />
          <Text style={styles.text}>password</Text>
          <TextInput style={styles.input} secureTextEntry onChangeText={text => this.setState({ password: text })} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {this._renderLogIn()}
            {this._renderSignIn()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  main: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
    marginLeft: 20,
    fontSize: 24,
  },
  input: {
    color: 'black',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    margin: 5,
  },
  button: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 22,
    padding: 3,
    borderRadius: 5,
  },
});

Login.propTypes = propTypes;

export default Login;
