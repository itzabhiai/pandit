import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { textdb } from '../../firebaseConfig'; // Assuming you have your Firestore instance initialized as 'db'
import "./Contact.css"
import { toast } from 'react-toastify';
import { FaFacebookF } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { CiLinkedin } from "react-icons/ci";
export const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [quoteDetails, setQuoteDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuoteDetails({ ...quoteDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const docRef = await addDoc(collection(textdb, 'quotes'), quoteDetails);
      console.log('Document written with ID: ', docRef.id);
      setQuoteSubmitted(true);
      setQuoteDetails({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
      });

    } catch (error) {
      console.error('Error adding document: ', error);
    }
    window.location.reload();
    toast.success("Success")
  };

  const getQuotesFromFirebase = async () => {
    const querySnapshot = await getDocs(collection(textdb, 'quotes'));
    const quotesData = [];
    querySnapshot.forEach((doc) => {
      quotesData.push({ id: doc.id, ...doc.data() });
    });
    setQuotes(quotesData);
  };

  // Fetch quotes on component mount
  useEffect(() => {
    getQuotesFromFirebase();
  }, []);

  return (
    <div className='main-contact'>


      <div className='main-farm'>
        <div className='loginimg'>
          <h2>We're Always Eager to <br /> Hear From You!</h2>
          <b>Address</b>
          <p>11th floor, the citadel, oppo star bazaar, Adajan, 395009</p>
          <b>Email</b>
          <p>Gentlefolkmedia@gmail.com</p>
          <b>Phone</b>
          <p>+91 7778070439</p>

          <br />
          <span className='contact-container'>

            <i className='contact-icon'> < IoShareSocialSharp className='c-icon' /></i>
            <i className='contact-icon'> < FaFacebookF className='c-icon' /></i>
            <i className='contact-icon'>  X</i>
            <i className='contact-icon'> < CiLinkedin className='c-icon' /></i>
          </span>

        </div>
        <div data-aos="fade-right" className='inputform'>
          <h2>Get In Touch</h2>
          <p>Fill out this form for booking a consultant advising session.</p>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
              className='mes'

              type='text'
              name='name'
              value={quoteDetails.name}
              onChange={handleChange}
              required
            />
            <label>Email:</label>
            <input
              className='mes'

              type='email'
              name='email'
              value={quoteDetails.email}
              onChange={handleChange}
              required
            />
            <label>Phone Number:</label>
            <input
              className='mes'

              type='text'
              name='phoneNumber'
              value={quoteDetails.phoneNumber}
              onChange={handleChange}
              required
            />
            <label>Message:</label>
            <textarea
              className='mes'
              name='message'
              value={quoteDetails.message}
              onChange={handleChange}
              required
            ></textarea>
            <button className='button' type='submit'>{uploading ? "Submiting..." : "Submit Message"}</button>
          </form>
        </div>






      </div>
      <div className='contact-map'>

        <iframe



          width="100%"
          height="650px"
          loading="lazy"
          allowfullscreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.1841595745614!2d72.7967377!3d21.184842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8592106dea123fdd%3A0x419c951d65756b93!2sGentleFolk%20Media%20LLP!5e0!3m2!1sen!2sin!4v1709111776444!5m2!1sen!2sin"
          className='map-contact'
        ></iframe>
      </div>
    </div>
  );
};
