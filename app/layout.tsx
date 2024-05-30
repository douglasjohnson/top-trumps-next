'use client';
import './globals.css';
import React, { useState } from 'react';
import { Navigation } from '@/app/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container } from '@mui/material';
//
// export const metadata: Metadata = {
//   title: 'Top Trumps',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchOnMount: false, staleTime: 60 * 1000 } } }));

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Navigation />
          <Container component="main" disableGutters sx={{ padding: 2, display: 'flex', flex: 'auto', textAlign: 'center' }}>
            {children}
          </Container>
        </QueryClientProvider>
      </body>
    </html>
  );
}
