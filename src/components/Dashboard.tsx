import React, { useState } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Waves, 
  CloudRain, 
  AlertTriangle, 
  Activity,
  User,
  MapPin,
  Play,
  Loader2,
  LogOut
} from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { apiService } from '../utils/api';

interface DashboardProps {
  onLogout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, showToast }) => {
  const { sensorData, alerts, isConnected } = useSocket();
  const [analyzing, setAnalyzing] = useState(false);

  const triggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      await apiService.triggerAnalysis();
      showToast('Analysis triggered successfully!', 'success');
    } catch (error) {
      showToast('Failed to trigger analysis', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'No data';
    return new Date(timestamp).toLocaleTimeString();
  };

  const getSensorValue = (value: number | undefined, unit: string) => {
    return value !== undefined ? `${value}${unit}` : '--';
  };

  const getSensorStatus = (value: number | undefined, thresholds: { low: number; high: number }) => {
    if (value === undefined) return 'text-gray-400';
    if (value < thresholds.low) return 'text-blue-500';
    if (value > thresholds.high) return 'text-red-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Flood Monitor</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis Trigger */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h2>
                <p className="text-gray-600">Trigger flood risk analysis based on current sensor data</p>
              </div>
              <button
                onClick={triggerAnalysis}
                disabled={analyzing}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {analyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                {analyzing ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>
          </div>
        </div>

        {/* Sensor Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Temperature</h3>
                  <p className="text-xs text-gray-600">Current reading</p>
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getSensorStatus(sensorData?.temperature, { low: 15, high: 35 })}`}>
              {getSensorValue(sensorData?.temperature, '°C')}
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {formatTimestamp(sensorData?.timestamp)}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Humidity</h3>
                  <p className="text-xs text-gray-600">Air moisture</p>
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getSensorStatus(sensorData?.humidity, { low: 30, high: 80 })}`}>
              {getSensorValue(sensorData?.humidity, '%')}
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {formatTimestamp(sensorData?.timestamp)}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Water Level</h3>
                  <p className="text-xs text-gray-600">Current depth</p>
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getSensorStatus(sensorData?.waterLevel, { low: 0, high: 50 })}`}>
              {getSensorValue(sensorData?.waterLevel, 'cm')}
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {formatTimestamp(sensorData?.timestamp)}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center">
                  <CloudRain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rain Sensor</h3>
                  <p className="text-xs text-gray-600">Precipitation</p>
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-2 ${getSensorStatus(sensorData?.rainSensor, { low: 0, high: 70 })}`}>
              {getSensorValue(sensorData?.rainSensor, '')}
            </div>
            <p className="text-sm text-gray-600">
              Last updated: {formatTimestamp(sensorData?.timestamp)}
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {alerts.length}
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No flood alerts at this time. Your area is being monitored.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl"
                >
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {alert.phone} • {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};