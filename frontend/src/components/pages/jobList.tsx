
import { Card, Button, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full Time',
    description: 'We are looking for a skilled software engineer to join our team.',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovate Inc',
    location: 'New York, NY',
    type: 'Full Time',
    description: 'Join us as a product manager to drive innovation and growth.',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Data Works',
    location: 'Remote',
    type: 'Remote',
    description: 'We need a data scientist to analyze and interpret complex data.',
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    type: 'Part Time',
    description: 'Looking for a creative UI/UX designer to enhance user experiences.',
  },
];
 {/* @ts-ignore */}

const JobList = ({ filters }) => {
  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      job.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      (filters.type === '' || job.type === filters.type)
    );
  });

  return (
    <Row gutter={[16, 16]}>
      {filteredJobs.map((job) => (
        <Col key={job.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            title={<Title level={4}>{job.title}</Title>}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            <Text strong>Company:</Text> {job.company} <br />
            <Text strong>Location:</Text> {job.location} <br />
            <Text strong>Job Type:</Text> {job.type} <br />
            <Text strong>Description:</Text> {job.description} <br />
            <Button type="primary" style={{ marginTop: '16px' }}>
              Apply Now
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default JobList;