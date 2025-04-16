import React from 'react';
import PropTypes from 'prop-types';
import { Result, Button, Typography, Space, Card, Alert } from 'antd';
import { 
  CloseCircleOutlined, 
  ReloadOutlined, 
  HomeOutlined,
  BugOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

/**
 * 通用错误界面组件
 * 用于在应用程序遇到异常时显示友好的错误信息
 */
const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  title, 
  subTitle,
  showReload = true,
  showHome = true,
  showDetails = true,
  showTryAgain = true,
  additionalActions = null
}) => {
  // 根据错误类型提供特定的错误消息
  const getErrorMessage = () => {
    if (!error) return '发生未知错误';

    // 网络错误
    if (error.message && error.message.includes('Network Error')) {
      return '网络连接失败，请检查您的网络连接';
    }
    
    // API 错误
    if (error.customMessage) {
      return error.customMessage;
    }
    
    // 常见错误
    if (error.message) {
      if (error.message.includes('timeout')) {
        return '请求超时，服务器响应时间过长';
      }
      return error.message;
    }
    
    // 默认错误信息
    return '应用程序遇到了问题，请稍后再试';
  };

  return (
    <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <Result
        status="error"
        title={title || '操作失败'}
        subTitle={subTitle || getErrorMessage()}
        icon={<CloseCircleOutlined />}
        extra={
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space>
              {showTryAgain && resetErrorBoundary && (
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />} 
                  onClick={resetErrorBoundary}
                >
                  重试
                </Button>
              )}
              
              {showReload && (
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => window.location.reload()}
                >
                  刷新页面
                </Button>
              )}
              
              {showHome && (
                <Button 
                  icon={<HomeOutlined />} 
                  onClick={() => window.location.href = '/'}
                >
                  返回首页
                </Button>
              )}
              
              {additionalActions}
            </Space>
            
            {/* 显示详细错误信息（开发环境使用） */}
            {showDetails && error && (
              <Alert
                type="warning"
                icon={<BugOutlined />}
                message={
                  <div>
                    <Text strong>技术详情：</Text>
                    <Paragraph style={{ marginTop: 8 }} code>
                      {error.stack || JSON.stringify(error, null, 2)}
                    </Paragraph>
                  </div>
                }
              />
            )}
          </Space>
        }
      />
    </Card>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.any, // 错误对象
  resetErrorBoundary: PropTypes.func, // 重置错误边界的回调函数
  title: PropTypes.node, // 错误标题
  subTitle: PropTypes.node, // 错误副标题/描述
  showReload: PropTypes.bool, // 是否显示刷新页面按钮
  showHome: PropTypes.bool, // 是否显示返回首页按钮
  showDetails: PropTypes.bool, // 是否显示详细错误信息
  showTryAgain: PropTypes.bool, // 是否显示重试按钮
  additionalActions: PropTypes.node // 额外的操作按钮
};

export default ErrorFallback;