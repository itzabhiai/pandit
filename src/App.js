// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar";
import { Home } from './Pages/Home/Home';
import AOS from 'aos';
import React, { useState, useEffect } from 'react';
import { UniLoder } from './Components/Loder/UniLoder';
import 'aos/dist/aos.css';
import { ServiceDetails } from './Components/Services/ServiceDetails';
import { ServiceDisplay } from './Components/Services/ServiceDisplay';
import { UploadService } from './Components/Services/UploadService';
import Footer from './Components/Footer/Footer';
import Chat from './Components/Chat/Chat';
import Register from './Components/Users/Register';
import Login from './Components/Users/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatApp from './ChatRoom/New/ChatApp';
// import UserList from './ChatRoom/New/UserList';
import UserChat from './ChatRoom/New/ChatApp';
import CuChat from './ChatRoom/CostomerChat/CuChat';
import MessageList from './ChatRoom/CostomerChat/MessageList';
import { TestAdmin } from './Admin/TestAdmin';
import { Aboutus } from './Pages/About/About';
import { ContactUs } from './Pages/ContactUs/ContactUs';
import Web from './ChatRoom/Web/Web';
import Marketing from './ChatRoom/Marketing/Marketing';
import Printing from './ChatRoom/Printing/Printing';
import Legal from './ChatRoom/Legal/Legal';
import Accounting from './ChatRoom/Acounting/Accounting';
import Advertise from './ChatRoom/Advertise/Advertise';
import WebCity from './ChatRoom/Web/WebCity';
import UserList from './Admin/UserList/UserList';
import Dashboard from './Admin/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';
import Steps from './Components/HomeComponents/Step';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      easing: 'ease',
    });
    AOS.refresh();

    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); 
    }
  };

  const hideFooter = ['/chatapp', '/cuchat', '/web', '/printing', '/advertise', '/marketing', '/legal', '/accounting'].some(path => location.pathname.startsWith(path));

  return (
    <div className="App">
      {loading ? (
        <UniLoder/>
      ) : (
        <>
          <Navbar />
          <ToastContainer/>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/loder" element={<UniLoder />} />
            <Route path="/service/:serviceId" element={<ServiceDetails/>} />
            <Route exact path="/service" element={<ServiceDisplay />} />
            <Route exact path="/upload-services" element={<UploadService />} />
            <Route exact path="/chat" element={<Chat />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login/>} />
            <Route path="/chatapp" element={<ChatApp/>} />
            {/* <Route path="/userlist" element={<UserList/>} /> */}
            <Route path="/chatapp/:userId" component={UserChat} />
            <Route path="/cuchat/:userId" element={<CuChat  />} />
            <Route path="/mlist" element={ <ProtectedRoute><MessageList/> </ProtectedRoute> } />
            <Route path="/admin" element={<TestAdmin/>} />
            <Route path="/about" element={<Aboutus/>} />
            <Route path="/contact" element={<ContactUs/>} />
            <Route path="/printing" element={<Printing/>} />
            <Route path="/legal" element={<Legal/>} />
            <Route path="/accounting" element={<Accounting/>} />
            <Route path="/advertise" element={<Advertise/>} />
            <Route path="/marketing" element={<Marketing/>} />
            <Route path="/step" element={<Steps/>} />

            <Route path="/webcity" element={ <ProtectedRoute><WebCity/> </ProtectedRoute>} />
            <Route path="/web/:cityId" element={<Web   />} />
            <Route path="/userlist" element={ <ProtectedRoute> <UserList/> </ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>} />



          </Routes>
          {!hideFooter && <Footer/>}
        </>
      )}
    </div>
  );
}

export default App;
