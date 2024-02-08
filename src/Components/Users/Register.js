import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { auth, textdb, storage } from '../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({
    name: '',
    email: '',
    pass: '',
 
  });
 
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);



  

  const handleSubmission = async () => {
    setSubmitButtonDisabled(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.pass);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await updateProfile(user, {
            displayName: values.name,
        });

        const usersCollection = collection(textdb, 'users');
        const newUserDoc = doc(usersCollection, user.uid);

        // Add the 'role' field to the user document in Firestore
        await setDoc(newUserDoc, {
            name: values.name,
            email: values.email,
            role: 'user', // You can set the role to 'user' during registration
        });

        setSubmitButtonDisabled(false);
        toast.success('Registration successful! Please verify your email.');
        navigate('/verification-pending');
    } catch (err) {
        console.error(err.code, err.message);
        setSubmitButtonDisabled(false);
        toast.error(err.message);
    }
};

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <label>Full Name:</label>
      <input type="text" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
      <label>Email:</label>
      <input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
      <label>Password:</label>
      <input type="password" value={values.pass} onChange={(e) => setValues({ ...values, pass: e.target.value })} />
     

      <button onClick={handleSubmission} disabled={submitButtonDisabled}>
        {submitButtonDisabled ? 'Loading...' : 'Register'}
      </button>
    </div>
  );
};

export default Register;
