import React from 'react'
import Home from './pages/Home';
import Search from './pages/Search';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Watch from './pages/Watch';

const App = () => {
  return (
    // <BrowserRouter basename="/youtube-clone">
    <BrowserRouter basename="/youtube-clone">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/watch/:id' element={<Watch />} />
      </Routes>
    </BrowserRouter>
    // <div>
    //   <Home/>
    // </div>
  )
}

export default App