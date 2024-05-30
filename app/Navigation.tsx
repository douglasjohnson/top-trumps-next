import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  let title: string;
  switch (pathname) {
    case '/admin':
      title = 'Build';
      break;
    case '/game':
      title = 'Play';
      break;
    case '/':
    default:
      title = 'Home';
  }

  return (
    <AppBar component="nav" position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Link href="/">
          <Button sx={{ color: 'white' }}>Home</Button>
        </Link>
        <Link href="/admin">
          <Button sx={{ color: 'white' }}>Build</Button>
        </Link>
        <Link href="/game">
          <Button sx={{ color: 'white' }}>Play</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
