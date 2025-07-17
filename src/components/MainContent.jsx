// src/components/MainContent.jsx
import React from 'react';
import { Card, Typography, Badge, Button, Switch } from 'antd';
import { HomeOutlined, BulbOutlined, TvOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import DeviceDetail from './DeviceDetail';

const { Title, Text } = Typography;

const MainContent = () => {
  const { selectedNode, setSelectedNode, refreshData } = useApp();

  // Render header
  const renderHeader = () => (
    <div style={{ 
      padding: '24px', 
      borderBottom: '1px solid #f0f0f0',
      background: '#fff'
    }}>
      <Title level={2} style={{ margin: 0 }}>
        Smart Home Rạng Đông
      </Title>
    </div>
  );

  // Render nội dung tùy theo loại node được chọn
  const renderContent = () => {
    if (!selectedNode) {
      return (
        <div style={{ 
          padding: '48px', 
          textAlign: 'center',
          color: '#999'
        }}>
          <HomeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <Title level={3} style={{ color: '#999' }}>
            Chọn một mục từ menu bên trái
          </Title>
          <Text>Chọn nhà, phòng hoặc thiết bị để xem chi tiết</Text>
        </div>
      );
    }

    // Render cho House
    if (selectedNode.type === 'house') {
      const roomCount = selectedNode.children?.length || 0;
      const deviceCount = selectedNode.children?.reduce((total, room) => 
        total + (room.children?.length || 0), 0
      ) || 0;

      return (
        <div style={{ padding: '24px' }}>
          <Title level={3}>
            <HomeOutlined style={{ marginRight: '8px' }} />
            {selectedNode.title}
          </Title>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                  {roomCount}
                </Title>
                <Text>Phòng</Text>
              </div>
            </Card>
            
            <Card>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: '#52c41a', margin: 0 }}>
                  {deviceCount}
                </Title>
                <Text>Thiết bị</Text>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    // Render cho Room
    if (selectedNode.type === 'room') {
      const devices = selectedNode.children || [];
      return (
        <div style={{ padding: '24px' }}>
          <Title level={3}>
            <BulbOutlined style={{ marginRight: '8px' }} />
            {selectedNode.title}
          </Title>
    
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {devices.map(device => {
              // DEBUG: In ra dữ liệu để kiểm tra
              console.log('Device debug:', {
                key: device.key,
                data: device.data,
                isOn: device.isOn,
                type: typeof device.isOn
              });
              
              // Sử dụng device.isOn từ tree structure
              const { loading, data } = device;
              const isOn = device.isOn === true || device.isOn === 'true' || device.isOn === 1;
              const statusText = isOn ? 'Đang bật' : 'Đã tắt';
              const statusColor = isOn ? 'green' : 'gray';
    
              return (
                <Card
                  key={device.key}
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {device.icon && <span>{device.icon}</span>}
                      <span>{data?.name || 'Thiết bị không tên'}</span>
                    </div>
                  }
                  bordered
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <Badge color={statusColor} text={statusText} />
                      {/* DEBUG: Hiển thị raw data */}
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        Debug: {JSON.stringify(device.isOn)} ({typeof device.isOn})
                      </div>
                    </div>
                    <Switch
                      checked={isOn}
                      loading={loading}
                      onChange={async (checked) => {
                        device.loading = true;
                        setSelectedNode(prev => ({ ...prev }));
    
                        try {
                          console.log('Device gửi lên:', device);
                          await apiService.controlDevice(data.id, { isOn: checked });
                          
                          // Cập nhật trạng thái trong tree
                          device.isOn = checked;
                          setSelectedNode(prev => ({ ...prev }));
                          
                          // Tùy chọn: refresh data để đồng bộ với server
                          // await refreshData();
                        } catch (err) {
                          console.error('Lỗi khi điều khiển thiết bị:', err);
                          alert('Không thể điều khiển thiết bị. Vui lòng thử lại!');
                        } finally {
                          device.loading = false;
                          setSelectedNode(prev => ({ ...prev }));
                        }
                      }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      );
    }

    // Render cho Device
    if (selectedNode.type === 'device') {
      return (
        <div style={{ padding: '24px' }}>
          <DeviceDetail device={selectedNode.data} />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url("mainContent.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {renderHeader()}
      <div style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.7)', // mờ nhẹ để dễ đọc
        overflow: 'auto',
        backdropFilter: 'blur(1px)', // blur hiện đại
      }}>
        {renderContent()}
      </div>
    </div>
  );
  
};

export default MainContent;