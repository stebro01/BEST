const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

if (!process.env.PORT) {
  console.log('No port specified in enviromentals!');
  process.exit(1);
}

const ENV = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  USER: process.env.USER,
  PORT: process.env.PORT,
  TOKEN: process.env.TOKEN
}


const port = ENV.PORT || 3000;

const allowedOrigins = ['https://www.surveybest.de', 'https://localhost:8088'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
