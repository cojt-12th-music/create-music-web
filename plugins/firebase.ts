import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyAaEDTy_mldrO6YQzjZ5435Yx9IkMx-Qxk',
    authDomain: 'create-music-web.firebaseapp.com',
    databaseURL: 'https://create-music-web.firebaseio.com',
    messagingSenderId: '463511103386',
    projectId: 'create-music-web',
    storageBucket: 'create-music-web.appspot.com'
  })
}

export const db = firebase.firestore()
