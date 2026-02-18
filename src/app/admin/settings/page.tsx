'use client';

import { useState } from 'react';
import { Image as ImageIcon, Plus, X, Upload, Save, AlertCircle } from 'lucide-react';

interface SliderImage {
  id: number;
  url: string;
  title?: string;
  order: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('slider');
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([
    { id: 1, url: '/slider/slide1.jpg', title: 'Summer Collection', order: 1 },
    { id: 2, url: '/slider/slide2.jpg', title: 'New Arrivals', order: 2 },
    { id: 3, url: '/slider/slide3.jpg', title: 'Best Sellers', order: 3 },
  ]);
  const [newImage, setNewImage] = useState({ url: '', title: '' });
  const [uploadPreview, setUploadPreview] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
        setNewImage({ ...newImage, url: reader.result as string });
      };
      reader.readAsDataURL(file);
      
      // In real implementation, upload to server
      // const formData = new FormData();
      // formData.append('image', file);
      // await fetch('/api/upload', { method: 'POST', body: formData });
    }
  };

  const addSliderImage = () => {
    if (newImage.url) {
      const newId = Math.max(...sliderImages.map(img => img.id), 0) + 1;
      setSliderImages([
        ...sliderImages,
        {
          id: newId,
          url: newImage.url,
          title: newImage.title,
          order: sliderImages.length + 1
        }
      ]);
      setNewImage({ url: '', title: '' });
      setUploadPreview('');
      
      // TODO: API call to save slider image
      // await fetch('/api/slider', { method: 'POST', body: JSON.stringify(newImage) });
    }
  };

  const deleteSliderImage = (id: number) => {
    if (confirm('Are you sure you want to delete this slider image?')) {
      setSliderImages(sliderImages.filter(img => img.id !== id));
      
      // TODO: API call to delete slider image
      // await fetch(`/api/slider/${id}`, { method: 'DELETE' });
    }
  };

  const moveImage = (id: number, direction: 'up' | 'down') => {
    const index = sliderImages.findIndex(img => img.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sliderImages.length - 1)
    ) {
      return;
    }

    const newImages = [...sliderImages];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    
    // Update order numbers
    newImages.forEach((img, idx) => {
      img.order = idx + 1;
    });
    
    setSliderImages(newImages);
  };

  const saveSliderSettings = () => {
    // TODO: API call to save all slider settings
    // await fetch('/api/slider/update', { method: 'PUT', body: JSON.stringify(sliderImages) });
    alert('Slider settings saved! (API integration pending)');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your website settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('slider')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'slider'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon size={20} />
                Home Slider
              </div>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'slider' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Home Page Slider Images</h2>
                  <button
                    onClick={saveSliderSettings}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  Manage the images displayed in the hero slider on your homepage. Drag to reorder.
                </p>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-start gap-2">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong>Note:</strong> API integration is pending. Upload and save functionality will work once the backend endpoint is ready.
                  </div>
                </div>
              </div>

              {/* Current Slider Images */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-900">Current Slider Images ({sliderImages.length})</h3>
                {sliderImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImage(image.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveImage(image.id, 'down')}
                        disabled={index === sliderImages.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {image.url.startsWith('data:') || image.url.startsWith('http') ? (
                        <img
                          src={image.url}
                          alt={image.title || `Slide ${image.order}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded font-semibold">
                          Order: {image.order}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={image.title || ''}
                        onChange={(e) => {
                          const updated = sliderImages.map(img =>
                            img.id === image.id ? { ...img, title: e.target.value } : img
                          );
                          setSliderImages(updated);
                        }}
                        placeholder="Slide title (optional)"
                        className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">{image.url}</p>
                    </div>

                    <button
                      onClick={() => deleteSliderImage(image.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}

                {sliderImages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No slider images yet. Add your first image below.
                  </div>
                )}
              </div>

              {/* Add New Image */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Add New Slider Image</h3>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upload Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          {uploadPreview ? (
                            <img
                              src={uploadPreview}
                              alt="Preview"
                              className="mx-auto max-h-40 rounded"
                            />
                          ) : (
                            <div>
                              <Upload size={48} className="mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">
                                Click to upload image
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter image URL
                        </label>
                        <input
                          type="text"
                          value={newImage.url}
                          onChange={(e) => {
                            setNewImage({ ...newImage, url: e.target.value });
                            setUploadPreview(e.target.value);
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Image Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slide Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={newImage.title}
                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                        placeholder="e.g., Summer Collection 2026"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
                      />

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-sm text-gray-900 mb-2">Recommended Image Size</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Width: 1920px</li>
                          <li>• Height: 600-800px</li>
                          <li>• Format: JPG, PNG, or WEBP</li>
                          <li>• Max file size: 5MB</li>
                        </ul>
                      </div>

                      <button
                        onClick={addSliderImage}
                        disabled={!newImage.url}
                        className="w-full mt-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                      >
                        <Plus size={20} />
                        Add to Slider
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">General Settings</h2>
              <p className="text-gray-600">
                General configuration options will be available in the next update.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
