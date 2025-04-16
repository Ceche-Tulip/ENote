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
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../store/categorySlice';

const { Title } = Typography;

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories = [], loading } = useSelector(state => state.categories);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 加载分类数据
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // 打开创建分类的模态框
  const showCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑分类的模态框
  const showEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({ name: record.name, description: record.description });
    setModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingCategory) {
        // 更新分类
        dispatch(updateCategory({ id: editingCategory.id, categoryData: values }))
          .then((result) => {
            if (!result.error) {
              message.success('分类已更新');
              setModalVisible(false);
            }
          });
      } else {
        // 创建分类
        dispatch(createCategory(values))
          .then((result) => {
            if (!result.error) {
              message.success('分类已创建');
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

  // 处理删除分类
  const handleDelete = (id) => {
    dispatch(deleteCategory(id))
      .then((result) => {
        if (!result.error) {
          message.success('分类已删除');
          setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
        }
      });
  };

  // 表格列配置
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
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
            title="确定要删除这个分类吗？"
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

  // 批量删除分类
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个分类吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        if (!Array.isArray(selectedRowKeys) || selectedRowKeys.length === 0) {
          return;
        }
        const deletePromises = selectedRowKeys.map(id => dispatch(deleteCategory(id)));
        Promise.all(deletePromises)
          .then(() => {
            message.success(`已删除 ${selectedRowKeys.length} 个分类`);
            setSelectedRowKeys([]);
          });
      }
    });
  };

  // 确保categories是数组
  const categoryDataSource = Array.isArray(categories) ? categories : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>分类管理</Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            新建分类
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
          dataSource={categoryDataSource}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '创建分类'}
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
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '名称最长为50个字符' }
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="分类描述"
            rules={[{ max: 200, message: '描述最长为200个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入分类描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;