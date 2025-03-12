import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import Layout from '../components/Layout';

interface Store {
  name: string;
  address: string;
  phone: string;
}

const storeList: Store[] = [
  {
    name: '차고지 스타필드점',
    address: '경기도 수원시',
    phone: '031-1234-5678',
  },
  {
    name: '차고지 용인중앙지점',
    address: '경기도 용인시',
    phone: '031-8765-4321',
  },
  {
    name: '차고지 서울점',
    address: '서울특별시 강남구',
    phone: '02-555-6789',
  },
  {
    name: '차고지 부산점',
    address: '부산광역시 해운대구',
    phone: '054-555-6789',
  },
  {
    name: '차고지 제주점',
    address: '제주특별자치도 서귀포시',
    phone: '064-555-6789',
  },
];

const StoreList: React.FC = () => {
  return (
    <Layout>
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        체인점 안내
      </Typography>
      <Paper elevation={3}>
        <List>
          {storeList.map((store, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={store.name}
                secondary={
                  <>
                    <Typography variant="body2">주소: {store.address}</Typography>
                    <Typography variant="body2">전화번호: {store.phone}</Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
    <br></br>
    </Layout>
  );
};

export default StoreList;
