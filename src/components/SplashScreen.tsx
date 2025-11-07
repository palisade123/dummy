import { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import Logo from '../assets/splascreengreen.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    } bg-primary-gradient`}
  >
    <div className="text-center">
      <div className="flex justify-center mb-6 animate-bounce">
        <div className="bg-white p-6 rounded-full shadow-2xl">
          <img src={Logo} alt="Virtual Lab logo" className="h-12 w-auto" />
        </div>
      </div>
      <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
        Laboratorium Alam
      </h1>
      <p className="text-xl text-white/80">
        Sekolah Ilmu Teknologi Hayati - Rekayasa
      </p>
      <div className="mt-8 flex justify-center space-x-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);

};
