import React, { useState } from 'react';
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
        navigate('/chat');
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
        console.error('Sign-in error:', err);
      });
  };

  const handleForgotPassword = async () => {
    setForgotPasswordClicked(true);
    if (!values.email) {
      setErrorMsg('Please enter your email');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, values.email);
      setErrorMsg('Password reset email sent. Check your inbox.');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="logmain">
      <div className="auth-container">
        <h2>Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}


        
        {forgotPasswordClicked ? (
          <>
            <label>Email:</label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        {forgotPasswordClicked ? (
          <button onClick={handleForgotPassword}>Send Reset Email</button>
        ) : (
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            Login
          </button>
        )}
        {!forgotPasswordClicked && (
          <p className='forgotpass' onClick={handleForgotPassword}>
            <b>Forgot Password?</b>
          </p>
        )}
        <p>
          {forgotPasswordClicked ? (
            <button onClick={() => setForgotPasswordClicked(false)}>Go Back</button>
          ) : (
            <p className='linkk'>
           Don't have an account?  <Link  to="/register"> Click here to Register</Link>
            </p>
          )}
      
        </p>
      </div>
    </div>
  );
};

export default Login;
