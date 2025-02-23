import express from 'express';
        import serverless from 'serverless-http';
        const app = express();
        app.get('/', (req, res) => {
          res.send('Hello from Vercel!');
        });
        export default serverless(app);