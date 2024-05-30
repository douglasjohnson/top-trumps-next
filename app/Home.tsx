import { Card, CardMedia, Stack } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Stack sx={{ flex: 'auto', justifyContent: 'center', alignItems: 'center' }} direction="row" spacing={2}>
      <Link href="/admin" aria-label="build">
        <Card>
          <CardMedia component="img" height="240" image="https://cdn.akamai.steamstatic.com/steam/apps/816240/capsule_616x353.jpg?t=1595857182" />
        </Card>
      </Link>
      <Link href="/game" aria-label="play">
        <Card>
          <CardMedia
            component="img"
            height="240"
            image="https://sm.pcmag.com/pcmag_uk/how-to/i/instant-co/instant-co-op-how-to-play-ps5-games-with-friends-using-share_n6u6.jpg"
          />
        </Card>
      </Link>
    </Stack>
  );
}
