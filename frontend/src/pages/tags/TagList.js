import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Typography,
  message,
  Card,
  Tag as AntTag,
  ColorPicker
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  fetchAllTags,
  createTag,
  updateTag,
  deleteTag
} from '../../store/tagSlice';

const { Title } = Typography;

const TagList = () => {
  const dispatch = useDispatch();
  const { tags = [], loading } = useSelector(state => state.tags);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [color, setColor] = useState('#1890ff');

  // 标签的默认颜色选项
  const presetColors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fadb14', '#a0d911', '#fa541c'
  ];

  // 加载标签数据
  useEffect(() => {
    dispatch(fetchAllTags());
  }, [dispatch]);

  // 打开创建标签的模态框
  const showCreateModal = () => {
    setEditingTag(null);
    setColor('#1890ff');
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑标签的模态框
  const showEditModal = (record) => {
    setEditingTag(record);
    setColor(record.color || '#1890ff');
    form.setFieldsValue({ 
      name: record.name, 
      description: record.description,
      color: record.color || '#1890ff'
    });
    setModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields().then(values => {
      // 添加颜色到表单值
      const tagData = {
        ...values,
        color: color
      };

      if (editingTag) {
        // 更新标签
        dispatch(updateTag({ id: editingTag.id, tagData }))
          .then((result) => {
            if (!result.error) {
              message.success('标签已更新');
              setModalVisible(false);
            }
          });
      } else {
        // 创建标签
        dispatch(createTag(tagData))
          .then((result) => {
            if (!result.error) {
              message.success('标签已创建');
              setModalVisible(false);
            }
          });
      }
    });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  // 处理删除标签
  const handleDelete = (id) => {
    dispatch(deleteTag(id))
      .then((result) => {
        if (!result.error) {
          message.success('标签已删除');
          setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
        }
      });
  };

  // 表格列配置
  const columns = [
    {
      title: '标签',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <AntTag color={record.color || '#1890ff'} style={{ fontSize: '14px', padding: '2px 8px' }}>
          {text}
        </AntTag>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '笔记数量',
      dataIndex: 'noteCount',
      key: 'noteCount',
      render: (_, record) => record?.notes && Array.isArray(record.notes) ? record.notes.length : 0
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个标签吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // 批量删除标签
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个标签吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        if (!Array.isArray(selectedRowKeys) || selectedRowKeys.length === 0) {
          return;
        }
        const deletePromises = selectedRowKeys.map(id => dispatch(deleteTag(id)));
        Promise.all(deletePromises)
          .then(() => {
            message.success(`已删除 ${selectedRowKeys.length} 个标签`);
            setSelectedRowKeys([]);
          });
      }
    });
  };

  // 确保tags是数组
  const tagDataSource = Array.isArray(tags) ? tags : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>标签管理</Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建标签
          </Button>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除 ({selectedRowKeys.length})
            </Button>
          )}
        </Space>
      </div>

      <Card>
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tagDataSource}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '创建标签'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { max: 30, message: '名称最长为30个字符' }
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="标签描述"
            rules={[{ max: 200, message: '描述最长为200个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入标签描述" />
          </Form.Item>
          
          <Form.Item
            label="标签颜色"
          >
            <ColorPicker
              showText
              value={color}
              onChange={(_, hex) => setColor(hex)}
              presets={[
                {
                  label: '推荐颜色',
                  colors: presetColors,
                },
              ]}
            />
          </Form.Item>
          
          <div style={{ marginTop: 16 }}>
            <span style={{ marginRight: 8 }}>预览:</span>
            <AntTag color={color} style={{ fontSize: '14px', padding: '2px 8px' }}>
              {form.getFieldValue('name') || '标签预览'}
            </AntTag>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TagList;