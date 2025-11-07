import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './pages/LandingPage';
import { DaftarNilai } from './pages/DaftarNilai';
import { GalleryPage } from './pages/GalleryPage';
import { LoginPage } from './pages/LoginPage';
import { PraktikumPage } from './pages/PraktikumPage';
import { PraktikumDetailPage } from './pages/PraktikumDetailPage';
import { PengumpulanTugasPage } from './pages/PengumpulanTugasPage';
import { ManageCodesPage } from './pages/ManageCodesPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/nilai" element={<DaftarNilai />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/praktikum" element={<PraktikumPage />} />
            <Route path="/praktikum/:id" element={<PraktikumDetailPage />} />
            <Route path="/praktikum/:id/submit" element={<PengumpulanTugasPage />} />
            <Route path="/manage-codes" element={<ManageCodesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
