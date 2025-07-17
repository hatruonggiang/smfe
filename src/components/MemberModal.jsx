// src/components/MemberModal.jsx
import React, { useState } from 'react';
import { Modal, Input, Select, Button, message } from 'antd';
import { apiService } from '../services/api';

const { Option } = Select;

const roles = [
  { value: 'MEMBER', label: 'MEMBER' },
  { value: 'ADMIN', label: 'OWNER' },
];

const MemberModal = ({ visible, onClose, houseId }) => {
  const [userIdInput, setUserIdInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const userId = parseInt(userIdInput, 10);
    if (!userId || !selectedRole) {
      message.warning('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await apiService.post('/houses/members', {
        houseId,
        userId,
        role: selectedRole,
      });
      message.success('Thêm thành viên thành công');
      onClose(true); // trigger reload
    } catch (err) {
      message.error('Lỗi khi thêm thành viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={() => onClose(false)}
      title="Thêm thành viên"
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          Huỷ
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleAdd}>
          Thêm
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Mã người dùng (User ID)</label>
        <Input
          placeholder="Nhập ID người dùng"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
        />
      </div>

      <div>
        <label>Vai trò</label>
        <Select
          style={{ width: '100%' }}
          value={selectedRole}
          onChange={(val) => setSelectedRole(val)}
        >
          {roles.map((role) => (
            <Option key={role.value} value={role.value}>
              {role.label}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default MemberModal;
