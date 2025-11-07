import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Key, Plus, Pencil, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface UploadCode {
  id: string;
  code: string;
  is_active: boolean;
  created_at: string;
  used_count: number;
  max_uses: number | null;
}

export const ManageCodesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<UploadCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    is_active: true,
    max_uses: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCodes();
  }, [user, navigate]);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from('upload_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCodes(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const maxUses = formData.max_uses ? parseInt(formData.max_uses) : null;

    if (editingId) {
      const { error } = await supabase
        .from('upload_codes')
        .update({
          code: formData.code,
          is_active: formData.is_active,
          max_uses: maxUses,
        })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        resetForm();
        fetchCodes();
      }
    } else {
      const { error } = await supabase
        .from('upload_codes')
        .insert([{
          code: formData.code,
          is_active: formData.is_active,
          max_uses: maxUses,
          created_by: user.id,
        }]);

      if (!error) {
        resetForm();
        fetchCodes();
      } else {
        alert('Failed to create code. Code might already exist.');
      }
    }
  };

  const handleEdit = (item: UploadCode) => {
    setFormData({
      code: item.code,
      is_active: item.is_active,
      max_uses: item.max_uses?.toString() || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this code?')) return;

    const { error } = await supabase.from('upload_codes').delete().eq('id', id);
    if (!error) {
      fetchCodes();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('upload_codes')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      fetchCodes();
    }
  };

  const resetForm = () => {
    setFormData({ code: '', is_active: true, max_uses: '' });
    setShowForm(false);
    setEditingId(null);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Key className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Manage Upload Codes</h1>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Code</span>
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Manage upload codes that allow users to upload files to the gallery
          </p>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Upload Code' : 'Create New Upload Code'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    placeholder="e.g., UPLOAD2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.is_active.toString()}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
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
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {codes.map((item) => {
                  const usageText = item.max_uses
                    ? `${item.used_count} / ${item.max_uses}`
                    : `${item.used_count} / ∞`;
                  const isLimitReached = item.max_uses && item.used_count >= item.max_uses;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full font-semibold ${
                            item.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.is_active ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${isLimitReached ? 'text-red-600' : 'text-gray-900'}`}>
                            {usageText}
                          </span>
                          {isLimitReached && (
                            <AlertCircle className="w-4 h-4 text-red-500" title="Limit reached" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {codes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No upload codes found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
