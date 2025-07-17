// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { message } from 'antd';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  });

  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Người dùng',
    email: 'user@example.com'
  });
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
const [selectedDeviceDetails, setSelectedDeviceDetails] = useState(null);


  // Transform API data thành tree structure
  const transformToTreeData = (houses, allRooms, allDevices) => {
    return houses.map(house => ({
      key: `house-${house.id}`,
      title: house.name,
      type: 'house',
      data: house,
      icon: '🏠',
      children: (allRooms.get(house.id) || []).map(room => ({
        key: `room-${room.id}`,
        title: room.name,
        type: 'room',
        data: room,
        icon: '🚪',
        children: (allDevices.get(room.id) || []).map(device => ({
          key: `device-${device.id}`,
          title: device.name,
          type: 'device',
          data: device,
          icon: '📱',
          isLeaf: true,
          isOn: device.isOn // ✅ Gán thẳng ra ngoài để `Sidebar` dùng
        }))
        
        
      }))
    }));
  };
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };
  

  // Load tất cả data (eager loading)
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Load houses trước
      const res = await apiService.getHouses();
      const houses = res.data;

      console.log('✅ Houses:', houses);

      if (houses.length === 0) {
        setTreeData([]);
        setLoading(false);
        return;
      }

      // 2. Load tất cả rooms cho mỗi house
      const allRooms = new Map();
      const roomPromises = houses.map(async (house) => {
        const rooms = (await apiService.getRooms(house.id)).data;
        allRooms.set(house.id, rooms);
        return rooms;
      });

      const roomResults = await Promise.all(roomPromises);
      console.log('roomResults:', roomResults);
      const flatRooms = roomResults.flat();

      // 3. Load tất cả devices cho mỗi room
      const allDevices = new Map();
      const devicePromises = flatRooms.map(async (room) => {
        const devices = (await apiService.getDevices(room.id)).data;
        allDevices.set(room.id, devices);
        return devices;
      });

      await Promise.all(devicePromises);

      // 4. Transform data và set state
      const transformedData = transformToTreeData(houses, allRooms, allDevices);
      setTreeData(transformedData);

      message.success('Tải dữ liệu thành công!');
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      setTreeData([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data (xóa cache và load lại)
  const refreshData = async () => {
    apiService.clearCache();
    await loadAllData();
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await apiService.getUserProfile();
        setUserInfo({
          name: data.data.userName,
          email: data.data.email,
        });
      } catch (error) {
        console.error('Không thể tải thông tin người dùng:', error);
      }
    };
    // Nếu đã đăng nhập, tải thông tin người dùng
    console.log(isLoggedIn);
    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);
  
  
  
  

  // CRUD operations cho House
  const addHouse = async (houseData) => {
    try {
      await apiService.createHouse(houseData);
      await refreshData();
    } catch (error) {
      console.error('Error adding house:', error);
      throw error;
    }
  };

  const updateHouse = async (houseId, houseData) => {
    try {
      await apiService.updateHouse(houseId, houseData);
      await refreshData();
    } catch (error) {
      console.error('Error updating house:', error);
      throw error;
    }
  };

  const deleteHouse = async (houseId) => {
    try {
      await apiService.deleteHouse(houseId);
      await refreshData();
    } catch (error) {
      console.error('Error deleting house:', error);
      throw error;
    }
  };

  // CRUD operations cho Room
  const addRoom = async (houseId, roomData) => {
    try {
      await apiService.createRoom(houseId, roomData);
      await refreshData();
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      await apiService.updateRoom(roomId, roomData);
      await refreshData();
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await apiService.deleteRoom(roomId);
      await refreshData();
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  };

  const addDevice = async (roomId, deviceData) => {
    try {
      await apiService.createDevice({
        ...deviceData,
        roomId,
      });
      apiService.clearRoomCache(roomId);
      await refreshData();
    } catch (error) {
      console.error('Error adding device:', error);
      throw error;
    }
  };
  

  const updateDevice = async (deviceId, data) => {
    try {
      const res = await apiService.updateDevice(`${deviceId}`, data);
      await refreshData();
      if (res.data?.success) {
        message.success("Cập nhật thiết bị thành công");
      } else {
        message.error(res.data?.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật thiết bị:", err);
      message.error("Lỗi hệ thống khi cập nhật thiết bị");
    }
  };
  
  

  const deleteDevice = async (deviceId) => {
    try {
      await apiService.deleteDevice(deviceId);
      await refreshData();
      message.success("Xóa thiết bị thành công");
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị:", error);
      message.error("Xóa thiết bị thất bại");
      throw error;
    }
  };
  
  // src/context/AppContext.js
const logout = () => {
  // 1. Xóa token khỏi localStorage
  localStorage.removeItem('token');
  
  // 2. Cập nhật state
  setIsLoggedIn(false);
  
  // 3. Redirect sẽ tự động xảy ra nhờ ProtectedRoute
};

  const contextValue = {
    isLoggedIn,             
    setIsLoggedIn,          
    // Data states
    treeData,
    selectedNode,
    loading,
    userInfo,
    selectedDeviceId, setSelectedDeviceId,
  selectedDeviceDetails, setSelectedDeviceDetails,
    
    // Setters
    setSelectedNode,
    setUserInfo,
    
    // Actions
    loadAllData,
    refreshData,
    
    // CRUD operations (để implement sau)
    addHouse,
    updateHouse,
    deleteHouse,
    addRoom,
    updateRoom,
    deleteRoom,
    addDevice,
    updateDevice,
    deleteDevice,

    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};