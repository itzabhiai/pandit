import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { textdb } from '../../firebaseConfig';
import DOMPurify from 'dompurify';
import './ServiceDetails.css';
import { IoCall } from "react-icons/io5";
import { Helmet } from 'react-helmet';
import { FaLocationDot ,FaGreaterThan } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Load from '../Loder/Load';
export const ServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setservice] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
   
    window.scrollTo(0, 0);

    return () => {
        };
  }, []); 
  useEffect(() => {
    const fetchserviceDetails = async () => {
      try {
        const docRef = doc(textdb, 'Services', serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setservice(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    fetchserviceDetails();
  }, [serviceId]);

  const openModal = (index) => {
    console.log('Opening modal for image index:', index);
    setSelectedImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImageIndex(null);
  };

  const navigateImages = (direction) => {
    const newIndex =
      direction === 'next'
        ? (selectedImageIndex + 1) % service.docs.length
        : (selectedImageIndex - 1 + service.docs.length) % service.docs.length;

    setSelectedImageIndex(newIndex);
  };

  const renderContent = () => {
    if (!service) {
      return <Load/>;
    }

    if (selectedTab === 'overview') {
      return (
        <div>
          <h2>Overview Data</h2>
          <div
            className='inst-details-content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.content) }}
          ></div>
        </div>
      );
    } else if (selectedTab === 'service') {
      return (
        <div className='selected-galley'>
          <h2>service Images</h2>
          <div className='gallery-card' >
          {service.imageUrls &&
  service.imageUrls.map((imageUrl, index) => (
    <div onClick={() => openModal(index)} key={index} className='imageContainer'>
      <img loading='lazy' src={imageUrl} alt={`Image ${index}`} style={{ maxWidth: '100%' }} />
    </div>
  ))}
  </div>
          {selectedImageIndex !== null && service.docs && service.docs[selectedImageIndex] && (
            <div className='modal'>
              <button className='closebutton' onClick={closeModal}>
                X
              </button>
              <div className='modalcontainer'>
                <button className='modalbtn' onClick={() => navigateImages('prev')}>
                  ←
                </button>
                <img src={service.docs[selectedImageIndex].data().imageUrl} alt='Selected' />
                <button className='modalbtn' onClick={() => navigateImages('next')}>
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (selectedTab === 'location') {
      return (
        <div>
          <h2>Location Information</h2>
          
          <iframe className='locatio-map' src={service.location} allowfullscreen='' loading='lazy'></iframe>
        </div>
      );
    }
  };

  return (
    <div className='main-inst-detail'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{service?.title}</title>
        <meta name='description' content='' />
      </Helmet>
      <div className='inst-detail-hero'>
      <div className='top-txt'>
      <Link to="/" style={{textDecoration:"none"}}><li className='inst-title-top'>Home</li></Link><span ><FaGreaterThan /></span>
 <Link to="/service" style={{textDecoration:"none"}}><li className='inst-title-top'>service</li></Link><span ><FaGreaterThan /></span>
  <li className='inst-title-top1'>{service ? service.title : 'Loading...'}</li>
</div>

<div className='main-title-hero'>
<h1>{service ? service.title : 'Loading...'} </h1>
<p><FaUser />  By Admin</p>
</div>


      </div>
      <div className='inst-container'>
      <div data-aos='fade-up' className='inst-detail'>
        <div className='select-data'>
          <li onClick={() => {
      setSelectedTab('overview');
      setActiveTab('overview');
    }}
    className={activeTab === 'overview' ? 'active' : ''}>Overview</li> 


          <li  onClick={() => {
      setSelectedTab('service');
      setActiveTab('service');
    }}
    className={activeTab === 'service' ? 'active' : ''}>service</li>

{/* 
          <li  onClick={() => {
      setSelectedTab('location');
      setActiveTab('location');
    }}
    className={activeTab === 'location' ? 'active' : ''}>Location</li> */}
    <span className='int-selected-hr'>
    <hr/></span>
        </div>




        <div>{renderContent()}</div>
      </div>
      <div className='inst-short-data'>
       <div>
      {/* <img src={service.thumbnail} className='inst-short-img'   /> */}
      <img src={service ? service.thumbnail : 'Loading...'} className='inst-short-img'   />

       </div>
       <h2>service Details</h2>
      
       <p>{service ? service.p1 : 'Loading...'}</p>
    
       <Link to='/contact-us'  style={{textDecoration:'none'}} > <button className='btn-donate'>Get Quote</button></Link>

    
       </div>
      </div>
    </div>
  );
};
