import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth, textdb } from '../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [values, setValues] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        city: '',
        requestedRole: '', 
        qualification: '',
    });

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = async () => {
        setSubmitButtonDisabled(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await sendEmailVerification(user);

            await updateProfile(user, {
                displayName: values.name,
            });

            const usersCollection = collection(textdb, 'users');
            const newUserDoc = doc(usersCollection, user.uid);

            // Add user details including join timestamp and requested role
            await setDoc(newUserDoc, {
                name: values.name,
                email: values.email,
                role: 'pending', // Default role is 'pending'
                city: values.city,
                qualification: values.qualification,
                joinTimestamp: new Date().getTime(),
                requestedRole: values.requestedRole, // Set requested role
            });

            setSubmitButtonDisabled(false);
            toast.success('Registration successful! Please verify your email.');
            setActiveTab(2); // Move to OTP verification tab
        } catch (err) {
            console.error(err.code, err.message);
            setSubmitButtonDisabled(false);
            toast.error(err.message);
        }
    };

    const renderTabs = () => {
        switch (activeTab) {
            case 1:
                return (
                    <>
                        <label>Full Name:</label>
                        <input type="text" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
                        <label>Email:</label>
                        <input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
                        <label>Mobile:</label>
                        <input type="text" value={values.mobile} onChange={(e) => setValues({ ...values, mobile: e.target.value })} />
                        <label>Password:</label>
                        <input type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
                        <label>Confirm Password:</label>
                        <input type="password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} />
                        <label>City:</label>
                        <input type="text" value={values.city} onChange={(e) => setValues({ ...values, city: e.target.value })} />
                        <label>Requested Role:</label>
                        <select value={values.requestedRole} onChange={(e) => setValues({ ...values, requestedRole: e.target.value })}>
                            <option value="">Select Role</option>
                            <option value="webdeveloper">Web Developer</option>
                            <option value="legal">Legal</option>
                            <option value="accounting">Accounting</option>
                            <option value="marketing">Marketing</option>
                            <option value="advertising">Advertising</option>
                        </select>
                        <button onClick={handleSubmission} disabled={submitButtonDisabled}>
                            {submitButtonDisabled ? 'Loading...' : 'Register'}
                        </button>
                    </>
                );
            case 2:
                return (
                    <>
                        <label>Enter OTP:</label>
                        {/* Render OTP input and verify button here */}
                        <button onClick={() => console.log('Verify OTP')}>Verify OTP</button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <div className="tabs">
                <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Personal Info</div>
                <div className={`tab ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>OTP Verification</div>
            </div>
            <div className="tab-content">
                {renderTabs()}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
