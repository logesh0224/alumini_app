import  { useState } from 'react';
import { Input, Select, Button, Row, Col } from 'antd';

const { Option } = Select;

 {/* @ts-ignore */}
const JobFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: '',
  });
 {/* @ts-ignore */}
  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilter = () => {
    onFilter(filters);
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col span={8}>
        <Input
          placeholder="Job Title"
          value={filters.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </Col>
      <Col span={8}>
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </Col>
      <Col span={8}>
        <Select
          placeholder="Job Type"
          style={{ width: '100%' }}
          value={filters.type}
          onChange={(value) => handleChange('type', value)}
        >
          <Option value="">All</Option>
          <Option value="Full Time">Full Time</Option>
          <Option value="Part Time">Part Time</Option>
          <Option value="Remote">Remote</Option>
        </Select>
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={handleApplyFilter}>
          Apply Filters
        </Button>
      </Col>
    </Row>
  );
};

export default JobFilter;