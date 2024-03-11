import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useHistory, useNavigate } from 'react-router-dom'; // Import useHistory
import { FaBars, FaTimes } from 'react-icons/fa';
import { collection, doc, getDoc , getDocs} from 'firebase/firestore';
import { textdb, auth } from '../../firebaseConfig';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [showImage, setShowImage] = useState(false);
  const location = useLocation();
  const currentUser = auth.currentUser;
  const [userCities, setUserCities] = useState([]);
  const [userCity, setUserCity] = useState(''); // State to hold the user's city
  const [userRole, setUserRole] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const history = useNavigate(); // Initialize useHistory
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowImage(window.scrollY >= 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const getUserRole = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(collection(textdb, 'users'), currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserRole(userData.role || 'user');
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
        }
      }
    };

    getUserRole();
  }, [currentUser]);

  const handleLogout = async () => {
    window.location.reload()
    setLoggingOut(true);
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchUserCity = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(collection(textdb, 'users'), currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const city = userData.city || ''; // Get user's city from Firestore
            setUserCity(city);
          }
        } catch (error) {
          console.error('Error fetching user city from Firestore:', error);
        }
      }
    };

    fetchUserCity();
  }, [currentUser]);

  const navigateToCityPage = () => {
    if (userCity) {
      history(`/web/${userCity}`); // Navigate to the user's city page
    }
  };


  useEffect(() => {
    const fetchUserCity = async () => {
      try {
        if (currentUser) {
          const userDocRef = doc(collection(textdb, 'users'), currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const city = userData.city;
            if (city) {
              setUserCities([city]); // Set user city to an array with only the user's city
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user city:', error);
      }
    };
  
    fetchUserCity();
  }, [currentUser]);
  

  return (
    <>
      <nav className={showImage ? 'navbar active' : 'navbar'}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="https://res.cloudinary.com/diqtww8g5/image/upload/v1707067339/Untitled_design_72_uresqo.png" alt="logo" />
          </Link>
          <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul ref={menuRef} className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/service" className="nav-link" onClick={closeMenu}>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={closeMenu}>
                Contact Us
              </Link>
            </li>
            {currentUser ? (
              <>
                {/* {userCities.map((city, index) => (
                  <li className="nav-item" key={index}>
                    <Link to={`/web/${city}`} className="nav-link" onClick={closeMenu}>
                      {city}
                    </Link>
                  </li>
                ))} */}
             {userRole === 'webdeveloper' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/web`} className="nav-link" onClick={closeMenu}>
      Web Developer
    </Link>
  </li>
)}
{userRole === 'legal' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/legal`} className="nav-link" onClick={closeMenu}>
      Legal
    </Link>
  </li>
)}
{userRole === 'marketing' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/marketing`} className="nav-link" onClick={closeMenu}>
      Marketing
    </Link>
  </li>
)}
{userRole === 'accounting' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/accounting`} className="nav-link" onClick={closeMenu}>
      Accounting
    </Link>
  </li>
)}
{userRole === 'advertising' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/advertising`} className="nav-link" onClick={closeMenu}>
      Advertising
    </Link>
  </li>
)}
{userRole === 'printing' && (
  <li onClick={navigateToCityPage} className="nav-item">
    <Link to={`/printing`} className="nav-link" onClick={closeMenu}>
      Printing
    </Link>
  </li>
)}


                {userRole === 'admin' && (
                  <li className="nav-item">
                    <Link to={`/dashboard`} className="nav-link" onClick={closeMenu}>
                      dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  {loggingOut ? (
                    <span className="nav-link">Logging Out...</span>
                  ) : (
                    <span style={{ cursor: 'pointer' }} className="nav-link" onClick={handleLogout}>
                      Logout
                    </span>
                  )}
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login/Register
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
