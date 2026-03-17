const nodemailer = require("nodemailer");
// const { tr } = require("zod/v4/locales");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn('EMAIL_USER ou EMAIL_PASS não configurados.');
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
});

const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      html,
      text
    });
    console.log('Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    return null;
  }
};

module.exports = {
  transporter,
  sendMail,
};