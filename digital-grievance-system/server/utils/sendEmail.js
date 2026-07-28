const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using SMTP (Gmail in this case)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another provider like 'SendGrid', 'Mailgun', etc.
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // Define email options
  const mailOptions = {
    from: `NIVARAN Jan Shikayat Portal <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
