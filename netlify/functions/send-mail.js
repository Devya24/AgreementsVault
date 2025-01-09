import sgMail from "@sendgrid/mail";
import { PDFDocument } from "pdf-lib";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

// Function to generate PDF from HTML content
const generatePdfFromHtml = async (htmlContent) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]); // You can adjust the page size

  // Add text to the PDF (you can expand this for more complex content)
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  
  page.drawText(htmlContent, {
    x: 50,
    y: pageHeight - 50,
    size: 12,
    maxWidth: pageWidth - 100,
  });

  // Convert the PDF to a buffer
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

// Function to send email with the PDF as an attachment
const sendEmailWithAttachment = async (toEmail, subject, content, pdfBuffer) => {
  const msg = {
    to: toEmail,
    from: "developer@devya.in", // Replace with your email
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
    await sgMail.send(msg);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
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
    const { recipientEmail } = JSON.parse(event.body); // Extract the email from the request body

    // Generate PDF from HTML
    const pdfBuffer = await generatePdfFromHtml(htmlTemplate);

    // Send email with the PDF as attachment
    await sendEmailWithAttachment(
      recipientEmail, // Dynamically pass the recipient's email
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
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
