// src/components/Layout.jsx
import React from 'react';
import { Layout as AntLayout } from 'antd';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const { Sider, Content } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Sidebar bên trái */}
      <Sider 
        width={350}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <Sidebar />
      </Sider>
      
      {/* Main content bên phải */}
      <Content>
        <MainContent />
      </Content>
    </AntLayout>
  );
};

export default Layout;