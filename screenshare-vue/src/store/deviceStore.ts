import { defineStore } from "pinia";
import { reactive } from "vue";

export const useDeviceStore = defineStore("deviceStore", () => {
  const devices = reactive<{ username: string; connected: boolean }[]>([]);
  const selectedDevice = reactive<{ username: string | null }>({
    username: null,
  });

  const addDevice = (username: string) => {
    if (!devices.some((device) => device.username === username)) {
      devices.push({ username, connected: false });
    }
  };

  const removeDevice = (username: string) => {
    const index = devices.findIndex((device) => device.username === username);
    if (index !== -1) devices.splice(index, 1);
  };

  const selectDevice = (username: string) => {
    selectedDevice.username = username;
  };

  return { devices, selectedDevice, addDevice, removeDevice, selectDevice };
});
