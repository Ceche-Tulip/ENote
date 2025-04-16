import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Divider, 
  Spin, 
  Popconfirm,
  message
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined
} from '@ant-design/icons';
import { fetchNoteById, deleteNote, clearCurrentNote } from '../../store/noteSlice';
import { notePropType } from './NoteList'; // 导入之前定义的 PropType

const { Title, Text, Paragraph } = Typography;

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentNote, loading, error } = useSelector(state => state.notes);

  // 加载笔记数据
  useEffect(() => {
    if (id) {
      dispatch(fetchNoteById(id));
    }
    
    // 组件卸载时清除当前笔记
    return () => {
      dispatch(clearCurrentNote());
    };
  }, [dispatch, id]);

  // 处理删除笔记
  const handleDelete = () => {
    dispatch(deleteNote(id)).then((result) => {
      if (!result.error) {
        message.success('笔记已删除');
        navigate('/notes');
      }
    });
  };

  // 处理编辑笔记
  const handleEdit = () => {
    navigate(`/notes/${id}/edit`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/notes')}>
          返回笔记列表
        </Button>
        <div style={{ marginTop: 16 }}>
          <Text type="danger">加载笔记失败: {error}</Text>
        </div>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>未找到笔记</Text>
        <br />
        <Button 
          type="primary" 
          onClick={() => navigate('/notes')}
          style={{ marginTop: 16 }}
        >
          返回笔记列表
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/notes')}
        >
          返回笔记列表
        </Button>
      </div>

      <Card
        title={
          <Title level={3} style={{ marginBottom: 0 }}>
            {currentNote.title}
          </Title>
        }
        extra={
          <Space>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这条笔记吗？"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            {currentNote.category && (
              <div>
                <Text strong>分类：</Text>
                <Tag color="blue">{currentNote.category.name}</Tag>
              </div>
            )}
            
            {currentNote.tags && currentNote.tags.length > 0 && (
              <div>
                <Text strong>标签：</Text>
                <Space>
                  {currentNote.tags.map(tag => (
                    <Tag key={tag.id} color="green">{tag.name}</Tag>
                  ))}
                </Space>
              </div>
            )}
            
            <div>
              <Text type="secondary">
                创建于 {new Date(currentNote.createdAt).toLocaleString()}
                {currentNote.updatedAt && currentNote.updatedAt !== currentNote.createdAt && (
                  <>, 更新于 {new Date(currentNote.updatedAt).toLocaleString()}</>
                )}
              </Text>
            </div>
          </Space>
        </div>
        
        <Divider />
        
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {currentNote.content ? (
            <Paragraph>{currentNote.content}</Paragraph>
          ) : (
            <Text type="secondary" italic>暂无内容</Text>
          )}
        </div>
      </Card>
    </div>
  );
};

// 组件 PropTypes 定义
NoteDetail.propTypes = {
  // 这里使用 Redux，不需要传递属性，但为了组件重用性，仍然定义可能使用的类型
  note: notePropType,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onBack: PropTypes.func,
  loading: PropTypes.bool
};

NoteDetail.defaultProps = {
  loading: false
};

export default NoteDetail;