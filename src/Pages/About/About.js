import React from 'react'
import { BiFoodMenu,BiSolidCalendarEdit } from "react-icons/bi";
import { GiTeacher } from "react-icons/gi";
import { useEffect,useState } from 'react';
import "./about.css"
import { FaCheckCircle,FaBookReader,FaChalkboardTeacher } from "react-icons/fa";
import { FaChartLine, FaBuilding, FaComments, FaUserTie } from 'react-icons/fa';
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { SiGoogleclassroom } from "react-icons/si";
import { SlDislike } from "react-icons/sl";
export const Aboutus = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);
  const [key, setKey] = useState(0); // Key variable to restart the effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 
  useEffect(() => {
    const targetValue1 = 200;
    const targetValue2 = 400;
    const targetValue3 = 500;
    const targetValue4 = 98;
    const duration = 2000;

    const step1 = Math.ceil(targetValue1 / duration);
    const step2 = Math.ceil(targetValue2 / duration);
    const step3 = Math.ceil(targetValue3 / duration);
    const step4 = Math.ceil(targetValue4 / duration);

    const interval1 = setInterval(() => {
      setCount1((prevCount) => {
        const nextCount = prevCount + step1;
        return nextCount >= targetValue1 ? targetValue1 : nextCount;
      });
    }, 10);

    const interval2 = setInterval(() => {
      setCount2((prevCount) => {
        const nextCount = prevCount + step2;
        return nextCount >= targetValue2 ? targetValue2 : nextCount;
      });
    }, 10);

    const interval3 = setInterval(() => {
      setCount3((prevCount) => {
        const nextCount = prevCount + step3;
        return nextCount >= targetValue3 ? targetValue3 : nextCount;
      });
    }, 10);

    const interval4 = setInterval(() => {
      setCount4((prevCount) => {
        const nextCount = prevCount + step4;
        return nextCount >= targetValue4 ? targetValue4 : nextCount;
      });
    }, 10);

    // Clear intervals when the component is unmounted or key changes
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
      clearInterval(interval3);
      clearInterval(interval4);
    };
  }, [key]); // Effect will restart whenever the key changes

  // Function to restart the counting effect
  const restartCounting = () => {
    setKey((prevKey) => prevKey + 1); // Update the key to trigger effect restart
  };
  return (
    <div>
  
    

    <div className='main-about-conatiner'>


      <p className='why-about'>WHY CHOOSE SECONDPUNDIT</p>
      <h1 className='banifit-h1'>The Best <span style={{color:"#ee4a62"}}>Beneficial </span>Side <br/>of  SECONDPUNDIT</h1>
      <div className='about-card-main'>
      <div className='aboutus-card'> 
        <i className='aboutus-icon-container1'><FaChartLine  className='aboutus-icon' /></i>
        <h3>
Business growth planner</h3>
        <p>We are committed to delivering comprehensive business growth planning services to our clients.</p>
      </div>
      <div className='aboutus-card'> 
        <i className='aboutus-icon-container1'><FaBuilding className='aboutus-icon2' /></i>
        <h3>New Startup Building</h3>
        <p>We are dedicated to supporting the establishment and growth of new startups through our comprehensive business growth planning services and startup development expertise.</p>
      </div>
      <div className='aboutus-card'> 
        <i className='aboutus-icon-container1'><FaComments className='aboutus-icon3' /></i>
        <h3>Communication Consulting</h3>
        <p>Communication Consulting is a service we provide that offers expert guidance to optimize communication strategies, foster stakeholder engagement, and enhance messaging effectiveness for businesses and individuals</p>
      </div>
      </div>
    </div>


    {/* <div className='main-about-count'>
      <div className='about-count-card'>
        <i className='about-count-iconi'><FaCheckCircle className='about-count-icon'/></i>
        <div className='about-count-details'>
          <h1>{count1.toLocaleString()}K</h1>
          <p>Students enrolled</p>
      </div>
        </div>
        <div className='about-count-card'>
        <i className='about-count-iconi'><FaCheckCircle  className='about-count-icon'/></i>
        <div className='about-count-details'>
          <h1>{count2.toLocaleString()}K</h1>
          <p>CLASS COMPLETED</p>
        </div>
        </div>

       
        <div className='about-count-card'>
        <i className='about-count-iconi'><FaCheckCircle className='about-count-icon'/></i>
        <div className='about-count-details'>
          <h1>{count3.toLocaleString()}+</h1>
          <p>TOP INSTRUCTORS</p>
      </div>
        </div>
        <div className='about-count-card'>
        <i className='about-count-iconi'><FaCheckCircle className='about-count-icon'/></i>
        <div className='about-count-details'>
          <h1>{count4.toLocaleString()}%</h1>
          <p>SATISFACTION RATE</p>
        </div>
      </div>
      
     
    </div> */}



    </div>
  )
}
