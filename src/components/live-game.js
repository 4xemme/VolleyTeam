import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Firebase from '../utils/firebase';

const propTypes = {
  gameSummary: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
};

class LiveGame extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      score: null,
    };

    this.gameChanged = snap => this._gameChanged(snap);
  }
  
  componentDidMount() {
    Firebase.listenLiveGame(this.props.gameSummary.key, this.gameChanged);
  }

  componentWillUnmount() {
    Firebase.unListenLiveGame(this.props.gameSummary.key, this.gameChanged);
  }

  _gameChanged(snap) {
    this.setState({
      score: snap.val(),
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <ScrollView>
            <Text>{this.props.gameSummary.data.homeTeam}</Text>
            {this.state.score ?
              <View>
                <Text>{this.state.currentSet}</Text>
                <Text>{`${this.state.score.sets[this.state.score.currentSet].home} - ${this.state.score.sets[this.state.score.currentSet].visitors}`}</Text>
              </View> :
              null
            }
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cyan',
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

LiveGame.propTypes = propTypes;

export default LiveGame;
