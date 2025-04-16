import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Space, 
  Card, 
  message, 
  Spin 
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { 
  fetchNoteById, 
  createNote, 
  updateNote, 
  clearCurrentNote 
} from '../../store/noteSlice';
import { fetchAllCategories } from '../../store/categorySlice';
import { fetchAllTags } from '../../store/tagSlice';

const { TextArea } = Input;
const { Option } = Select;

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const { currentNote, loading: noteLoading } = useSelector(state => state.notes);
  const { categories = [], loading: categoriesLoading } = useSelector(state => state.categories);
  const { tags = [], loading: tagsLoading } = useSelector(state => state.tags);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!id;
  
  // 加载所需数据
  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllTags());
    
    // 如果是编辑模式，获取笔记详情
    if (isEditing && id) {
      dispatch(fetchNoteById(id));
    }
    
    return () => {
      dispatch(clearCurrentNote());
    };
  }, [dispatch, id, isEditing]);
  
  // 表单初始值设置
  useEffect(() => {
    if (isEditing && currentNote) {
      // 设置表单初始值
      form.setFieldsValue({
        title: currentNote.title,
        content: currentNote.content,
        categoryId: currentNote.category?.id,
        tagIds: currentNote.tags && Array.isArray(currentNote.tags) ? 
          currentNote.tags.map(tag => tag.id) : [],
      });
    }
  }, [form, isEditing, currentNote]);
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        // 更新笔记
        await dispatch(updateNote({ id, noteData: values })).unwrap();
        message.success('笔记更新成功');
      } else {
        // 创建新笔记
        const result = await dispatch(createNote(values)).unwrap();
        message.success('笔记创建成功');
        // 创建成功后跳转到笔记详情
        navigate(`/notes/${result.id}`);
        return; // 防止下面的导航再次执行
      }
      // 编辑完成后返回详情
      navigate(isEditing ? `/notes/${id}` : '/notes');
    } catch (error) {
      message.error('操作失败: ' + (error.message || '未知错误'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 处理取消操作
  const handleCancel = () => {
    if (isEditing && id) {
      navigate(`/notes/${id}`);
    } else {
      navigate('/notes');
    }
  };
  
  const loading = noteLoading || categoriesLoading || tagsLoading;
  
  // 如果是编辑模式并且数据正在加载
  if (isEditing && loading && !currentNote) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleCancel}
        >
          返回
        </Button>
      </div>
      
      <Card title={isEditing ? '编辑笔记' : '创建笔记'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ title: '', content: '', categoryId: undefined, tagIds: [] }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="请输入笔记标题" maxLength={100} />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="内容"
          >
            <TextArea 
              placeholder="请输入笔记内容" 
              rows={10}
              showCount
              maxLength={10000}
            />
          </Form.Item>
          
          <Form.Item
            name="categoryId"
            label="分类"
          >
            <Select
              placeholder="选择分类"
              allowClear
              loading={categoriesLoading}
            >
              {Array.isArray(categories) && categories.map(category => (
                category && <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tagIds"
            label="标签"
          >
            <Select
              mode="multiple"
              placeholder="选择标签"
              allowClear
              loading={tagsLoading}
            >
              {Array.isArray(tags) && tags.map(tag => (
                tag && <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={isSubmitting}
              >
                保存
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NoteEditor;