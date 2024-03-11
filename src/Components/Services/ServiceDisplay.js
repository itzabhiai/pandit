import React from 'react';
import './DisplayService.css';
import { textdb } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { IoBookOutline, IoLocation } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import Load from '../Loder/Load';
import { auth } from '../../firebaseConfig';
import Card from './UploadService.css'; // Import the Card component

const truncateText = (text, numWords) => {
  const words = text.split(' ');
  const truncatedText = words.slice(0, numWords).join(' ');
  return truncatedText;
};

export const ServiceDisplay = (props) => {
  const { title } = props; // Destructure title from props
  const [Services, loading, error] = useCollection(collection(textdb, 'Services'));
  const currentUser = auth.currentUser;
  const history = useNavigate();

  const handleGetQuote = (title) => {
    if (currentUser) {
      history(`/cuchat/${currentUser.uid}?title=${encodeURIComponent(title)}`);
    } else {
      history('/login');
    }
  };

  return (
    <div  className='main-d-Service'>
      <p className='small-p'>Service</p>
      <h1 className='small-h'>Here Is Our Services</h1>
      {loading && <Load />}
      {error && <p>Error fetching Service</p>}
      {Services && (
        <div className='main-inst-card1'>
          {Services.docs.map((Service) => {
            const data = Service.data();
            const truncatedDescription = truncateText(data.p1, 10);

            return (
              <div className='card' key={Service.id}> {/* Use the Card component here */}
                <div className='d-inst-image'>
                  <img loading='lazy' src={data.thumbnail} style={{ maxWidth: '100%' }} alt='Service Thumbnail' />
                </div>
                <div className=''>
                  {/* <div className='gol-box'>
                    <IoBookOutline />
                  </div> */}
                  <h3 className='inst-title'>{data.title}</h3>
                  <p className=''>{truncatedDescription}....</p>

                  {/* <b className='inst-title'>
                    <span className='location-icon'>
                      <IoLocation />
                    </span>
                    {data.locationtxt}
                  </b> */}

                  <div className='btn-group'>
                    {currentUser && (
                      <Link to={`/cuchat/${currentUser.uid}?title=${encodeURIComponent(`i need ${data.title}`)}`} style={{ textDecoration: 'none' }} className='Service-link hidden'>
                        <button onClick={() => handleGetQuote(data.title)} className='btn'>More →</button>
                      </Link>
                    )}
                    {!currentUser && (
                      <Link to={'/login'} style={{ textDecoration: 'none' }} className='Service-link hidden'>
                        <button onClick={() => handleGetQuote(data.title)} className='btn'>Get quote</button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
