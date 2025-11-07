import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, PraktikumModule } from '../lib/supabase';
import { ArrowLeft, FileText, Video, Upload, Users, ExternalLink } from 'lucide-react';

interface Submission {
  id: string;
  nama_mahasiswa: string;
  nim: string;
  file_url: string;
  submitted_at: string;
}

export const PraktikumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState<PraktikumModule | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (id) {
      fetchModule();
      if (user) {
        fetchSubmissions();
      }
    }
  }, [id, user]);

  const fetchModule = async () => {
    const { data, error } = await supabase
      .from('praktikum_modules')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && data) {
      setModule(data);
    }
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    const { data, error } = await supabase
      .from('tugas_submissions')
      .select('*')
      .eq('praktikum_id', id)
      .order('submitted_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setLoadingSubmissions(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600 mb-4">Module not found</div>
        <button
          onClick={() => navigate('/praktikum')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Modules
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/praktikum')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Modules</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-primary-gradient text-white text-xl font-bold px-5 py-2 rounded-lg">
              {module.nomor}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">{module.judul}</h1>
          </div>
          <p className="text-gray-600 mt-4">{module.deskripsi}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Modul PDF</h2>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src={module.pdf_url}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
            <a
              href={module.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Open PDF in New Tab
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Video Tutorial</h2>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src={module.video_url}
                className="w-full h-full"
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
              <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loadingSubmissions ? (
              <div className="text-center py-8 text-gray-500">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No submissions yet for this module
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NIM
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.nama_mahasiswa}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {submission.nim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(submission.submitted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={submission.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View File</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {!user && (
        <button
          onClick={() => navigate(`/praktikum/${id}/submit`)}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 hover:scale-110 transition-all duration-200 group"
          title="Submit Assignment"
        >
          <Upload className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Submit Assignment
          </span>
        </button>
      )}
    </div>
  );
};
