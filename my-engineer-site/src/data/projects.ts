// src/data/projects.ts
export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  connections: string[];
  // D3 will add these during simulation
  x?: number;
  y?: number;
};

export const projects: Project[] = [
    {
    id: 'esp32-devboard',
    title: 'ESP32 Devboard',
    description: 'Custom development board with USB-C, LiPo charging, and debug headers.',
    tech: ['PCB Design', 'KiCad', 'Embedded C'],
    connections: ['sensor-node', 'firmware-updater'],
  },
  {
    id: 'sensor-node',
    title: 'Wireless Sensor Node',
    description: 'Low-power LoRa node for environmental monitoring.',
    tech: ['LoRa', 'Battery Optimization', 'PCB'],
    connections: ['esp32-devboard', 'cloud-dashboard'],
  },
  {
    id: 'cloud-dashboard',
    title: 'Cloud Monitoring Dashboard',
    description: 'Real-time data visualization for sensor networks.',
    tech: ['React', 'Node.js', 'MQTT'],
    connections: ['sensor-node'],
  },
  {
    id: 'firmware-updater',
    title: 'OTA Firmware Updater',
    description: 'Secure over-the-air update system for ESP32 devices.',
    tech: ['C++', 'TLS', 'Partitioning'],
    connections: ['esp32-devboard'],
  },
];