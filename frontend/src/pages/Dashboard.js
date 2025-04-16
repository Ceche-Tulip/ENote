import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Statistic, List, Typography, Spin } from 'antd';
import { 
  FileTextOutlined, 
  FolderOutlined, 
  TagsOutlined 
} from '@ant-design/icons';
import { fetchAllNotes } from '../store/noteSlice';
import { fetchAllCategories } from '../store/categorySlice';
import { fetchAllTags } from '../store/tagSlice';

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { notes, loading: notesLoading } = useSelector(state => state.notes);
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { tags, loading: tagsLoading } = useSelector(state => state.tags);

  // 加载数据
  useEffect(() => {
    dispatch(fetchAllNotes());
    dispatch(fetchAllCategories());
    dispatch(fetchAllTags());
  }, [dispatch]);

  // 获取最近的笔记（添加安全检查）
  const recentNotes = Array.isArray(notes) 
    ? [...notes].sort((a, b) => 
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      ).slice(0, 5)
    : [];

  const loading = notesLoading || categoriesLoading || tagsLoading;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>仪表板</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="全部笔记"
              value={Array.isArray(notes) ? notes.length : 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="分类数量"
              value={Array.isArray(categories) ? categories.length : 0}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="标签数量"
              value={Array.isArray(tags) ? tags.length : 0}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近更新的笔记" extra={<Link to="/notes">查看全部</Link>}>
        {recentNotes.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={recentNotes}
            renderItem={note => (
              <List.Item>
                <List.Item.Meta
                  title={<Link to={`/notes/${note.id}`}>{note.title}</Link>}
                  description={
                    <div>
                      {note.category && (
                        <Text type="secondary" style={{ marginRight: 8 }}>
                          分类: {note.category.name}
                        </Text>
                      )}
                      <Text type="secondary">
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">还没有笔记，开始创建您的第一条笔记吧！</Text>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;