import { log } from "src/tools/Logger"

// import emailjs from '@emailjs/browser';


export async function sendMail(message) {
  console.log(message)
  log({ message: 'sendMail' })

  // HIER SOLLTE JETZT DER EMAIL VERSAND HIN ...
  var templateParams = {
    from_name: 'surveyBEST form',
    mail_to: message.email,
    content: btoa(JSON.stringify(message.data)),
  };

  emailjs.send('service_vrqgv6q', 'template_yywure9', templateParams, 'user_8OFpuEKo82tWvLxKamkmr')
    .then((result) => {
      log({ method: 'sendmail', message: 'success' })
      // resolve(true)
    })
}
