import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography } from 'antd';

const { Content, Footer } = Layout;
const { Title } = Typography;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '50px 0'
      }}>
        <div style={{ 
          width: '400px', 
          padding: '24px', 
          background: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>ENote笔记</Title>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ENote ©2025 Created by Your Name
      </Footer>
    </Layout>
  );
};

export default AuthLayout;