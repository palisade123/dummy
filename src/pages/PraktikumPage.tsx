import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, PraktikumModule } from '../lib/supabase';
import { BookOpen, ChevronRight } from 'lucide-react';

export const PraktikumPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<PraktikumModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('praktikum_modules')
      .select('*')
      .order('nomor', { ascending: true });

    if (!error && data) {
      setModules(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary-solid" />
            <h1 className="text-3xl font-bold text-gray-900">Praktikum Modules</h1>
          </div>
          <p className="text-gray-600">Pilih modul praktikum yang ingin Anda pelajari</p>
        </div>

        <div className="grid gap-4">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(`/praktikum/${module.id}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-primary-gradient text-white text-lg font-bold px-4 py-2 rounded-lg">
                      {module.nomor}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-gradient transition-all">
                      {module.judul}
                    </h2>
                  </div>
                  <p className="text-gray-600 ml-16">{module.deskripsi}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No praktikum modules available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
