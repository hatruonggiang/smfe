// src/components/HouseModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useApp } from '../context/AppContext';

const HouseModal = ({ visible, onClose, house = null }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addHouse, updateHouse, refreshData } = useApp();

  const isEdit = !!house;

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (visible) {
      if (isEdit) {
        form.setFieldsValue({
          name: house.name,
          address: house.address,
          description: house.description
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, house, isEdit, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateHouse(house.id, values);
      } else {
        await addHouse(values);
      }
      
      // Refresh data để cập nhật tree
      await refreshData();
      
      // Đóng modal
      onClose();
      form.resetFields();
    } catch (error) {
      console.error('Error saving house:', error);
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
      title={isEdit ? `Sửa nhà: ${house?.name}` : 'Thêm nhà mới'}
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
          label="Tên nhà"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên nhà!' },
            { min: 2, message: 'Tên nhà phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên nhà không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên nhà" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ!' },
            { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự!' },
            { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
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

export default HouseModal;