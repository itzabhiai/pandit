
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar"
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
function App() {

  const [loading, setLoading] = useState(true);


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

  
  return (
    <div className="App">
 {loading ? (
        <UniLoder/>
      ) : (
        <>
      <Navbar/>
      <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/loder" element={<UniLoder />} />
            <Route path="/service/:serviceId" element={<ServiceDetails/>} />

            <Route exact path="/service" element={<ServiceDisplay />} />
            <Route exact path="/upload-services" element={<UploadService />} />
            <Route exact path="/chat" element={<Chat />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login/>} />







             </Routes>
             <Footer/>
            </>
             )}
    </div>
  );
}

export default App;
