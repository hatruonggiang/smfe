import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button, Space, message } from 'antd';
import { useApp } from '../context/AppContext';

const { Option } = Select;

const DEVICE_TYPES = [
  { value: 'LIGHT', label: 'Đèn' },
  { value: 'CAMERA', label: 'Camera' },
  { value: 'DOOR_LOCK', label: 'Khóa cửa' },
  { value: 'CURTAIN', label: 'Rèm cửa' },
  { value: 'FAN', label: 'Quạt' },
  { value: 'AIR_CONDITIONER', label: 'Máy lạnh' },
  { value: 'SPEAKER', label: 'Loa' },
];


const DeviceModal = ({ visible, onClose, roomId, onSuccess, device = null }) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    properties: '',
    capabilities: ''
  });
  const [loading, setLoading] = useState(false);
  const { addDevice, updateDevice } = useApp();

  const isEdit = !!device;

  // Pre-fill form khi edit
  useEffect(() => {
    if (visible) {
      if (isEdit && device) {
        setForm({
          name: device.name || '',
          type: device.type || '',
          properties: JSON.stringify(device.properties || {}, null, 2),
          capabilities: JSON.stringify(device.capabilities || {}, null, 2)
        });
      } else {
        setForm({ name: '', type: '', properties: '', capabilities: '' });
      }
    }
  }, [visible, isEdit, device]);

  const handleSubmit = async () => {
    if (!form.name || !form.type) {
      message.error('Vui lòng điền đầy đủ tên và loại thiết bị');
      return;
    }

    let parsedProperties = {};
    let parsedCapabilities = {};

    try {
      parsedProperties = form.properties ? JSON.parse(form.properties) : {};
      parsedCapabilities = form.capabilities ? JSON.parse(form.capabilities) : {};
    } catch (err) {
      message.error('Properties hoặc Capabilities không đúng định dạng JSON');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        console.log("Gửi yêu cầu cập nhật với dữ liệu:", {
          name: form.name,
          type: form.type,
          properties: parsedProperties,
          capabilities: parsedCapabilities
        });
        
        await updateDevice(device.id, {
          name: form.name,
          type: form.type,
          properties: parsedProperties,
          capabilities: parsedCapabilities
        });
        
        console.log("Cập nhật hoàn tất");
        
      } else {
        await addDevice(roomId, {
          name: form.name,
          type: form.type,
          properties: parsedProperties,
          capabilities: parsedCapabilities,
          state: {}
        });
        message.success('Thêm thiết bị thành công!');
      }

      onSuccess?.();
      onClose();
      setForm({ name: '', type: '', properties: '', capabilities: '' });
    } catch (err) {
      // lỗi đã được xử lý trong api.js nếu có
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Sửa thiết bị: ${device?.name}` : 'Thêm thiết bị'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>Hủy</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : 'Thêm thiết bị'}
        </Button>
      ]}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Tên thiết bị"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Select
          placeholder="Chọn loại thiết bị"
          value={form.type}
          onChange={(value) => setForm({ ...form, type: value })}
          style={{ width: '100%' }}
        >
          {DEVICE_TYPES.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
        <Input.TextArea
          placeholder='Properties (JSON), ví dụ: {"color": "white", "brand": "XYZ"}'
          value={form.properties}
          onChange={(e) => setForm({ ...form, properties: e.target.value })}
          rows={3}
        />
        <Input.TextArea
          placeholder='Capabilities (JSON), ví dụ: {"canDim": true, "canChangeColor": false}'
          value={form.capabilities}
          onChange={(e) => setForm({ ...form, capabilities: e.target.value })}
          rows={3}
        />
      </Space>
    </Modal>
  );
};

export default DeviceModal;
