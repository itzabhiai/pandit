import React  from 'react';
import './Dashboard.css';
import UserList from '../UserList/UserList';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MdOutlineWebStories } from "react-icons/md";
import { AiTwotoneShopping ,AiTwotoneNotification ,AiTwotoneProfile ,AiFillCopy ,AiTwotonePrinter} from "react-icons/ai";
const Dashboard = ({ totalServices }) => {

    const messageCount = JSON.parse(localStorage.getItem('messageCount')) || 0;
    const history = useNavigate();

    const serviceClick = () => {
        history("/upload-services"); 
    };
    const customerClick = () => {
        history("/mlist"); 
    };
    const venderlistClick = () => {
        history("/userlist"); 
    };
   
    return (
        <div className='maindash'>
            
                <div title='Totle user message' className='service-dash1'>
                    <h2>DashBoard</h2>
                </div>
                
            
            <div className='service-usermessage-dash' >

                
                <div  title='Totle user message' className='service-dash' onClick={customerClick}>
                    <div className='service-dash-img'> <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709876392/ctfqxj8zrlpncyaeiv3v.png' alt='/' /> </div>

                    <div className='textservice-dash'>

                    <h2> Total Customer: {messageCount}</h2>
                    <p>  View The Customer LIsts and Messages</p>
                    
                     </div>
                </div>
                <div className='usermessage-dash' onClick={serviceClick}> 
                <div className='service-dash-img'> <img src='https://res.cloudinary.com/ddkyeuhk8/image/upload/v1709876392/elfktxb80zsxk9cqmdhg.png' alt='/' /> </div>

<div className='textservice-dash'>

<h2>Uploaded Services: {totalServices}</h2>
<p>  Upload services and view the uploaded services</p>

 </div>
                
                </div>
            </div>
            <div className='vender-dash' >
                <div className='vender-list' onClick={venderlistClick}> <UserList/></div>
                <div className='vender-message'>
                 

                      <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <MdOutlineWebStories /> </span>
                      <div className='vendericon-text'> <h3> Websites </h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link>
                      <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <AiTwotoneShopping /> </span>
                      <div className='vendericon-text'> <h3> Marketing </h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link> <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <AiTwotoneNotification/> </span>
                      <div className='vendericon-text'> <h3> Advertisement </h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link> <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <AiTwotoneProfile /> </span>
                      <div className='vendericon-text'> <h3> Legal</h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link> <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <AiFillCopy /> </span>
                      <div className='vendericon-text'> <h3> Accounting </h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link> <Link to="/webcity" style={{textDecoration:"none"}}>
                      <div className='v-messag-list'> 
                      <span className='vender-icon'> <AiTwotonePrinter /> </span>
                      <div className='vendericon-text'> <h3> Printing</h3> 
                      <p> View City and Messages of venders</p>
                      </div>
                      
                      </div> </Link>
                      

                      


                </div>
            </div>
        </div>
    );
}

export default Dashboard;
