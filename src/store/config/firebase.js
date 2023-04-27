import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/functions';

import config from "./config.firebase";
firebase.initializeApp(config);
firebase.analytics();
firebase.firestore();
firebase.functions();

export default firebase;
