import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login, clearError } from '../../store/authSlice';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);

  // 处理登录表单提交
  const onFinish = (values) => {
    dispatch(login(values)).then((result) => {
      if (!result.error) {
        navigate('/dashboard'); // 登录成功跳转到仪表板
      }
    });
  };

  return (
    <>
      {error && (
        <Alert
          message="登录失败"
          description={error}
          type="error"
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 24 }}
        />
      )}
      <Form
        form={form}
        name="login"
        initialValues={{ remember: rememberMe }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="用户名" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox onChange={(e) => setRememberMe(e.target.checked)}>记住我</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            style={{ width: '100%' }} 
            size="large"
          >
            登录
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span>还没有账号? </span>
          <Link to="/register">立即注册</Link>
        </div>
      </Form>
    </>
  );
};

export default Login;