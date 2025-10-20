import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FlashMessage from './components/FlashMessage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './App.css';
import { useEffect, useState } from 'react';
import { authRepository } from './modules/auth/auth.repository';
import { useCurrentUserStore } from './modules/auth/current-user.state';
XMLHttpRequest;
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentUser } = useCurrentUserStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await authRepository.getCurrentUser();
      setCurrentUser(user || null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div />;

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
