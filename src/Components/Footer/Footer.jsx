// Footer.jsx

import React from 'react';
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='footer-logo'>
        <img src='https://res.cloudinary.com/diqtww8g5/image/upload/v1707067339/Untitled_design_72_uresqo.png' alt='Company Logo' />
        <p></p>
      </div>

      <div className='footer-links'>
        <h3>Helpful Links</h3>
        <ul>
          <li><a href='/'>Home</a></li>
          <li><a href='/about'>About Us</a></li>
          <li><a href='/services'>Services</a></li>
          <li><a href='/contact'>Contact</a></li>
        </ul>
      </div>

      <div className='footer-services'>
        <h3>Services</h3>
        <ul>
          <li><a href='/service1'>Service 1</a></li>
          <li><a href='/service2'>Service 2</a></li>
          <li><a href='/service3'>Service 3</a></li>
        </ul>
      </div>

      <div className='footer-contact'>
        <h3>Contact Us</h3>
        <p>123 Main Street, Cityville</p>
        <p>Email: info@example.com</p>
        <p>Phone: +1 (123) 456-7890</p>
      </div>

      <div className='footer-social'>
        <h3>Connect With Us</h3>
        <ul>
          <li><a href='https://facebook.com' target='_blank' rel='noopener noreferrer'><FaFacebook /></a></li>
          <li><a href='https://twitter.com' target='_blank' rel='noopener noreferrer'><FaTwitter /></a></li>
          <li><a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'><FaLinkedin /></a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
