import React from 'react'
import TriviaGame from './Components/TriviaGame'
import { Routes, Route } from 'react-router-dom'



const App = () => {
  return (
    <Routes>
      <Route path='/' element={<TriviaGame />} />
    </Routes>
  )
}

export default App




