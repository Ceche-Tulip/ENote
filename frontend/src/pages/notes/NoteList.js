import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // 添加 PropTypes 导入
import { 
  List, 
  Card, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Tooltip, 
  Popconfirm, 
  Select, 
  Typography,
  Empty,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { fetchAllNotes, deleteNote } from '../../store/noteSlice';
import { fetchAllCategories } from '../../store/categorySlice';
import { fetchAllTags } from '../../store/tagSlice';

const { Title, Text } = Typography;
const { Option } = Select;

// 定义笔记、分类和标签的 PropTypes
const notePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string
  })),
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

const categoryPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

const tagPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string
});

const NoteList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notes = [], loading } = useSelector(state => state.notes);
  const { categories = [], loading: categoriesLoading } = useSelector(state => state.categories);
  const { tags = [], loading: tagsLoading } = useSelector(state => state.tags);
  
  // 本地状态
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  
  // 获取所有数据
  useEffect(() => {
    dispatch(fetchAllNotes());
    dispatch(fetchAllCategories());
    dispatch(fetchAllTags());
  }, [dispatch]);
  
  // 处理删除笔记
  const handleDelete = (id) => {
    dispatch(deleteNote(id));
  };
  
  // 过滤笔记（添加安全检查）
  const filteredNotes = Array.isArray(notes) ? notes.filter(note => {
    if (!note) return false;
    
    // 根据搜索文本过滤 - 修复混合运算符警告
    const matchesSearch = (
      (note.title && note.title.toLowerCase().includes(searchText.toLowerCase())) || 
      (note.content && note.content.toLowerCase().includes(searchText.toLowerCase()))
    );
    
    // 根据分类过滤
    const matchesCategory = selectedCategory ? note.category && note.category.id === selectedCategory : true;
    
    // 根据标签过滤
    const matchesTag = selectedTag ? 
      note.tags && Array.isArray(note.tags) && note.tags.some(tag => tag && tag.id === selectedTag) : true;
    
    return matchesSearch && matchesCategory && matchesTag;
  }) : [];

  const isLoading = loading || categoriesLoading || tagsLoading;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>笔记列表</Title>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/notes/new')}
        >
          新建笔记
        </Button>
      </div>
      
      {/* 筛选工具栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="搜索笔记"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          
          <Select
            placeholder="筛选分类"
            style={{ width: 150 }}
            value={selectedCategory}
            onChange={value => setSelectedCategory(value)}
            allowClear
            onClear={() => setSelectedCategory(null)}
          >
            {Array.isArray(categories) && categories.map(category => (
              category && <Option key={category.id} value={category.id}>{category.name}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="筛选标签"
            style={{ width: 150 }}
            value={selectedTag}
            onChange={value => setSelectedTag(value)}
            allowClear
            onClear={() => setSelectedTag(null)}
          >
            {Array.isArray(tags) && tags.map(tag => (
              tag && <Option key={tag.id} value={tag.id}>{tag.name}</Option>
            ))}
          </Select>
        </Space>
      </Card>
      
      {/* 笔记列表 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        filteredNotes.length > 0 ? (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 4,
            }}
            dataSource={filteredNotes}
            renderItem={note => (
              <List.Item>
                <Card
                  title={
                    <Tooltip title={note.title}>
                      <div style={{ 
                        maxWidth: '100%', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {note.title}
                      </div>
                    </Tooltip>
                  }
                  extra={
                    <Space>
                      <Tooltip title="查看">
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small" 
                          type="text"
                          onClick={() => navigate(`/notes/${note.id}`)}
                        />
                      </Tooltip>
                      <Tooltip title="编辑">
                        <Button 
                          icon={<EditOutlined />} 
                          size="small" 
                          type="text"
                          onClick={() => navigate(`/notes/${note.id}/edit`)}
                        />
                      </Tooltip>
                      <Tooltip title="删除">
                        <Popconfirm
                          title="确定要删除这条笔记吗?"
                          onConfirm={() => handleDelete(note.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button icon={<DeleteOutlined />} size="small" type="text" danger />
                        </Popconfirm>
                      </Tooltip>
                    </Space>
                  }
                  hoverable
                >
                  <div style={{ height: 100, overflow: 'hidden' }}>
                    {note.content ? (
                      <Text type="secondary" ellipsis={{ rows: 3 }}>{note.content}</Text>
                    ) : (
                      <Text type="secondary" italic>无内容</Text>
                    )}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    {note.category && (
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">分类: </Text>
                        <Tag color="blue">{note.category.name}</Tag>
                      </div>
                    )}
                    
                    {note.tags && Array.isArray(note.tags) && note.tags.length > 0 && (
                      <div>
                        <Text type="secondary">标签: </Text>
                        <div style={{ marginTop: 4 }}>
                          {note.tags.map(tag => (
                            tag && <Tag key={tag.id} color={tag.color || "green"}>{tag.name}</Tag>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无笔记" />
        )
      )}
    </div>
  );
};

// 导出 PropTypes 以供其他组件重用
export { notePropType, categoryPropType, tagPropType };
export default NoteList;