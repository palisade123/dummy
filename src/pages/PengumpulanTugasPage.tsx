import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, PraktikumModule } from '../lib/supabase';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export const PengumpulanTugasPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [module, setModule] = useState<PraktikumModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadCode, setUploadCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nama_mahasiswa: '',
    nim: '',
  });

  useEffect(() => {
    if (id) {
      fetchModule();
    }
  }, [id]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.includes('pdf')) {
        setError('Please select a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      setError('Admin users cannot submit assignments. This feature is for students only.');
      return;
    }

    if (!file || !uploadCode) {
      setError('Please fill all fields and select a file');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data: codeData, error: codeError } = await supabase
        .from('upload_codes')
        .select('*')
        .eq('code', uploadCode)
        .eq('is_active', true)
        .maybeSingle();

      if (codeError || !codeData) {
        setError('Invalid or inactive upload code');
        setSubmitting(false);
        return;
      }

      if (codeData.max_uses && codeData.used_count >= codeData.max_uses) {
        setError('This upload code has reached its maximum usage limit');
        setSubmitting(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tugas-submissions')
        .upload(filePath, file, {
          contentType: 'application/pdf'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tugas-submissions')
        .getPublicUrl(filePath);

      const { error: submitError } = await supabase
        .from('tugas_submissions')
        .insert([{
          praktikum_id: id,
          user_id: null,
          file_url: publicUrl,
          nama_mahasiswa: formData.nama_mahasiswa,
          nim: formData.nim,
        }]);

      if (submitError) throw submitError;

      await supabase
        .from('upload_codes')
        .update({ used_count: codeData.used_count + 1 })
        .eq('id', codeData.id);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/praktikum/${id}`);
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setError('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  if (user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <div className="text-xl text-gray-600 mb-4">Admin cannot submit assignments</div>
        <p className="text-gray-500 mb-4">This feature is for students only</p>
        <button
          onClick={() => navigate(`/praktikum/${id}`)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Module
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/praktikum/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Module</span>
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Upload className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Submit Assignment</h1>
          </div>
          <p className="text-gray-600">
            Praktikum {module.nomor}: {module.judul}
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Submitted!</h2>
            <p className="text-gray-600">Your assignment has been submitted successfully.</p>
            <p className="text-gray-500 text-sm mt-2">Redirecting back to module...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadCode}
                  onChange={(e) => setUploadCode(e.target.value)}
                  required
                  placeholder="Enter your upload code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contact the administrator to get an upload code
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Mahasiswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_mahasiswa}
                  onChange={(e) => setFormData({ ...formData, nama_mahasiswa: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan NIM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF File <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          required
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    {file && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/praktikum/${id}`)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
