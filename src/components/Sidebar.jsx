// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Tree, Button, Dropdown, Space, Avatar, Spin, Modal } from 'antd';
import { UserOutlined, SettingOutlined, PlusOutlined, LogoutOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { MoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import HouseModal from './HouseModal';
import RoomModal from './RoomModal';
import DeviceModal from './DeviceModal';
import DeviceControlModal from './DeviceControlModal';
import MemberModal from './MemberModal';
import UserProfileModal from './UserProfileModal';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';


const { confirm } = Modal;

const Sidebar = () => {
  const { 
    treeData, 
    selectedNode, 
    setSelectedNode, 
    userInfo, 
    loading, 
    refreshData,
    addHouse,
    addRoom,
    addDevice,
    updateHouse,
    updateRoom,
    updateDevice,
    deleteHouse,
    deleteRoom,
    deleteDevice
  } = useApp();

  // States cho các modal
  const [houseModalVisible, setHouseModalVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null); 
  const [controlVisible, setControlVisible] = useState(false);
const [currentDevice, setCurrentDevice] = useState(null);
const [memberModalVisible, setMemberModalVisible] = useState(false);
const navigate = useNavigate();       // 👈 và dòng này
const { logout } = useApp();  
const [profileModalVisible, setProfileModalVisible] = useState(false);
const [profileData, setProfileData] = useState(null);
  

const { setSelectedDeviceId } = useApp(); // import từ context

const onSelect = (selectedKeys, { node }) => {
  if (!node) return;
  setSelectedNode(node);

  if (node.type === 'device') {
    setSelectedDeviceId(node.data.id); 
  }
};



  // Menu dropdown cho user
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Cài đặt tài khoản'
    },
    {
      key: 'password',
      icon: <SettingOutlined />,
      label: 'Đổi mật khẩu'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true
    }
  ];

  // Xử lý click menu user
  const handleUserMenuClick = async ({ key }) => {
    switch (key) {
      case 'logout':
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        logout();         
        navigate('/login');      
        break;
        case 'profile':
          const data = await apiService.getUserProfile();
          setProfileData(data.data);
          setProfileModalVisible(true);
          console.log('Profile Data:', profileData);
          break;
      case 'password':
        console.log('Đổi mật khẩu');
        break;
      default:
        break;
    }
  };

  const handleAddClick = () => {
    // Luôn thêm House, bỏ qua selectedNode
    setEditingHouse(null);
    setHouseModalVisible(true);
  };
  

  // Xử lý xóa với confirm dialog
  const handleDelete = (node) => {
    confirm({
      title: `Xác nhận xóa ${node.type === 'house' ? 'nhà' : 'phòng'}`,
      content: `Bạn có chắc chắn muốn xóa "${node.data.name}"?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          if (node.type === 'house') {
            await deleteHouse(node.data.id);
          } else if (node.type === 'room') {
            await deleteRoom(node.data.id);
          } else if (node.type === 'device') {
            await deleteDevice(node.data.id);
          }
        } catch (error) {
          console.error('Error deleting:', error);
        }
      }
    });
  };

  // Menu CRUD cho từng node
  const getNodeMenu = (node) => {
    const menuItems = [];
  
    if (node.type === 'house') {
      menuItems.push({ key: 'add', label: 'Thêm phòng' });
      menuItems.push({ key: 'add-member', label: 'Thêm member' });
      menuItems.push({ key: 'edit', label: 'Sửa nhà' });
      menuItems.push({ key: 'delete', label: 'Xoá nhà', danger: true });
    } else if (node.type === 'room') {
      menuItems.push({ key: 'add', label: 'Thêm thiết bị' });
      menuItems.push({ key: 'edit', label: 'Sửa phòng' });
      menuItems.push({ key: 'delete', label: 'Xoá phòng', danger: true });
    } else if (node.type === 'device') {
      menuItems.push({ key: 'edit', label: 'Sửa thiết bị' });
      menuItems.push({ key: 'control', label: 'Điều khiển thiết bị' });
      menuItems.push({ key: 'delete', label: 'Xoá thiết bị', danger: true });
    }
    
    return (
      <Menu
        onClick={({ key }) => {
          console.log(`Thao tác "${key}" với node`, node);
  
          switch (key) {
            case 'add-member':
              setSelectedHouseId(node.data.id);
              setMemberModalVisible(true);
              break;
            case 'add':
              if (node.type === 'house') {
                setEditingRoom(null);
                setSelectedHouseId(node.data.id);
                setRoomModalVisible(true);
              } else if (node.type === 'room') {
                setSelectedRoomId(node.data.id);
                setDeviceModalVisible(true);
              }
              break;
  
            case 'edit':
              if (node.type === 'house') {
                setEditingHouse(node.data);
                setHouseModalVisible(true);
              } else if (node.type === 'room') {
                setEditingRoom(node.data);
                setSelectedHouseId(null);
                setRoomModalVisible(true);
              } else if (node.type === 'device') {
                // 👉 sửa thiết bị
                setCurrentDevice(node.data);
                setDeviceModalVisible(true);
              }
              break;
  
            case 'control':
              if (node.type === 'device') {
                setCurrentDevice(node.data);
                setControlVisible(true);
              }
              break;
  
            case 'delete':
              handleDelete(node);
              break;
  
            default:
              break;
          }
        }}
        items={menuItems}
      />
    );
  };
  

  // Hiển thị tiêu đề mỗi node kèm nút ba chấm
  const renderTreeNodeTitle = (node) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '4px 8px',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {node.icon} {node.rawTitle}
      </span>
  
      <Dropdown 
        overlay={getNodeMenu(node)} 
        trigger={['click']}
        placement="bottomRight"
      >
        <Button 
          type="text" 
          size="small" 
          icon={<MoreOutlined />}
          style={{ 
            opacity: 0.6,
            transition: 'opacity 0.2s',
            marginLeft: 8, // tránh sát bên trái
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          onClick={(e) => e.stopPropagation()} // tránh trigger expand/collapse
        />
      </Dropdown>
    </div>
  );
  

  // Đệ quy để biến treeData thành dạng có custom title
  const transformTreeData = (data) => {
    console.log("treeData từ API:", treeData);

    return data.map(node => {
      const rawTitle = typeof node.title === 'string' ? node.title : node.rawTitle || 'Không rõ tên';
  
      // 🔥 Ensure isOn được gán ở cấp node
      const isOn = typeof node.data?.isOn === 'boolean' ? node.data.isOn : false;
  
      return {
        ...node,
        rawTitle,
        isOn, // ✅ Thêm dòng này để Switch nhận đúng trạng thái
        title: renderTreeNodeTitle({ ...node, rawTitle }),
        isLeaf: false,
        children: node.children ? transformTreeData(node.children) : [],
      };
    });
  };
  

  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Khu vực thông tin user */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
            <span style={{ fontWeight: 'bold' }}>{userInfo.name}</span>
          </div>
          
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<SettingOutlined />} />
          </Dropdown>
        </div>
      </div>

      {/* Khu vực cây điều hướng */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Hệ thống</span>
          <Space>
            <Button 
              type="text" 
              icon={<ReloadOutlined />} 
              size="small"
              onClick={refreshData}
              loading={loading}
              title="Làm mới dữ liệu"
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              size="small"
              onClick={handleAddClick}
              disabled={loading}
            >
              Thêm House
            </Button>
          </Space>
        </div>
        
        <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <Tree
            treeData={transformTreeData(treeData)}
            
            onSelect={onSelect}
            selectedKeys={selectedNode ? [selectedNode.key] : []}
            defaultExpandAll={true}
            style={{ 
              background: 'transparent',
              minHeight: '200px'
            }}
          />
        </Spin>
      </div>

      {/* Modals */}
      <HouseModal
        visible={houseModalVisible}
        onClose={() => {
          setHouseModalVisible(false);
          setEditingHouse(null);
        }}
        house={editingHouse}
      />

      <RoomModal
        visible={roomModalVisible}
        onClose={() => {
          setRoomModalVisible(false);
          setEditingRoom(null);
          setSelectedHouseId(null);
        }}
        room={editingRoom}
        houseId={selectedHouseId}
      />
      <DeviceModal
  visible={deviceModalVisible}
  roomId={selectedRoomId}
  device={currentDevice} 
  onClose={() => {
    setDeviceModalVisible(false);
    setSelectedRoomId(null);
    setCurrentDevice(null); 
  }}
  onSuccess={() => {
    setDeviceModalVisible(false);
    setSelectedRoomId(null);
    setCurrentDevice(null); 
    refreshData();
  }}
/>
<MemberModal
  visible={memberModalVisible}
  houseId={selectedHouseId}
  onClose={(shouldReload) => {
    setMemberModalVisible(false);
    if (shouldReload) {
      // TODO: Reload lại danh sách member nếu cần
    }
  }}
/>


<UserProfileModal
  visible={profileModalVisible}
  onClose={() => setProfileModalVisible(false)}
  user={profileData}
/>

{currentDevice && (
  <DeviceControlModal
    visible={controlVisible}
    device={currentDevice}
    onClose={() => {
      setControlVisible(false);
      setCurrentDevice(null);
    }}
    onSuccess={() => {
      setControlVisible(false);
      setCurrentDevice(null);
      refreshData(); // làm mới lại nếu trạng thái thiết bị có thay đổi
    }}
  />
)}


    </div>
  );
};

export default Sidebar;