// src/data/projects.ts
// src/data/projects.ts
export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  // D3 force simulation injects these
  x?: number;
  y?: number;
  // D3 drag uses these to fix position
  fx?: number | null;
  fy?: number | null;
};

export const projects: Project[] = [
  {
    id: 'esp32-devboard',
    title: 'ESP32 Devboard',
    description: 'Custom development board with USB-C, LiPo charging, and debug headers.',
    tech: ['PCB Design', 'KiCad', 'Embedded C', 'Power Management'],
  },
  {
    id: 'sensor-node',
    title: 'Wireless Sensor Node',
    description: 'Low-power LoRa node for environmental monitoring.',
    tech: ['LoRa', 'Battery Optimization', 'PCB Design', 'Sensors'],
  },
  {
    id: 'cloud-dashboard',
    title: 'Cloud Monitoring Dashboard',
    description: 'Real-time data visualization for sensor networks.',
    tech: ['React', 'Node.js', 'MQTT', 'TypeScript'],
  },
  {
    id: 'firmware-updater',
    title: 'OTA Firmware Updater',
    description: 'Secure over-the-air update system for ESP32 devices.',
    tech: ['C++', 'TLS', 'Embedded C', 'Partitioning'],
  },
];