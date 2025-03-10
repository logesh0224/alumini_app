import { useState } from 'react';
import { Layout, Typography, Row, } from 'antd';
import JobFilter from './jobFilter';
import JobList from './jobList';

const { Content } = Layout;
const { Title } = Typography;

const JobsPage = () => {
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: '',
  });


  //@ts-ignore
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Layout style={{ padding: '24px', minHeight: '100vh' }}>
      <Content>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Job Listings
        </Title>
        <JobFilter onFilter={handleFilter} />
        <Row gutter={[16, 16]}>
          <JobList filters={filters} />
        </Row>
      </Content>
    </Layout>
  );
};

export default JobsPage;