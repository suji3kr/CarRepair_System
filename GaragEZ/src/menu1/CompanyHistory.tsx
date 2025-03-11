import React from 'react';
import {  Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab';
import { Container, Paper, Typography } from '@mui/material';
import Layout from '../components/Layout';

interface HistoryEvent {
  year: string;
  event: string;
}

const companyHistory: HistoryEvent[] = [
  { year: '2020', event: '회사 설립 및 서비스 런칭' },
  { year: '2021', event: '예시로 작성한 페이지입니다' },
  { year: '2022', event: 'AI 추천 서비스 도입' },
  { year: '2023', event: '모바일 앱 출시' },
  { year: '2024', event: '글로벌 시장 진출' },
];

const CompanyHistory: React.FC = () => {
  return (
    <Layout>
    <Container maxWidth="md" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        회사 연혁
      </Typography>
      <Timeline position="alternate">
        {companyHistory.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              {index < companyHistory.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} style={{ padding: '10px 20px' }}>
                <Typography variant="h6" component="span">
                  {item.year}
                </Typography>
                <Typography>{item.event}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
    </Layout>
  );
};

export default CompanyHistory;
