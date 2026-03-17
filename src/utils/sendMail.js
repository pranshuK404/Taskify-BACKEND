import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS, // put all in env file
  },
});

const sendMail = async (to, verificationLink) => {
  await transporter.sendMail({
    from: '"MyApp" <no-reply@myapp.com>',
    to,
    subject: "Verify your email",
    html: `please click to verify email: <br>
        ${verificationLink}
    `,
  });
};

export {sendMail}

//-- for now we are using mailtrap for testing purpose, in production we can use any other service like sendgrid, amazon ses etc.