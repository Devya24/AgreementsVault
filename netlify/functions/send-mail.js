// netlify/functions/send-mail.js
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export const handler = async (event) => {
  try {
    // Parse the body data
    const body = JSON.parse(event.body);

    const { to, subject, content } = body;

    // Validate input
    if (!to || !subject || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "All fields (to, subject, content) are required.",
        }),
      };
    }

    // Define the email content
    const msg = {
      to: [to, "developer@devya.in"], // Recipient email
      from: "developer@devya.in", // Replace with your email
      subject, // Email subject
      text: content, // Plain text content
      html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
      }
      .header {
        background-color: #007bff;
        color: #fff;
        padding: 20px;
        text-align: center;
        position: relative;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .header .date {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 14px;
        color: #fff;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
        color: #333;
        background-color: #fafafa;
        border-bottom: 1px solid #ddd;
      }
      .content h2 {
        color: #007bff;
      }
      .content p {
        margin-bottom: 15px;
      }
      .footer {
        background-color: #f8f8f8;
        color: #777;
        text-align: center;
        padding: 20px;
        font-size: 0.9em;
        position: relative;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
      .footer .signature {
        position: absolute;
        bottom: 10px;
        right: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .footer .signature img {
        max-width: 100px;
        display: block;
        margin-top: 5px;
      }
      .terms {
        margin-top: 20px;
        padding: 10px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .terms ul {
        list-style-type: none;
        padding: 0;
      }
      .terms li {
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${subject}</h1>
        <div class="date">${new Date().toLocaleDateString()}</div>
      </div>
      <div class="content">
        <h2>Terms and Conditions</h2>
        <p>Dear Drupad,</p>
        <p>Please read the following terms and conditions carefully. By accepting, you agree to the terms outlined below.</p>
        
        <div class="terms">
          <ul>
            <li>1. You must comply with all applicable laws and regulations.</li>
            <li>2. You agree to not misuse the services provided.</li>
            <li>3. All intellectual property rights remain with the provider.</li>
            <li>4. The provider is not responsible for any damages caused by using the services.</li>
            <li>5. The provider reserves the right to terminate your access at any time without notice.</li>
          </ul>
        </div>
        
        <p>If you have any questions, please do not hesitate to reach out to us.</p>
        <p>Best regards,</p>
        <p><strong>Devya</strong></p>
      </div>
      <div class="footer">
        <p>&copy; Devya. All rights reserved.</p>
        <p><a href="https://devya.in">Visit our website</a></p>
        <div class="signature">
          <p>Signature</p>
          <!-- Fake signature image -->
          <img src="https://via.placeholder.com/150x50?text=Signature" alt="Signature" />
        </div>
      </div>
    </div>
  </body>
</html>
`,
    };

    // Send email using SendGrid
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully!",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email.",
        details: error.message,
      }),
    };
  }
};
