export interface User {
  id: string;
  name: string;
  phone: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface SensorReading {
  temperature: number;
  humidity: number;
  waterLevel: number;
  rainSensor: number;
  timestamp?: string;
}

export interface Alert {
  phone: string;
  message: string;
  timestamp?: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}