import sgMail from "@sendgrid/mail";
import fs from "fs";
import pdf from "html-pdf-node"; // Install this library: npm install html-pdf-node

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// Function to generate PDF from HTML content
const generatePdfFromHtml = async (htmlContent) => {
  const file = { content: htmlContent };
  const options = { format: "A4" }; // You can customize this

  return new Promise((resolve, reject) => {
    pdf.generatePdf(file, options, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
};

// Function to send email with the PDF as an attachment
const sendEmailWithAttachment = async (toEmail, subject, content, pdfBuffer) => {
  const msg = {
    to: toEmail,
    from: "developer@devya.in", // Replace with your verified email
    subject: subject,
    text: content,
    attachments: [
      {
        filename: "Eagreement.pdf",
        content: pdfBuffer.toString("base64"),
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error response:", error.response.body);
      return error.response.body;
    }
    return { message: "An unexpected error occurred", error: error.message };
  }
};

// HTML Template for PDF
const htmlTemplate = `
  <html>
    <head>
      <title>E-Agreement</title>
    </head>
    <body>
      <h1>E-Agreement</h1>
      <p>Dear User,</p>
      <p>Please read the following terms and conditions carefully. By accepting, you agree to the terms outlined below.</p>
      <ul>
        <li>Term 1</li>
        <li>Term 2</li>
        <li>Term 3</li>
      </ul>
      <p>&copy; Devya. All rights reserved.</p>
    </body>
  </html>
`;

// Lambda function handler
export const handler = async (event) => {
  try {
    const { recipientEmail } = JSON.parse(event.body);

    // Generate PDF from HTML
    const pdfBuffer = await generatePdfFromHtml(htmlTemplate);

    // Send email with the PDF as attachment
    const response = await sendEmailWithAttachment(
      recipientEmail,
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
        sendGridResponse: response,
      }),
    };
  } catch (error) {
    console.error("Error in Lambda function:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error sending email",
        error: error.message,
      }),
    };
  }
};
