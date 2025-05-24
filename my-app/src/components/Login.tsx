import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ARTICALS_API } from './utils/apiUrl';



// Setted  error type for the form
interface Errors {
  email?: string;
  password?: string;
  api?: string;
}

const Login: React.FC = () => {
  // State variables for email, password, errors, and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // navigate is used to navigate to different routes
  const navigate = useNavigate();
  
  // state for errors and loading
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Function to validate the form inputs
  const validateForm = (): Errors => {
    // Creating a new errors object
    const newErrors: Errors = {};
    // if email is not present then we show the error message
    if (!email.trim()) newErrors.email = 'Email is required';
    // we check the validation of email
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';

    // manimum 6 length of password 
    if (!password || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // if there is no error then we make the api call to login
    // we are using axios to make the api call
    try {
      const response = await axios.post(`${ARTICALS_API}/api/users/login`,{email,password} );
      // Check if the response contains the expected data
      const { token, LoggedIn } = response.data; // Match backend field name
      // if token and LoggedIn are not present then we show the error message
    if (!token || !LoggedIn) {
      throw new Error('Missing token or username in response');
    }

    // Store token  in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('username', LoggedIn); // Use 'username' as key
     
      navigate('/');

    } catch (error: any) {
      setErrors({ api: error.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

 

  return (
    // final ui
    <>
      <div className=" max-w-[1440px] w-full mx-auto min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Login</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.api && (
              <div className="text-red-400 text-sm text-center">{errors.api}</div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                
                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
             <p className="text-sm text-gray-300 text-center mt-4"> Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:underline"
                aria-label="Navigate to register page"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;