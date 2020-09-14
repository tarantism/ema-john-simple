import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';

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


  initializeLoginFramework();

  const [ loggedInUser, setLoggedInUser ] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
          handleSignOut(res, true);
        })
  }

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false);
      })
  }
const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
        handleResponse(res, true);
    })
}

const handleResponse = (res, redirect) => {
        setUser(res);
        setLoggedInUser(res);
        if (redirect) {
            history.replace(from);
        }
        
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
        createUserWithEmailAndPassword(user.name, user.email, user.password)
        .then(res => {
            handleResponse(res, true);
        })
      }

      if (!newUser && user.email && user.password){
        signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
            handleResponse(res, true);
        })
      }
      e.preventDefault();
  }

   

  return (
    <div style={{textAlign: 'center'}} className="App">
    {
      user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
      <button onClick={googleSignIn}>Sign in</button>
      
    }
    <br/>
    <button onClick={fbSignIn}>Sign in using facebook</button>
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
 