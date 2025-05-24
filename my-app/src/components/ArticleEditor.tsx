import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuillComponent from "./common/ReactQuill"
import Header from './common/header';
import { ARTICALS_API } from './utils/apiUrl';



const ArticleEditor: React.FC = () => {
  // State variables for article data
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [, setStatus] = useState<'draft' | 'published'>('draft');
  const [error, setError] = useState('');
  // navigate is used to navigate to different routes
  const navigate = useNavigate();


  // useParams is used to get the id from the url   & here we are check id or come or not in useparams
  const { id } = useParams() as { id?: string };

  // we fetch the article data if id is present
  useEffect(() => {
    if (id) {
      axios.get(`${ARTICALS_API}/api/articles/${id}`)
      // if article is present then we set the state with the data
        .then(res => {
          setTitle(res.data.title);
          setCategory(res.data.category);
          setBody(res.data.body);
          
          setStatus(res.data.status);
          
        })
        .catch(err => {
          console.log(err);
          setError('Failed to fetch article');
        });
    }
    // useeffect will run still not getting this id which mentioned in last of useeffect
  }, [id]);


  // if id is not present then we create a new article
  const handleSave = (saveStatus: 'draft' | 'published') => {
    
    // getting the token from local storage 
    const token = localStorage.getItem('token');
    // creating the article object
    const article = { title, category, body, status: saveStatus };

    // if token is not present then we show the error message
    if (!token) {
      setError('You must be logged in to save an article');
      return;
    }

    // creating the config object for axios
    // config object is used to send the token in the header
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // If id is present then we update the article
    if (id) {
      // here we are using put method to update the article
      axios.put(`${ARTICALS_API}/api/articles/${id}`, article, config)
      // if article is updated then we navigate to the article page
        .then(() => navigate(`/article/${id}`))
        .catch(err => {
          console.log(err);
          setError('Failed to update article');
        });
    } else {

      // If id is not present then we create a new article
      // here we are using post method to create the article
      axios.post(`${ARTICALS_API}/api/articles`, article, config)
      // if article is created then we navigate to the article page
        .then(res =>  navigate(`/article/${res.data._id}`))
        .catch(err => {
          setError(err.response?.data || err.message);
        });
    }
  };


  return (
    // Final Ui
     <div className='max-w-[1440px] w-full mx-auto '>
     {/* We add Header function , and give search props false becaz we dont want to show/do search functionality on this page  */}
      <Header showSearch={false} />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {id ? 'Edit Article' : 'Create a New Article'}
          </h2>

          {error && (
            <p className="text-red-400 bg-gray-700 p-3 rounded-md mb-4">{error}</p>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-300 mb-1">
                Content
              </label>
              <ReactQuillComponent value={body} onChange={setBody} />
              
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-6">
              <button
                onClick={() => handleSave('draft')}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSave('published')}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition duration-200"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;

