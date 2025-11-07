import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Mahasiswa } from '../lib/supabase';
import { Plus, Pencil, Trash2, Award, BarChart3 } from 'lucide-react';

export const DaftarNilai = () => {
  const { user } = useAuth();
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nama: '', nim: '', nilai: '' });

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    const { data, error } = await supabase
      .from('mahasiswa')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMahasiswa(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const nilai = parseFloat(formData.nilai);
    if (nilai < 0 || nilai > 100) {
      alert('Nilai must be between 0 and 100');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('mahasiswa')
        .update({ nama: formData.nama, nim: formData.nim, nilai })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        resetForm();
        fetchMahasiswa();
      }
    } else {
      const { error } = await supabase
        .from('mahasiswa')
        .insert([{ nama: formData.nama, nim: formData.nim, nilai }]);

      if (!error) {
        resetForm();
        fetchMahasiswa();
      }
    }
  };

  const handleEdit = (item: Mahasiswa) => {
    setFormData({ nama: item.nama, nim: item.nim, nilai: item.nilai.toString() });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this record?')) return;

    const { error } = await supabase.from('mahasiswa').delete().eq('id', id);
    if (!error) {
      fetchMahasiswa();
    }
  };

  const resetForm = () => {
    setFormData({ nama: '', nim: '', nilai: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const averageScore = mahasiswa.length > 0
    ? (mahasiswa.reduce((sum, m) => sum + m.nilai, 0) / mahasiswa.length).toFixed(2)
    : '0';

  const gradeDistribution = mahasiswa.reduce((acc, m) => {
    const grade =
      m.nilai >= 85 ? 'A' :
      m.nilai >= 70 ? 'B' :
      m.nilai >= 60 ? 'C' :
      m.nilai >= 50 ? 'D' : 'E';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = [
    { grade: 'A', count: gradeDistribution['A'] || 0, color: 'bg-green-500', label: '85-100' },
    { grade: 'B', count: gradeDistribution['B'] || 0, color: 'bg-blue-500', label: '70-84' },
    { grade: 'C', count: gradeDistribution['C'] || 0, color: 'bg-yellow-500', label: '60-69' },
    { grade: 'D', count: gradeDistribution['D'] || 0, color: 'bg-orange-500', label: '50-59' },
    { grade: 'E', count: gradeDistribution['E'] || 0, color: 'bg-red-500', label: '0-49' },
  ];

  const maxCount = Math.max(...gradeData.map(g => g.count), 1);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Daftar Nilai Mahasiswa</h1>
            {user && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-primary-gradient text-white px-4 py-2 rounded-lg hover:bg-primary-gradient transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Student</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-gray-600 bg-green-50 p-4 rounded-lg">
            <Award className="w-5 h-5 text-primary-solid" />
            <span className="font-semibold">
              Average Score: <span className="text-primary-solid text-xl">{averageScore}</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-green-700" />
            <h2 className="text-2xl font-bold text-gray-900">Grade Distribution</h2>
          </div>

          <div className="space-y-4">
            {gradeData.map((item) => (
                <div key={item.grade} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-700 w-8">{item.grade}</span>
                      <span className="text-sm text-gray-500">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      {item.count} student{item.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-white text-sm font-semibold">
                          {((item.count / mahasiswa.length) * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {showForm && user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIM
                  </label>
                  <input
                    type="text"
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.nilai}
                    onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                    required
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-primary-gradient text-white px-6 py-2 rounded-lg hover:bg-primary-gradient transition-all"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  {user && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mahasiswa.map((item) => {
                  const grade =
                    item.nilai >= 85 ? 'A' :
                    item.nilai >= 70 ? 'B' :
                    item.nilai >= 60 ? 'C' :
                    item.nilai >= 50 ? 'D' : 'E';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.nim}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.nilai}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {grade}
                        </span>
                      </td>
                      {user && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {mahasiswa.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No student records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
