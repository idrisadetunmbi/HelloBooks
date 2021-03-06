import http from 'http';
import app from '../app';

const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
console.log(`Listening on port: ${port}`);

export default server;
