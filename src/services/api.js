// src/services/api.js
import { message } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Cache object để lưu trữ data
const cache = {
  houses: null,
  rooms: new Map(), // key: houseId, value: rooms[]
  devices: new Map(), // key: roomId, value: devices[]
  lastFetch: {
    houses: null,
    rooms: new Map(),
    devices: new Map()
  }
};

// Cache expire time (5 phút)
const CACHE_EXPIRE_TIME = 5 * 60 * 1000;

// Utility function để check cache có hết hạn không
const isCacheExpired = (timestamp) => {
  return !timestamp || Date.now() - timestamp > CACHE_EXPIRE_TIME;
};

// Utility function để lấy token từ localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Utility function để tạo headers với Bearer token
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic fetch function với error handling
const apiRequest = async (url, options = {}) => {
  const {
    useAuth = true,   // 👈 mặc định có auth
    ...fetchOptions
  } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(useAuth ? createAuthHeaders() : {}),
        ...fetchOptions.headers
      }
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (_) {}
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    message.error(`Lỗi kết nối API: ${error.message}`);
    throw error;
  }
};


export const apiService = {
  getUserProfile: async () => {
  try {
    const data = await apiRequest('/auth/profile');
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy profile:', error);
    return null;
  }
},

  
  // Lấy danh sách houses
  getHouses: async () => {
    // Check cache trước
    if (cache.houses && !isCacheExpired(cache.lastFetch.houses)) {
      return cache.houses;
    }

    try {
      const houses = await apiRequest('/houses');
      
      // Lưu vào cache
      cache.houses = houses;
      cache.lastFetch.houses = Date.now();
      
      return houses;
    } catch (error) {
      console.error('Error fetching houses:', error);
      return [];
    }
  },

  // Lấy rooms của house
  getRooms: async (houseId) => {
    // Check cache trước
    if (cache.rooms.has(houseId) && !isCacheExpired(cache.lastFetch.rooms.get(houseId))) {
      return cache.rooms.get(houseId);
    }

    try {
      const rooms = await apiRequest(`/houses/${houseId}/rooms`);
      
      // Lưu vào cache
      cache.rooms.set(houseId, rooms);
      cache.lastFetch.rooms.set(houseId, Date.now());
      
      return rooms;
    } catch (error) {
      console.error(`Error fetching rooms for house ${houseId}:`, error);
      return [];
    }
  },

  // Lấy devices của room
  getDevices: async (roomId) => {
    // Check cache trước
    if (cache.devices.has(roomId) && !isCacheExpired(cache.lastFetch.devices.get(roomId))) {
      return cache.devices.get(roomId);
    }

    try {
      const devices = await apiRequest(`/devices/room/${roomId}`);
      
      // Lưu vào cache
      cache.devices.set(roomId, devices);
      cache.lastFetch.devices.set(roomId, Date.now());
      
      return devices;
    } catch (error) {
      console.error(`Error fetching devices for room ${roomId}:`, error);
      return [];
    }
  },

  // CRUD operations cho House
  createHouse: async (houseData) => {
    try {
      const newHouse = await apiRequest('/houses', {
        method: 'POST',
        body: JSON.stringify(houseData)
      });
      
      // Clear cache để load lại data mới
      cache.houses = null;
      cache.lastFetch.houses = null;
      
      message.success('Thêm nhà thành công!');
      return newHouse;
    } catch (error) {
      console.error('Error creating house:', error);
      throw error;
    }
  },

  updateHouse: async (houseId, houseData) => {
    try {
      const updatedHouse = await apiRequest(`/houses/${houseId}`, {
        method: 'PUT',
        body: JSON.stringify(houseData)
      });
      
      // Clear cache để load lại data mới
      cache.houses = null;
      cache.lastFetch.houses = null;
      
      message.success('Cập nhật nhà thành công!');
      return updatedHouse;
    } catch (error) {
      console.error('Error updating house:', error);
      throw error;
    }
  },

  deleteHouse: async (houseId) => {
    try {
      await apiRequest(`/houses/${houseId}`, {
        method: 'DELETE'
      });
      
      // Clear cache để load lại data mới
      cache.houses = null;
      cache.rooms.delete(houseId);
      cache.lastFetch.houses = null;
      cache.lastFetch.rooms.delete(houseId);
      
      message.success('Xóa nhà thành công!');
    } catch (error) {
      console.error('Error deleting house:', error);
      throw error;
    }
  },

  // CRUD operations cho Room
  createRoom: async (houseId, roomData) => {
    try {
      const newRoom = await apiRequest(`/houses/${houseId}/rooms`, {
        method: 'POST',
        body: JSON.stringify(roomData)
      });
      
      // Clear cache của house để load lại rooms
      cache.rooms.delete(houseId);
      cache.lastFetch.rooms.delete(houseId);
      
      message.success('Thêm phòng thành công!');
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  updateRoom: async (roomId, roomData) => {
    try {
      const updatedRoom = await apiRequest(`/rooms/${roomId}`, {
        method: 'PUT',
        body: JSON.stringify(roomData)
      });
      
      // Clear cache để load lại data mới
      cache.houses = null;
      cache.lastFetch.houses = null;
      
      message.success('Cập nhật phòng thành công!');
      return updatedRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  deleteRoom: async (roomId) => {
    try {
      await apiRequest(`/rooms/${roomId}`, {
        method: 'DELETE'
      });
      
      // Clear cache để load lại data mới
      cache.houses = null;
      cache.devices.delete(roomId);
      cache.lastFetch.houses = null;
      cache.lastFetch.devices.delete(roomId);
      
      message.success('Xóa phòng thành công!');
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

    // CRUD operation cho Device
    createDevice: async (deviceData) => {
      try {
        const newDevice = await apiRequest(`/devices`, {
          method: 'POST',
          body: JSON.stringify(deviceData)
        });
    
        // Xóa cache để load lại thiết bị mới sau khi thêm
        const roomId = deviceData.roomId;
        if (roomId) {
          cache.devices.delete(roomId);
          cache.lastFetch.devices.delete(roomId);
        }
    
        message.success('Thêm thiết bị thành công!');
        return newDevice;
      } catch (error) {
        console.error('Error creating device:', error);
        throw error;
      }
    },

    controlDevice: async (deviceId, stateDto) => {
  try {
    const res = await apiRequest(`/devices/${deviceId}/control`, {
      method: 'POST',
      body: JSON.stringify(stateDto)
    });
    message.success('Thiết bị đã được điều khiển!');
    return res;
  } catch (error) {
    console.error('Lỗi điều khiển thiết bị:', error);
    throw error;
  }
},
updateDevice: async (deviceId, deviceData) => {
  try {
    console.log("devicesID: " + deviceId, deviceData);
    const updatedDevice = await apiRequest(`/devices/${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData)
    });

    // Clear cache để load lại thiết bị mới sau khi cập nhật
    const roomId = deviceData.roomId;
    if (roomId) {
      cache.devices.delete(roomId);
      cache.lastFetch.devices.delete(roomId);
    }

    message.success('Cập nhật thiết bị thành công!');
    return updatedDevice;
  } catch (error) {
    console.error('Lỗi cập nhật thiết bị:', error);
    throw error;
  }
},
deleteDevice: async (deviceId, roomId) => {
  try {
    await apiRequest(`/devices/${deviceId}`, {
      method: 'DELETE',
    });

    if (roomId) {
      cache.devices.delete(roomId);
      cache.lastFetch.devices.delete(roomId);
    }

    message.success('Xóa thiết bị thành công!');
  } catch (error) {
    console.error('Lỗi xóa thiết bị:', error);
    throw error;
  }
},



    
  

  // Utility functions để quản lý cache
  clearCache: () => {
    cache.houses = null;
    cache.rooms.clear();
    cache.devices.clear();
    cache.lastFetch.houses = null;
    cache.lastFetch.rooms.clear();
    cache.lastFetch.devices.clear();
  },

  // Xóa cache của house cụ thể (dùng khi CRUD)
  clearHouseCache: (houseId) => {
    cache.houses = null;
    cache.rooms.delete(houseId);
    cache.lastFetch.houses = null;
    cache.lastFetch.rooms.delete(houseId);
  },

  // Xóa cache của room cụ thể (dùng khi CRUD)
  clearRoomCache: (roomId) => {
    cache.devices.delete(roomId);
    cache.lastFetch.devices.delete(roomId);
  }
};
export { API_BASE_URL, apiRequest };


