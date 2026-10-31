/** Authoritative server entrypoint (D-036 spike). Run: npm run dev:server (tsx watch). */
import { Server } from 'colyseus';
import { LastOrbitRoom } from './room';

const port = Number(process.env.PORT ?? 2567);
const server = new Server();
server.define('last_orbit', LastOrbitRoom);
server.listen(port).then(
  () => console.log(`Last Orbit authoritative server listening on :${port}`),
  (err) => {
    console.error('failed to listen', err);
    process.exit(1);
  },
);
