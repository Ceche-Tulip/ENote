import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  FolderOutlined,
  TagsOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { logout } from '../store/authSlice';

const { Header, Content, Sider, Footer } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate('/login');
    });
  };

  // 侧边菜单项配置 - 使用 items 属性而非 children
  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">首页</Link>,
    },
    {
      key: '2',
      icon: <FileTextOutlined />,
      label: <Link to="/notes">笔记</Link>,
    },
    {
      key: '3',
      icon: <FolderOutlined />,
      label: <Link to="/categories">分类</Link>,
    },
    {
      key: '4',
      icon: <TagsOutlined />,
      label: <Link to="/tags">标签</Link>,
    },
  ];

  // 用户下拉菜单 - 使用 items 属性而非直接渲染子元素
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  // 面包屑配置 - 使用 items 属性而非 Breadcrumb.Item
  const breadcrumbItems = [
    {
      title: <Link to="/dashboard">首页</Link>,
    },
    {
      title: '笔记管理',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.3)' }} />
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['1']} 
          mode="inline"
          items={menuItems} // 使用 items 属性替代子元素
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header" style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => navigate('/notes/new')}
                style={{ marginRight: '16px' }}
              >
                新建笔记
              </Button>
              {isLoggedIn && (
                <Dropdown 
                  menu={{ items: userMenuItems }} // 使用 menu 属性代替 overlay
                  placement="bottomRight"
                >
                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ marginLeft: '8px' }}>{user?.username || '用户'}</span>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb 
            style={{ margin: '16px 0' }}
            items={breadcrumbItems} // 使用 items 属性替代子元素
          />
          <div className="site-layout-content" style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>ENote ©2025 Created by Your Name</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;