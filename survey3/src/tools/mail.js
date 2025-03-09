import { log } from "src/tools/Logger"

// sendgrid key
const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJqMzMyMTg0XzAtc3VydmV5IiwiaWF0IjoxNjI0NjU0NjQyLCJleHAiO'
const api_url = 'https://www.surveybest.de/mail/sendEmail'
const axios = require('axios');


export async function sendMail(message) {
  log({ message: 'sendMail' })
  if (!message.email || !message.data) {
    return { error: 'no email or data' }
  }

  //date from today in format: YYYY-MM-DD, HH:MM:SS
  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ', ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  let data = JSON.stringify({
    "TOKEN": api_key,
    "to": message.email || "info@surveybest.de",
    "subject": "Report surveyBEST: " + date,
    "message": "Vielen Dank für die Nutzung von surveyBEST. Anbei ein Report.",
    "attachment": message.data
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: api_url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    const answ = await axios.request(config)
    return { status: answ.status, data: answ.data }
  }
  catch (error) {
    return { error: error }
  }

}

export async function checkMail() {
  // make an axios request to the backend via get and return the response
  log({ message: 'checkMail' })
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: api_url,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const answ = await axios.request(config)
    return { status: answ.status, data: answ.data }
  }
  catch (error) {
    return { error: error }
  }
}
