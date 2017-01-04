import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Firebase from '../utils/firebase';

const propTypes = {
  navigator: PropTypes.object.isRequired,
};

class LiveGames extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      games: [],
    };

    this.gamesChanged = snap => this._gamesChanged(snap);
  }
  
  componentDidMount() {
    Firebase.listenLiveGames(this.gamesChanged);
  }

  componentWillUnmount() {
    Firebase.unListenLiveGames(this.gamesChanged);
  }

  _gamesChanged(snap) {
    const games = [];
    snap.forEach((s) => {
      games.push({
        key: s.key,
        data: s.val(),
      });
    });
    this.setState({
      games,
    });
  }

  _gameItem(game) {
    return `${game.homeTeam} vs ${game.visitorTeam} @ ${game.location}`;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <ScrollView>
            {this.state.games.map((g) => {
              return (
                <TouchableOpacity
                  key={g.key}
                  onPress={() => this.props.navigator.push({
                    component: 'LiveGame', data: { gameSummary: g },
                  })}
                >
                  <Text>{this._gameItem(g.data)}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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

LiveGames.propTypes = propTypes;

export default LiveGames;
