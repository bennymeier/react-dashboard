import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export const REACT_APP_CONFIRMATION_EMAIL_REDIRECT = 'http://localhost:3000';
const config = {
    apiKey: 'AIzaSyA050hQBZoKrcCmoe7B6C0FdA6CXG1lUJ4',
    authDomain: 'api-project-67447498504.firebaseapp.com',
    databaseURL: 'https://api-project-67447498504.firebaseio.com',
    projectId: 'api-project-67447498504',
    storageBucket: 'api-project-67447498504.appspot.com',
    messagingSenderId: '67447498504',
    appId: '1:67447498504:web:c314ebd5a7eda0dcf2aebd',
};
class Firebase {
    constructor() {
        app.initializeApp(config);

        /* Helper */

        this.serverValue = app.database.ServerValue;
        this.emailAuthProvider = app.auth.EmailAuthProvider;

        /* Firebase APIs */

        this.auth = app.auth();
        this.db = app.database();

        /* Social Sign In Method Provider */

        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();
        this.twitterProvider = new app.auth.TwitterAuthProvider();
    }

    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

    doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

    doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
            url: REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
        });

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //

    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val() || {};
                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = {};
                        }

                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // *** Message API ***
    message = uid => this.db.ref(`messages/${uid}`);
    messages = () => this.db.ref('messages');

    // *** Domains API ***
    domain = uid => this.db.ref(`domains/${uid}`);
    domains = () => this.db.ref('domains');

    // *** Customers API ***
    customer = uid => this.db.ref(`customers/${uid}`);
    customers = () => this.db.ref('customers');

    // *** Todos API ***
    todo = uid => this.db.ref(`todos/${uid}`);
    todos = () => this.db.ref('todos');
}

export default Firebase;
