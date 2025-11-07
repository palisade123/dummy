import { Microscope, Users, BookOpen, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Laboratorium Alam
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fasilitas laboratorium virtual yang berada di Labtek VA ITB Jatinangor, 
            di bawah Program Studi Rekayasa Kehutanan. Melalui platform ini, Anda dapat menjelajahi eksperimen inovatif, pencapaian mahasiswa, serta berbagai kegiatan penelitian unggulan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Microscope className="w-16 h-16 text-primary-solid" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Riset Terdepan
            </h3>
            <p className="text-gray-600 text-center">
              Lakukan berbagai percobaan inovatif dan penelitian mutakhir secara aman melalui fasilitas laboratorium virtual kami.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16 text-primary-solid" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Keunggulan Mahasiswa
            </h3>
            <p className="text-gray-600 text-center">
              Apresiasi prestasi mahasiswa melalui sistem penilaian transparan berbasis data.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-primary-solid" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Pembelajaran Interaktif
            </h3>
            <p className="text-gray-600 text-center">
              Tingkatkan pemahaman Anda dengan konten dinamis yang menghadirkan sains secara nyata dan menarik.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="src/assets/gdgKehutanan.jpg"
            alt="Laboratory workspace"
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tentang Laboratorium Virtual Kami
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Laboratorium Alam adalah laboratorium virtual yang berpusat di Labtek VA ITB Jatinangor dan dikembangkan oleh Program Studi Rekayasa Kehutanan. 
              Kami menghadirkan pengalaman belajar dan penelitian berbasis teknologi yang memudahkan 
              mahasiswa untuk bereksperimen kapan pun dan di mana pun.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Lihat berbagai hasil karya mahasiswa, eksplorasi eksperimen digital, 
              dan rasakan inovasi baru dalam pembelajaran sains modern.
            </p>
          </div>
        </div>
      </div>

      {user && (
        <button
          onClick={() => navigate('/manage-codes')}
          className="fixed bottom-8 right-8 text-primary transition-colors text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200 group z-50"
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
