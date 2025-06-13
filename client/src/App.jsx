import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
// import Team from './components/Team';
import Dashboard from './components/Dashboard';
const App = () => {
  return (
    <section>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<LoginForm />}/>

          <Route path='/dashboard' element={<Dashboard />}>
            {/* <Route path="/" element={<LoginForm />} /> */}

         

          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer
              position="top-right"
              autoClose={3000}

            />
    </section>
  )
}
export default App;