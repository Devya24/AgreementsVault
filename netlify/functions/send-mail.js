// netlify/functions/send-mail.js
import sgMail from '@sendgrid/mail';

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
      to: [to, 'developer@devya.in'],            // Recipient email
      from: "developer@devya.in", // Replace with your email
      subject,       // Email subject
      text: content, // Plain text content
      html: `
      <!DOCTYPE html>
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
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #007bff;
              color: #fff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            .content p {
              margin-bottom: 15px;
            }
            .footer {
              background-color: #f8f8f8;
              color: #777;
              text-align: center;
              padding: 10px;
              font-size: 0.8em;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              <p>${content}</p>
            </div>
            <div class="footer">
              <p>&copy;Devya. All rights reserved.</p>
              <p><a href="https:/devya.in">Visit our website</a></p>
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
        message: 'Email sent successfully!',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send email.',
        details: error.message,
      }),
    };
  }
};
