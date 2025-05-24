import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaBell, FaUserCircle } from 'react-icons/fa'; // Import icons from react-icons
// icons
import { HiBars4 } from "react-icons/hi2";
import { MdClose } from "react-icons/md";

// Create a headers interface types for the header component
interface HeaderProps {
  query?: string;
  onQueryChange?: (value: string) => void;
  showSearch?: boolean; // New prop to control search bar visibility
}

// in Header we pass a props for using the search functionality another pages ,, or we can also disabled search bar on another pages
const Header : React.FC <HeaderProps> = ({ query , onQueryChange = () => {}, showSearch= true }) => {
  // State to manage the Login User
  const [user, setUser] = useState('');
  // state to manage the responsive
  const [isOpen, SetisOpen] = useState(false)
  
  // toggle button for the hamburger menu
  const toggleButton = () => {
    SetisOpen(!isOpen)
  }
  
  // getting the logined username from localstorage 
  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user) {
      setUser(user);
    }
  }, []);

// fucntion for logout when user click/Call this function, function will remove token and username from localstorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // if user data removed then setted a default as guest data 
     setUser('Guest');
    //  after removed user will be moved to login page 
    window.location.href = '/login';
  };




  return (
    // Final Ui
    <div>
      {/* Header Ui */}
      <header className="max-w-[1440px] w-full mx-auto bg-gray-800 flex justify-between items-center  text-white px-5 p-4">
        <div className='flex items-center gap-5'>
        <h1 className="text-2xl font-bold">Notium</h1>
        {showSearch && (
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          className="mt-2 p-1 rounded bg-gray-700 text-white"
        />
        )}
        </div>

        <nav className=" relative mt-2 flex items-center gap-2">
         <ul
            className={`fixed inset-y-0 right-0 w-64 my-10 sm:my-0 bg-gray-800 sm:bg-transparent sm:static sm:w-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-16 sm:pt-0 transform transition-transform duration-300 ease-in-out 
              ${isOpen ? 'translate-x-0' : 'translate-x-full sm:translate-x-0'
            } sm:flex sm:items-center z-50`}
          >
           <li><a href="/ArticleEditor" className=" order-2 sm:order-1  gap-1 flex items-center">
             <FaPencilAlt className="mr-1 " /> Write
            </a></li> 
            <li><a href="" className=" order-1 sm:order-2  text-xl flex items-center">
             <FaBell className="mr-2 " />
            </a></li>
            
            <li>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-xl text-gray-300" /> {/* User avatar/icon */}
                    <span className="font-medium text-gray-100">{user}</span> {/* Styled username */}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer order-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200"
                >
                  Sign In
                </a>
              )}
            </li>
          </ul>

          {/* Hamburger Menu for Mobile */}
          <button className="sm:hidden text-2xl z-50" onClick={toggleButton}>
            {isOpen ? <MdClose /> : <HiBars4 />}
          </button>
        </nav>
      
      </header>
    </div>
  );
}

export default Header;
