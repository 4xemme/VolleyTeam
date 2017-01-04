import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Firebase from '../utils/firebase';

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
    };
  }

  componentDidMount() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.on('value', (snap) => {
      const currentTeams = [];
      snap.forEach((s) => {
        currentTeams.push(s.val());
      });
      this.setState({ teams: currentTeams });
    });
  }

  _write() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.push({ name: 'Under 18' });
    teams.push({ name: '3a Divisione' });
    
    const liveGames = Firebase.instance.database().ref('/games/live');

    let game = liveGames.push({
      date: '2017-01-03',
      location: 'Paladiamante',
      championship: 'Prima Divisione',
      homeTeam: 'AACV',
      visitorTeam: 'Santa Sabina',
    });
    let score = Firebase.instance.database().ref(`/games/scores/${game.key}`);
    score.set({
      currentSet: 0,
      sets: [
        { home: 10, visitors: 5 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
      ],
    });

    game = liveGames.push({
      date: '2017-01-03',
      location: 'Scuola Caffaro',
      championship: 'Terza Divisione',
      homeTeam: 'Amatori',
      visitorTeam: 'Virtus Sestri',
    });
    score = Firebase.instance.database().ref(`/games/scores/${game.key}`);
    score.set({
      currentSet: 1,
      sets: [
        { home: 25, visitors: 15 },
        { home: 2, visitors: 12 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
      ],
    });

    const endedGames = Firebase.instance.database().ref('/games/ended');

    game = endedGames.push({
      date: '2017-01-03',
      location: 'Via Giotto',
      championship: 'Under 16',
      homeTeam: 'Sestri Volley',
      visitorTeam: 'Amatori',
    });
    score = Firebase.instance.database().ref(`/games/scores/${game.key}`);
    score.set({
      currentSet: 2,
      sets: [
        { home: 25, visitors: 15 },
        { home: 25, visitors: 12 },
        { home: 25, visitors: 1 },
        { home: 0, visitors: 0 },
        { home: 0, visitors: 0 },
      ],
    });
  }

  _read() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.once('value')
    .then(snapshot => {
      console.log(snapshot.val())
    })
    .catch((error) => {
      console.log(error.message);
    });
    const games = Firebase.instance.database().ref('/games/live');
    games.once('value')
    .then(snapshot => {
      snapshot.forEach((s) => {
        console.log(s.val().location)
        console.log(s.val().sets[1])
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  _add() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.push({ name: 'Under 16' });
  }

  _remove() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.orderByChild('name').equalTo('Under 16').once('value')
    .then(snapshot => {
      console.log(snapshot.val())
      if (snapshot && (snapshot.numChildren() > 0)) {
        snapshot.forEach((s) => {
          console.log(s.key);
          const tbr = teams.child(s.key);
          tbr.remove();
        });
      } else {
        console.log('Not found')
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  _search() {
    const teams = Firebase.instance.database().ref('/teams');
    teams.orderByChild('name').equalTo('Under 16').once('value')
    .then(snapshot => {
      console.log(snapshot.val())
      if (snapshot && (snapshot.numChildren() > 0)) {
        snapshot.forEach((s) => {
          console.log(s.key);
          console.log(s.val().name);
        });
      } else {
        console.log('Not found')
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
  }

  _renderTeams() {
    if (!this.state.teams) {
      return null;
    }
    return this.state.teams.map((t) => {
      return <Text key={t.name}>{`${t.name}`}</Text>
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.text}>Start</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._write()}
          >
            <Text style={styles.button}>Write</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._read()}
          >
            <Text style={styles.button}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._add()}
          >
            <Text style={styles.button}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._remove()}
          >
            <Text style={styles.button}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this._search()}
          >
            <Text style={styles.button}>Search</Text>
          </TouchableOpacity>
          <View>
            {this._renderTeams()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  main: {
    flex: 1,
    marginTop: 60,
  },
  text: {
    color: 'blue',
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

export default Test;
