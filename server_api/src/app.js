const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const ENV = {
  SMTP_HOST: 'smtp.1blu.de',
  SMTP_PORT: 465,
  SMTP_SECURE: 'true',
  EMAIL: 'info@surveybest.de',
  PASSWORD: 'Floq7iqbJVpz)7j',
  USER: 'j332184_0-survey',
  PORT: 3000,
  TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJqMzMyMTg0XzAtc3VydmV5IiwiaWF0IjoxNjI0NjU0NjQyLCJleHAiO'
}


const port = ENV.PORT || 3000;

const corsOptions = {
  origin: 'https://www.surveybest.de',
  methods: 'GET,POST',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/sendEmail', async (req, res) => {
  res.send('Der Email-Service ist gestartet.');
});

app.post('/sendEmail', async (req, res) => {
  try {
    const { to, subject, message, attachment, TOKEN } = req.body;
    if (!TOKEN || TOKEN !== ENV.TOKEN) {
      res.send('Invalid token');
      return;
    }
    // SOME DEMO DATA
    var demo_attachment = {
        filename: 'attachment.json',
        content: JSON.stringify({
          "name": "John Doe",
          "age": 30,
        })
      }

    const transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_SECURE === 'true',
      auth: {
        user: ENV.USER,
        pass: ENV.PASSWORD
      }
    });

    const mailOptions = {
      from: ENV.EMAIL,
      to: to || ENV.EMAIL,
      subject: subject || 'Default Subject',
      text: message || 'Default message',
      attachments: attachment ? [
        {
          filename: 'attachment.json',
          content: JSON.stringify(attachment)
        }
      ] : demo_attachment
    };

    const emailResponse = await transporter.sendMail(mailOptions);
    res.send('Email sent: ' + emailResponse.response);
  } catch (error) {
    res.send('An error occurred: ' + error);
  }
});

// HTTP
// app.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });

//HTTPS
const fs = require('fs')
const privateKey = fs.readFileSync('./ssl/private.key', 'utf8')
const certificate = fs.readFileSync('./ssl/cert.pem', 'utf8')
const ca = fs.readFileSync('./ssl/bridgecert', 'utf8')
const https = require('https')
const credentials = { key: privateKey, cert: certificate, ca: ca }; // If applicable
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(port, () => {
  console.log(`HTTPS server running on port ${port}`);
});
