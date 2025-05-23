import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// this is the type of the form data
// we are using this type to set the state of the form data
interface FormData {
  username: string;
  name: string;
  age: string;
  email: string;
  password: string;
}

// setting the error type for the form
interface Errors {
  username?: string;
  name?: string;
  age?: string;
  email?: string;
  password?: string;
  api?: string;
}
 
const Register: React.FC = () => {
  // navigate is used to navigate to different routes
  const navigate = useNavigate();

  // State variables for form data
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    age: '',
    email: '',
    password: '',
  });

//  state for errors and loading
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Function to validate the form inputs
  const validateForm = (): Errors => {
    // Creating a new errors object
    const newErrors: Errors = {};
    // if username is not present then we show the error message
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    // we check the validation of name
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    // we check the validation of age
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0)
      newErrors.age = 'Valid age is required';
    // we check the validation of email
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6)
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

    // we send data though the axios in api for registration
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      // localStorage.setItem('token', response.data.token);
      console.log('Registration successful:', response.data.message);
      navigate('/login');
    } catch (error: any) {
      setErrors({ api: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, api: undefined }));
  };

  return (
    // final ui
    <div className=" max-w-[1440px] w-full mx-auto min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.api && (
            <div className="text-red-400 text-sm text-center">{errors.api}</div>
          )}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-300">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter age"
              aria-invalid={!!errors.age}
            />
            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;