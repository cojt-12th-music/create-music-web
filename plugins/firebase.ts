import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { Music } from '~/types/music'

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

const createFireRepository = <T>(
  collection: firebase.firestore.CollectionReference
) => ({
  index(): Promise<firebase.firestore.QuerySnapshot> {
    return collection.get()
  },
  create(payload: T): Promise<T> {
    return collection
      .add(payload)
      .then((ref) => ref.get())
      .then((doc) => ({ ...(doc.data() as T), id: doc.id }))
  },
  show(id: string): Promise<T> {
    return collection
      .doc(id)
      .get()
      .then((doc) => {
        const data = doc.data() as T
        return { ...data, id: doc.id }
      })
  },
  update(id: string, payload: T): Promise<void> {
    return collection.doc(id).set(payload)
  },
  delete(id: string): Promise<void> {
    return collection.doc(id).delete()
  }
})

export const db = firebase.firestore()

export const firestoreAccessor = {
  scores: createFireRepository<Music>(db.collection('scores'))
}

export const firebaseAuth = firebase.auth
export const twitterProvider = new firebase.auth.TwitterAuthProvider()
