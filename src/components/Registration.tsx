import React, { useState } from 'react';
import { MapPin, User, Phone, Navigation, Loader2 } from 'lucide-react';
import { apiService } from '../utils/api';
import { RegisterData } from '../types';

interface RegistrationProps {
  onRegister: (token: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onRegister, showToast }) => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    phone: '',
    location: {
      name: '',
      latitude: 0,
      longitude: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof RegisterData],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by this browser', 'error');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
        setGettingLocation(false);
        showToast('Location captured successfully!', 'success');
      },
      (error) => {
        setGettingLocation(false);
        showToast('Failed to get location. Please enter manually.', 'error');
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.location.name) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    if (formData.location.latitude === 0 || formData.location.longitude === 0) {
      showToast('Please set your location coordinates', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(formData);
      localStorage.setItem('jwt_token', response.token);
      onRegister(response.token);
      showToast('Registration successful! Welcome aboard!', 'success');
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20  rounded-2xl mb-4">
            <img
           src="https://res.cloudinary.com/daxghemr4/image/upload/v1753901755/SERFFRPJCZBOVE64DQYFYCJRCQ_qoayrg.jpg"
                alt="FloodWatch Logo"
               className="w-full h-full rounded-2xl "
             />

          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FloodWatch</h1>
          <p className="text-gray-600">Update your profile to start monitoring your area</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} />
                  Phone Number
                </label>
             <input
                  type="tel"
                  pattern="^(\+254|0)?7\d{8}$"
                  title="Enter a valid Kenyan phone number (e.g., 07XXXXXXXX or +2547XXXXXXXX)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 placeholder="e.g., 0712345678 or +254712345678"
                 required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  Location Name
                </label>
                <input
                  type="text"
                  value={formData.location.name}
                  onChange={(e) => handleInputChange('location.name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Downtown District, City Name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={(e) => handleInputChange('location.latitude', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={(e) => handleInputChange('location.longitude', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.0"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gettingLocation ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                {gettingLocation ? 'Getting Location...' : 'Get My Location'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : null}
              {loading ? 'Updating Profile...' : 'Update Profile  & Start Monitoring'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};