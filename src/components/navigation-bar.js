import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const propTypes = {
  role: PropTypes.string.isRequired,
  showBack: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

class NavigationBar extends Component {
  render() {
    return (
      <View style={styles.navbar}>
        {this.props.showBack() ?
          <TouchableOpacity onPress={() => this.props.goBack()}>
            <Icon name="arrow-back" size={30} style={{ marginRight: 10 }} />
          </TouchableOpacity> :
          null
        }
        <Text style={styles.text}>{`Connesso come: ${this.props.role}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      backgroundColor: 'rgba(52,52,52,0.3)',
      borderBottomColor: '#eee',
      borderColor: 'transparent',
      borderWidth: 1,
      justifyContent: 'flex-start',
      height: 40,
      flexDirection: 'row',
  },
});

NavigationBar.propTypes = propTypes;

export default NavigationBar;
