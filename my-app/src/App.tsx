import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import ArticleList from './components/Articlelist';
import ArticleDetail from './components/ArticleDetail';
import ArticleEditor from './components/ArticleEditor';
import Login from './components/Login';
import Register from './components/Register';



const App: React.FC = () => {
  return (
    <Router>
      <div className="">
        <Routes>
          {/* Managed Routes */}
          <Route  path="/" element={<ArticleList/>} />
          <Route path="/article/:id" element={<ArticleDetail/>} />
          <Route path="/ArticleEditor" element={<ArticleEditor/>} />
          <Route path="/editor/:id" element={<ArticleEditor/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          {/* <Route path="/" element={<Navigate to="/register" />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;