import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const propTypes = {
  navigator: PropTypes.object.isRequired,
};

class Start extends Component {
  _liveGames() {
    this.props.navigator.push({ component: 'LiveGames' });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._liveGames()}
          >
            <Text style={styles.button}>Partite live</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._liveGames()}
          >
            <Text style={styles.button}>Partite terminate</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 60,
  },
  buttonContainer: {
    margin: 5,
  },
  button: {
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'black',
    fontSize: 22,
    padding: 3,
    borderRadius: 5,
  },
});

Start.propTypes = propTypes;

export default Start;
