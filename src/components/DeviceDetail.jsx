// src/components/DeviceDetail.jsx
import React from 'react';
import { Card, Descriptions, Typography } from 'antd';

const { Title } = Typography;

const DeviceDetail = ({ device }) => {
  if (!device) return null;

  const { name, type, roomName, state } = device;

  return (
    <Card title={<Title level={4}>{name} ({type})</Title>} bordered style={{ margin: 20 }}>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Tên thiết bị">{name}</Descriptions.Item>
        <Descriptions.Item label="Loại">{type}</Descriptions.Item>
        <Descriptions.Item label="Phòng">{roomName}</Descriptions.Item>

        {state && Object.entries(state).map(([key, value]) => (
          <Descriptions.Item key={key} label={key}>
            {String(value)}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
};

export default DeviceDetail;
