import { sgMail } from "@sendgrid/mail";
import { launch } from "puppeteer";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generatePdf = async (htmlContent) => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
};

// Function to send email with PDF attachment
const sendEmailWithAttachment = async (
  toEmail,
  subject,
  content,
  pdfBuffer
) => {
  const msg = {
    to: toEmail,
    from: "your-email@example.com", // Replace with your email
    subject: subject,
    text: content,
    attachments: [
      {
        filename: "agreement.pdf",
        content: pdfBuffer.toString("base64"),
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await send(msg);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// HTML Template for PDF
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>E-Agreement</title>
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
      .footer {
        background-color: #f8f8f8;
        color: #777;
        text-align: center;
        padding: 20px;
        font-size: 0.9em;
        position: relative;
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
        <h1>E-Agreement</h1>
        <div class="date">${new Date().toLocaleDateString()}</div>
      </div>
      <div class="content">
        <h2>Terms and Conditions</h2>
        <p>Dear User,</p>
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
        <p><strong>Your Company Name</strong></p>
      </div>
      <div class="footer">
        <p>&copy; Devya. All rights reserved.</p>
        <p><a href="https://devya.in">Visit our website</a></p>
        <div class="signature">
          <p>Signature</p>
          <img src="https://via.placeholder.com/150x50?text=Signature" alt="Signature" />
        </div>
      </div>
    </div>
  </body>
</html>
`;

const sendEmailWithPdfAttachment = async () => {
  try {
    // Generate PDF from HTML
    const pdfBuffer = await generatePdf(htmlTemplate);

    // Send email with PDF as attachment
    await sendEmailWithAttachment(
      "recipient@example.com", // Replace with recipient's email
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
  }
};

// Trigger the email sending process
sendEmailWithPdfAttachment();
