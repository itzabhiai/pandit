import React from 'react'
import { Link } from 'react-router-dom'
import { auth } from '.././firebaseConfig';
import "./Test.css"
export const TestAdmin = () => {
  const currentUser = auth.currentUser;

  return (
    <div className='main-container'>
     <div className='btntest'>
                    <Link to={'/upload-services'} style={{ textDecoration: 'none' }}>
                      <button className='bty'  >Upload Services</button>
                    </Link>
                    <Link to={'/mlist'} style={{ textDecoration: 'none' }} >
                      <button  className='bty'>Mesages From Customer</button>
                    </Link>
                    {currentUser && (   <Link to={`/cuchat/${currentUser.uid}`} style={{ textDecoration: 'none' }}>
                      <button  className='bty'>Message To Vender</button>
                    </Link>)}
                    </div>
    </div>
  )
}
