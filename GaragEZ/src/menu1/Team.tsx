import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import Layout from '../components/Layout';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: '강미림',
    role: '백엔드 개발자(팀장)',
    description: '서버 개발 및 데이터베이스 설계를 담당합니다.',
    avatarUrl: '/images/avatar1.png',
  },
  {
    name: '권민우',
    role: '프론트엔드 개발자(팀원)',
    description: 'UI/UX 디자인과 React 개발을 맡고 있습니다.',
    avatarUrl: '/images/avatar2.png',
  },
  {
    name: '박영웅',
    role: '백엔드 개발자(팀원)',
    description: '서버 개발 및 데이터베이스 설계를 담당합니다.',
    avatarUrl: '/images/avatar3.png',
  },
  {
    name: '황승현',
    role: '프론트엔드 개발자(팀원)',
    description: 'UI/UX 디자인과 React 개발을 맡고 있습니다.',
    avatarUrl: '/images/avatar4.png',
  },
];

const Team: React.FC = () => {
  return (
    <Layout>
      
    <Container maxWidth="md" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        우리 팀을 소개합니다
      </Typography>
      <Grid container spacing={4}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={6} key={index}>
            <Card elevation={3}>
              <CardContent style={{ textAlign: 'center' }}>
                <Avatar
                  src={member.avatarUrl}
                  alt={member.name}
                  sx={{ width: 100, height: 100, margin: '0 auto 10px' }}
                />
                <Typography variant="h6">{member.name}</Typography>
                <Typography color="textSecondary">{member.role}</Typography>
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                  {member.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    <br></br>
    </Layout>
  );
};

export default Team;
