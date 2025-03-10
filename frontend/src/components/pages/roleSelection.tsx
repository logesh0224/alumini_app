
import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { name: 'student', description: 'Explore job opportunities' },
    { name: 'alumni', description: 'Post and share jobs' },
    { name: 'admin', description: 'Manage and approve users' },
  ];
//@ts-ignore
  const handleRoleClick = (role) => {
    if (role === 'alumni') {
      navigate('/alumni/register'); // Navigate to alumni signup
    } else if (role === 'admin') {
      navigate('/admin/login'); // Navigate to admin login
    } else if(role === 'student') {
      navigate('/student/signin'); // Navigate to student login
    }
  };

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <Title level={2}>Who are you?</Title>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {roles.map((role) => (
          <Card
            key={role.name}
            hoverable
            onClick={() => handleRoleClick(role.name)}
            style={{ width: 300, textAlign: 'center' }}
          >
            <Title level={3}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</Title>
            <p>{role.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;