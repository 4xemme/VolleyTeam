import firebase from 'firebase';

class Firebase {
  static initialise() {
    const config = {
      apiKey: "AIzaSyCiLbtH-pDTMRZRT6M91Sfcm0CEpYCYfec",
      authDomain: "volleyteam-836af.firebaseapp.com",
      databaseURL: "https://volleyteam-836af.firebaseio.com",
      storageBucket: "volleyteam-836af.appspot.com",
      messagingSenderId: "835575466101"
    };

    if (!this.firebaseInstance) {
      this.firebaseInstance = firebase.initializeApp(config);
      console.log('fb initialised')
    }
  }

  static get instance() {
    return this.firebaseInstance;
  }

  static formatError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'email gia\' registrata';
      case 'auth/invalid-email':
        return 'email non valida';
      case 'auth/operation-not-allowed':
        return 'Operazione non autorizzata';
      case 'auth/weak-password':
        return 'Password non sicura';
      case 'auth/user-disabled':
        return 'Utente disabilitato';
      case 'auth/user-not-found':
        return 'Utente inesistente';
      case 'auth/wrong-password':
        return 'Password errata';
      case 'auth/network-request-failed':
        return 'Connessione non riuscita';
      default:
        return JSON.stringify(error);
    }
  }

  static subscribeAuthListener(f) {
    return this.firebaseInstance.auth().onAuthStateChanged((user) => {
      f(user);
    });
  }

  static login(email, password) {
    return new Promise((resolve, reject) => {
      this.firebaseInstance.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  static logout() {
    return new Promise((resolve, reject) => {
      this.firebaseInstance.auth().signOut()
      .then((code) => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  static signUp(email, password) {
    return new Promise((resolve, reject) => {
      this.firebaseInstance.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  static addUser(user) {
    return new Promise((resolve, reject) => {
      const userRef = this.firebaseInstance.database().ref(`/users/${user.uid}`);
      userRef.set({ email: user.email, role: 'follower' })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  static userRole(email) {
    return new Promise((resolve, reject) => {
      const users = Firebase.instance.database().ref('/users');
      users.orderByChild('email').equalTo(email).once('value')
      .then((snap) => {
        if (snap && (snap.numChildren() > 0)) {
          snap.forEach((s) => {
            resolve(s.val().role);
          });
        }
        resolve('Unknown');
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  static listenLiveGames(f) {
    this.firebaseInstance.database().ref('/games/live').on('value', f);
  }

  static unListenLiveGames(f) {
    this.firebaseInstance.database().ref('/games/live').off('value', f);
  }

  static listenLiveGame(gameKey, f) {
    this.firebaseInstance.database().ref(`/games/scores/${gameKey}`).on('value', f);
  }

  static unListenLiveGame(gameKey, f) {
    this.firebaseInstance.database().ref(`/games/scores/${gameKey}`).off('value', f);
  }
}

export default Firebase;
