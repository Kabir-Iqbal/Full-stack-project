import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Article } from '../types';
import DOMPurify from 'dompurify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Header from './common/header';
import { ARTICALS_API } from './utils/apiUrl';


 
const ArticleDetail: React.FC = () => {
  // State managing userId,articale,error,and rticalid
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  //  navigate is used to navigate to different routes
  const navigate = useNavigate();

  // Fetching a Single artical with the Id which is getting from the url
  // useEffect is used to fetch the article data when the component mounts
  useEffect(() => {
    // axios is used to make the api call , get/put/post the data from the api, 
    // Articale is the type of the data which we are getting from the api
    axios
      .get<Article>(`${ARTICALS_API}/api/articles/${id}`)
      // then we set the article state with the data
      .then(res => setArticle(res.data))
      .catch(err => {
        console.log(err);
        setError('Failed to load article');
      });

    // Get user ID from token
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to get user ID     & atob is used to decode the token only in browser
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);  
    }

  }, [id]);

 
  

  const handleDelete = () => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    // getting the token from local storage
    const token = localStorage.getItem('token');
    // if token is not present then we show the error message
    if (!token) {
      setError('You must be logged in to delete an article');
      return;
    }

     
    // making the api call to delete the article
    axios.delete(`${ARTICALS_API}/api/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => navigate('/'))
      .catch(err => {
        console.log(err);
        setError('Failed to delete article');
      });
  };

  // If there is an error, show the error message with the Header component
  if (error) {
    return (
      <>
        <Header showSearch={true} />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 md:p-6">
          <p className="text-red-400 bg-gray-700 p-3 rounded-md">{error}</p>
        </div>
      </>
    );
  }


  // if articale is not availble showing the loading with the Header component
  if (!article) {
    return (
      <>
        <Header showSearch={true} />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 md:p-6">
          <p className="text-gray-300">Loading article...</p>
        </div>
      </>
    );
  }

  // We sanitize our data because of XSS attacks ,,   
  const sanitizedBody = DOMPurify.sanitize(article.body);

  return (
    // final ui
    <div className='max-w-[1440px] w-full mx-auto'>
      <Header showSearch={false} />
      <div className=" min-h-screen bg-gray-900 p-4 md:p-6">
        <div className="max-w-3xl mx-auto my-6 bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {article.title}
            </h1>
            {/* Edit and Delete buttons for authorized users */}
            {userId && userId === article.author._id && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <Link
                  to={`/editor/${id}`}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-semibold uppercase shadow-sm hover:scale-105 transition duration-200 ease-in-out"
                >
                  <FaEdit className="text-base" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-semibold uppercase shadow-sm hover:scale-105 transition duration-200 ease-in-out"
                >
                  <FaTrash className="text-base" />
                  Delete
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            {article.category} • by {article.author.username}
          </p>
          <div
            className="prose prose-invert max-w-none text-gray-200 text-base md:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;