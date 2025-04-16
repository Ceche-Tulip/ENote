import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

/**
 * 错误边界组件
 * 用于捕获子组件树中的 JavaScript 错误，记录错误并显示备用 UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下一次渲染将显示备用 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误日志发送到服务端
    console.error('错误边界捕获到错误:', error, errorInfo);
    
    // 如果提供了 onError 回调，则调用它
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    // 重置错误状态
    this.setState({ hasError: false, error: null });
    
    // 如果提供了重置回调，则调用它
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { children, fallback, ...rest } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      // 如果提供了自定义的 fallback，使用它
      if (fallback) {
        return typeof fallback === 'function'
          ? fallback({ error, resetErrorBoundary: this.resetErrorBoundary })
          : fallback;
      }

      // 否则使用默认的错误界面
      return (
        <ErrorFallback 
          error={error} 
          resetErrorBoundary={this.resetErrorBoundary}
          {...rest}
        />
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func
};

export default ErrorBoundary;