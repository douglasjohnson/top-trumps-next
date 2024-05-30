import { CircularProgress, Container } from '@mui/material';
import React from 'react';

export default function Loading() {
  return (
    <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );
}
