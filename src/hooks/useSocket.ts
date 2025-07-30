import { useEffect, useState } from 'react';
import { socketService } from '../utils/socket';
import { SensorReading, Alert } from '../types';

export const useSocket = () => {
  const [sensorData, setSensorData] = useState<SensorReading | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('sensor-data', (data: SensorReading) => {
      setSensorData({ ...data, timestamp: new Date().toISOString() });
     
    });

    socket.on('alert', (alertData: Alert) => {
      const newAlert = { ...alertData, timestamp: new Date().toISOString() };
     
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return {
    sensorData,
    alerts,
    isConnected,
  };
};