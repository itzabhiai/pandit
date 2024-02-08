import React, { useState, useEffect } from 'react';
import "../Hero/Hero.css"
import { Link } from 'react-router-dom';

const Hero = () => {
    const [text, setText] = useState('');
    const phrases = ['Web Devlopment', 'Android APP Development' ,'iOS App Development','Digital Marketing','UI/UX Design'];
    const [phraseIndex, setPhraseIndex] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        const currentPhrase = phrases[phraseIndex];
        setText((prevText) =>
          prevText.length === currentPhrase.length
            ? '' 
            : currentPhrase.substring(0, prevText.length + 1)
        );
  
        if (text.length === currentPhrase.length) {
          
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      }, 200);
  
      return () => clearInterval(intervalId); 
    }, [text, phraseIndex, phrases]);
  
    return (
    
      <div className='hero'>
      
        <>
      <div data-aos="fade-right"
     data-aos-offset="300"
     data-aos-easing="ease-in-sine" className='herodata'>
<h1>Your Vision, Our Code:  <span className='hero-h1-span'>Building Tomorrow's Solutions Today</span></h1>
<h3>With Our Services<span className='hero-h3-span'>:  {text} </span></h3>
<p>At <b>GentleFolk Media</b>, we code tomorrow's solutions inspired by your vision. Our expert team crafts innovative software, blending your ideas with our technical prowess. Experience the power of digital transformation as we build the future together, today.</p>
<Link to='/contact-us'  style={{textDecoration:'none'}} > <button className='btn-donate'>Get Quote</button></Link>
    </div>
    
    <div className='heroimg'>
      <img data-aos="fade-left" src='https://res.cloudinary.com/diqtww8g5/image/upload/v1707110212/Untitled_design_74_g1yl4i.png' alt=''/>
    </div>
     </>
    
    </div>
  )};

export default Hero;
