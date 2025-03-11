import React from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import Layout from '../components/Layout';

interface Event {
  title: string;
  date: string;
  description: string;
}

const pastEvents: Event[] = [
  {
    title: '겨울철 무상 차량 점검 이벤트',
    date: '2024-12-01 ~ 2024-12-15',
    description: '겨울철 대비 타이어 및 엔진오일 무료 점검을 진행하였습니다.',
  },
  {
    title: '엔진오일 교체 할인 이벤트',
    date: '2024-10-01 ~ 2024-10-31',
    description: '모든 차량 엔진오일 교체 비용 20% 할인 이벤트를 진행했습니다.',
  },
  {
    title: '브레이크 시스템 점검 캠페인',
    date: '2024-08-15 ~ 2024-08-30',
    description: '안전 운행을 위한 브레이크 시스템 무료 점검을 실시했습니다.',
  },
];

const PastEvents: React.FC = () => {
  return (
    <Layout>
    <Container maxWidth="md" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        지난 이벤트
      </Typography>
      <Grid container spacing={4}>
        {pastEvents.map((event, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {event.date}
                </Typography>
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Layout>
  );
};

export default PastEvents;
