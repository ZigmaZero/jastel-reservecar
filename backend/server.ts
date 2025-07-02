import app from "./app.js";
import path from 'path'
import fs from 'fs';
import https from 'https'
import http from 'http';

const startHttpServer = () => {
  app.listen(port, '0.0.0.0', async () => {
    console.log(`Server listening on port ${port}`);
  });
};

const startHttpRedirectServer = () => {
  // Create a simple HTTP server that redirects to HTTPS
  const redirectServer = http.createServer((req, res) => {
    const host = req.headers.host?.replace(/:3000|:80$/, '') ?? '';
    const httpsUrl = `https://${host}${req.url}`;
    res.writeHead(301, { 'Location': httpsUrl });
    res.end();
  });
  
  redirectServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTP redirect server listening on port ${port}, redirecting to HTTPS`);
  });
};

const port = 3000;
if (process.env.NODE_ENV === 'production') {
  try {
    const options = {
      key: fs.readFileSync(path.resolve(`./certs/${process.env.CERT_KEY || 'key.pem'}`)),
      cert: fs.readFileSync(path.resolve(`./certs/${process.env.CERT_CERT || 'cert.pem'}`)),
    };

    https.createServer(options, app).listen(8443, () => {
      console.log('HTTPS server running in production on port 8443');
      // Start HTTP redirect server after HTTPS is successfully running
      startHttpRedirectServer();
    });
  }
  catch (error) {
    console.error('Failed to start HTTPS server:', error);
    startHttpServer();
  }
} else {
  startHttpServer();
}