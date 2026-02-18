const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  // Validation
  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "All fields are required." }),
    };
  }

  try {
    // Email 1: To you
    await sgMail.send({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Website Message: ${subject}`,
      html: `
        <h3>New Website Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Email 2: Auto-reply
    await sgMail.send({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
        <h1>Thank You, ${name}!</h1>
        <p>I've received your message and will get back to you within 24-48 hours.</p>
        <p>Best regards,<br>Betsaleel Mukuba</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Email sending failed." }),
    };
  }
};