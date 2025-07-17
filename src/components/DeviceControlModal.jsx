import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Input, Switch, Slider, Button } from 'antd';
import { apiService } from '../services/api';

const DeviceControlModal = ({ visible, device, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!device) return null;

  const type = device.type;

  const renderControls = () => {
    switch (type) {
      case 'LIGHT':
        return (
          <>
            <Form.Item name="brightness" label="Độ sáng">
              <Slider min={0} max={100} />
            </Form.Item>
            <Form.Item name="color" label="Màu sắc">
              <Input placeholder="Ví dụ: #ff0000 hoặc red" />
            </Form.Item>
          </>
        );
      case 'SPEAKER':
        return (
          <Form.Item name="volume" label="Âm lượng">
            <Slider min={0} max={100} />
          </Form.Item>
        );
      case 'DOOR_LOCK':
        return (
          <Form.Item name="isLocked" label="Khóa cửa" valuePropName="checked">
            <Switch />
          </Form.Item>
        );
      case 'THERMOSTAT':
        return (
          <Form.Item name="temperature" label="Nhiệt độ (°C)">
            <InputNumber min={10} max={35} />
          </Form.Item>
        );
      case 'CURTAIN':
        return (
          <Form.Item name="position" label="Vị trí rèm (%)">
            <Slider min={0} max={100} />
          </Form.Item>
        );
      default:
        return <p>Không hỗ trợ điều khiển cho loại thiết bị này.</p>;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await apiService.controlDevice(device.id, values);
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Điều khiển thiết bị: ${device.name}`}
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Điều khiển"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {renderControls()}
      </Form>
    </Modal>
  );
};

export default DeviceControlModal;
