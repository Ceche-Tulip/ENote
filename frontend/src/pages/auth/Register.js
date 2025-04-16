import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { register, clearError } from '../../store/authSlice';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // 处理注册表单提交
  const onFinish = (values) => {
    const { confirm, ...userData } = values;
    dispatch(register(userData)).then((result) => {
      if (!result.error) {
        navigate('/login', { state: { registered: true } }); // 注册成功跳转到登录页
      }
    });
  };

  return (
    <>
      {error && (
        <Alert
          message="注册失败"
          description={error}
          type="error"
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 24 }}
        />
      )}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名!' },
            { min: 3, message: '用户名至少3个字符!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />}
            placeholder="用户名" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />}
            placeholder="邮箱" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码!' },
            { min: 6, message: '密码至少6个字符!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />}
            placeholder="确认密码" 
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            style={{ width: '100%' }} 
            size="large"
          >
            注册
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <span>已有账号? </span>
          <Link to="/login">返回登录</Link>
        </div>
      </Form>
    </>
  );
};

export default Register;