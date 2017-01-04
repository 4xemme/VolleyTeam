import React, { Component, PropTypes } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

class Loader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  main: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
