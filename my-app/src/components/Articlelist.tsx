import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link  } from 'react-router-dom';

import type { Article } from "../types";
import Header from './header';

const ArticleList: React.FC = () => {
  // State variables for search query and articles
  const [query , setQuery] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([]);


   

// Fetching articles from the API
  useEffect(() => {
    axios.get<Article[]>('http://localhost:5000/api/articles')
    // then we set the articles state with the data
      .then(res => setArticles(res.data))
      .catch(err => console.log(err));
  }, []);

    

   // Filter articles based on search query 
  //  The filter function checks if the title, category, or author's username includes the search query (case-insensitive)
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.category.toLowerCase().includes(query.toLowerCase()) ||
    article.author.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    // final ui
     <>
     <div className='max-w-[1440px] w-full mx-auto'>
       <Header showSearch={true} query={query} onQueryChange={setQuery} />

      <div className=" min-h-screen bg-gray-900 p-5 md:p-6">
        <div className="max-w-4xl mx-auto my-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Articles
          </h1>
          {/* If filterdata length is 0 we show a message  */}
          {filteredArticles.length === 0 ? (
            <p className="text-gray-300 text-center">
              {query ? 'No articles match your search.' : 'No articles available.'}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredArticles.map(article => (
                <Link
                  key={article._id}
                  to={`/article/${article._id}`}
                  className="flex items-center justify-between py-4 mx-2 border-b border-gray-700 hover:bg-gray-700 shadow-sm transition duration-200 w-full"
                >
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-white truncate text-blue-500 hover:text-blue-400 transition duration-200">
                      {article.title}
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                      {article.category} • {article.author.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ArticleList;