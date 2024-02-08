import React from 'react';
import './DisplayService.css';
import { textdb } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { IoBookOutline, IoLocation } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import Load from '../Loder/Load';

const truncateText = (text, numWords) => {
  const words = text.split(' ');
  const truncatedText = words.slice(0, numWords).join(' ');
  return truncatedText;
};

export const ServiceDisplay = () => {
  const [Services, loading, error] = useCollection(collection(textdb, 'Services'));

  return (
    <div className='main-d-Service'>
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
              <div className='d-Service-card' key={Service.id}>
                <div className='d-inst-image'>
                  <img loading='lazy' src={data.thumbnail} style={{ maxWidth: '100%' }} alt='Service Thumbnail' />
                </div>
                <div className='d-inst-data'>
                  <div className='gol-box'>
                    <IoBookOutline />
                  </div>
                  <h3 className='inst-title'>{data.title}</h3>
                  {/* <b className='inst-title'>
                    <span className='location-icon'>
                      <IoLocation />
                    </span>
                    {data.locationtxt}
                  </b> */}

                  <p className='Servicep hidden'>{truncatedDescription}....</p>
                  <div className='btn-group'>
                  <Link to={`/Service/${Service.id}`} style={{ textDecoration: 'none' }} className='Service-link hidden'>
                    <button className='btn'>More →</button>
                  </Link>
                  <Link to={`/chat`} style={{ textDecoration: 'none' }} className='Service-link hidden'>
                    <button className='btn'>Get quote</button>
                  </Link>
                </div> </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
