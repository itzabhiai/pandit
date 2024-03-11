import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    pass: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      navigate('/service');
    }
  }, [navigate]);

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg('Fill all fields');
      return;
    }
    setErrorMsg('');

    setSubmitButtonDisabled(true);
    signInWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        console.log('User signed in successfully:', res.user);
        
        // Save user email and login status to session storage
        sessionStorage.setItem('userEmail', values.email);
        sessionStorage.setItem('isLoggedIn', true);

        // Navigate to currentUser.uid if user is logged in
        if (res.user) {
          navigate(`/service`);
        } else {
          // Navigate to default route if user is not logged in
          navigate('/'); // Modify this according to your default route
        }
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
        console.error('Sign-in error:', err);
      });
  };

  return (
    <div className="logmain">
      <div className="auth-container">
        <h2>Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}

        <label>Email:</label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <label>Password:</label>
        <input
          type="password"
          value={values.pass}
          onChange={(e) => setValues({ ...values, pass: e.target.value })}
        />

        <button onClick={handleSubmission} disabled={submitButtonDisabled}>
          Login
        </button>

        <p className='forgotpass' onClick={() => setForgotPasswordClicked(true)}>
          <b>Forgot Password?</b>
        </p>

        <p className='linkk'>
          Don't have an account? <Link to="/register">Click here to Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
