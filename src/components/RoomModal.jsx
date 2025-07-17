// src/components/RoomModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useApp } from '../context/AppContext';

const RoomModal = ({ visible, onClose, room = null, houseId = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addRoom, updateRoom, refreshData } = useApp();

  const isEdit = !!room;

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (visible) {
      if (isEdit) {
        form.setFieldsValue({
          name: room.name,
          description: room.description
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, room, isEdit, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateRoom(room.id, values);
      } else {
        if (!houseId) {
          message.error('Không xác định được nhà để thêm phòng!');
          return;
        }
        await addRoom(houseId, values);
      }
      
      // Refresh data để cập nhật tree
      await refreshData();
      
      // Đóng modal
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Error saving room:', error);
      // Error message đã được hiển thị trong apiService
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEdit ? `Sửa phòng: ${room?.name}` : 'Thêm phòng mới'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng!' },
            { min: 2, message: 'Tên phòng phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên phòng không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên phòng" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea 
            placeholder="Nhập mô tả (tùy chọn)" 
            rows={4}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button 
            style={{ marginRight: 8 }} 
            onClick={handleCancel}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
          >
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;
