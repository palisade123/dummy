import { Microscope, Users, BookOpen, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Virtual Lab Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our state-of-the-art virtual laboratory, view student achievements,
            and discover our gallery of innovative research and experiments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Microscope className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Advanced Research
            </h3>
            <p className="text-gray-600 text-center">
              Cutting-edge virtual laboratory facilities for conducting experiments
              and research in a safe, controlled environment.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Student Excellence
            </h3>
            <p className="text-gray-600 text-center">
              Track and celebrate student achievements with our comprehensive
              scoring system showcasing academic performance.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Interactive Learning
            </h3>
            <p className="text-gray-600 text-center">
              Engage with our collection of experiments, demonstrations, and
              educational materials in our virtual gallery.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Laboratory workspace"
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              About Our Virtual Lab
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Virtual Lab Portfolio represents the future of education and research.
              Through innovative digital platforms, we provide students and researchers
              with access to world-class laboratory experiences from anywhere in the world.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Explore our student achievements, browse through our gallery of experiments,
              and discover how we're revolutionizing the way science is taught and learned.
            </p>
          </div>
        </div>
      </div>

      {user && (
        <button
          onClick={() => navigate('/manage-codes')}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 group z-50"
          title="Manage Codes"
        >
          <Key className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Manage Codes
          </span>
        </button>
      )}
    </div>
  );
};
