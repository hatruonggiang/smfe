// src/components/UserProfileModal.jsx
import React from 'react';
import { Modal, Descriptions } from 'antd';

const UserProfileModal = ({ visible, onClose, user }) => {
  return (
    <Modal
      title="Thông tin tài khoản"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {user ? (
        <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="Tên">{user.userName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Đang tải...</p>
      )}
    </Modal>
  );
};

export default UserProfileModal;
