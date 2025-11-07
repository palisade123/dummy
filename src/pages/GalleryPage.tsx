import { Image as ImageIcon } from 'lucide-react';

const staticGalleryImages = [
  {
    id: '1',
    title: 'Laboratory Equipment Setup',
    image_url: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-01-15'
  },
  {
    id: '2',
    title: 'Microscope Analysis',
    image_url: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-01-20'
  },
  {
    id: '3',
    title: 'Chemical Experiment',
    image_url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-02-05'
  },
  {
    id: '4',
    title: 'Laboratory Research',
    image_url: 'https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-02-12'
  },
  {
    id: '5',
    title: 'Scientific Testing',
    image_url: 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-02-18'
  },
  {
    id: '6',
    title: 'Lab Instruments',
    image_url: 'https://images.pexels.com/photos/1366942/pexels-photo-1366942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    date: '2024-03-01'
  }
];

export const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery</h1>
              <p className="text-gray-600">Explore our collection of experiments and research</p>
            </div>
          </div>
        </div>

        {staticGalleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticGalleryImages.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative aspect-video">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Images Yet</h3>
            <p className="text-gray-600">Check back later for gallery updates</p>
          </div>
        )}
      </div>
    </div>
  );
};
