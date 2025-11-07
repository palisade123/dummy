import { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="flex justify-center mb-6 animate-bounce">
          <div className="bg-white p-6 rounded-full shadow-2xl">
            <FlaskConical className="w-20 h-20 text-blue-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-3 animate-pulse">
          Virtual Lab
        </h1>
        <p className="text-xl text-blue-100">
          Portfolio & Research Platform
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
