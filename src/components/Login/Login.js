import React, { useContext, useState } from 'react';


import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';


firebase.initializeApp(firebaseConfig);



function Login() {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
    // error: '',
    // success: ''
  });

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);



  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
    //   console.log(displayName, photoURL, email);
      
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(signInUser);
    //   console.log(displayName, photoURL, email);
    })
    .catch(err => {
      console.log(err.message);
    })
  }
  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log('fb user after sign in', user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        console.log(errorCode, errorMessage)
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        error: '',
        success: false
      }
      setUser(signedOutUser);
    }).catch(err => {
      // An error happened.
    });
  }

  const handleBlur = (e) => {
    // debugger;
    let isFieldValid = true; 
    console.log(e.target.value, e.target.name)
    if (e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber =  /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
      console.log(isPasswordValid && passwordHasNumber);    
    }
    if (isFieldValid){
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
    }
  }
  
  const handleSubmit = (e) => {
    // debugger;
      if (newUser && user.email && user.password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
            const newUserInfo = {...user};
            newUserInfo.error = '';
            newUserInfo.success = true;
            setUser(newUserInfo);
            updateUserName(user.name);
        })
        .catch( error => {
            // Handle Errors here.
            const newUserInfo = {...user};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            setUser(newUserInfo);
            // ...
        });
      }

      if (!newUser && user.email && user.password){
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then( res => {
            const newUserInfo = {...user};
            newUserInfo.error = '';
            newUserInfo.success = true;
            setUser(newUserInfo);
            console.log('sign in user info', res.user);
        })
        .catch(function(error) {
            // Handle Errors here.
            const newUserInfo = {...user};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            setUser(newUserInfo);
            // ...
          });
      }
      e.preventDefault();
  }

   const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
        console.log('user name updated sucessfully')
      // Update successful.
    }).catch(function(error) {
        console.log(error)
      // An error happened.
    });
   }

  return (
    <div style={{textAlign: 'center'}} className="App">
    {
      user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
      <button onClick={handleSignIn}>Sign in</button>
      
    }
    <br/>
    <button onClick={handleFbSignIn}>Sign in using facebook</button>
    {
      user.isSignedIn && <div>
      <p> Welcome, {user.name}!</p>
      <p>Your email: {user.email}</p>
      <img src={user.photo} alt=""/>
      </div>
    }


    <h1>Our own Authentication</h1>
    <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" required/> 
        <br/>
        <input type="submit" value={newUser ? "Sign up" : "Sign in"}/>    
    </form>
    <p style={{color: 'red'}}>{user.error}</p>
    {user.success && <p style={{color: 'green'}}>User {newUser ? 'created' : 'logged in'} successfully</p>}
    </div>
  );
}

export default Login;
 