import nodemailer from "nodemailer";

// Konfiguration af Gmail SMTP Server
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "joe.cbs.eksame@gmail.com", // Gmail-adresse
    pass: "yfty rrmo rkob zjly", // Gmail app password
  },
});

// Verificer forbindelsen til Gmail SMTP serveren
transporter.verify(function (error, success) {
  if (error) {
    console.error("Error verifying SMTP transporter:", error);
  } else {
    console.log("SMTP transporter is ready to send emails");
  }
});


export async function mailToUser(recipients, subjectMsg, textMsg, htmlMsg) {
  const sender = "JOE <joe.cbs.eksame@gmail.com>";
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: recipients,
      subject: subjectMsg,
      text: textMsg,
      html: htmlMsg,
    });
    console.log("Email sent successfully: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
