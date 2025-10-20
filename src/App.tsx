import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FlashMessage from './components/FlashMessage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <FlashMessage />
    </BrowserRouter>
  );
}

export default App;
