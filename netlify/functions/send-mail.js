import sgMail from "@sendgrid/mail";
import { PDFDocument } from "pdf-lib";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generatePdf = async () => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();
  
  // Draw some content on the page
  page.drawText("E-Agreement", { x: 50, y: height - 100, size: 30 });
  page.drawText("This is an agreement document.", { x: 50, y: height - 150, size: 15 });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

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
    return { statusCode: 200, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { statusCode: 500, message: "Error sending email", error: error.message };
  }
};

// Lambda handler function
export const handler = async (event) => {
  try {
    const { recipientEmail } = JSON.parse(event.body); // Extract the email from the request body

    // Generate PDF
    const pdfBuffer = await generatePdf();

    // Send email with PDF attachment
    const result = await sendEmailWithAttachment(
      recipientEmail, // Dynamically pass the recipient's email
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );

    return {
      statusCode: result.statusCode,
      body: JSON.stringify({
        message: result.message,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing request",
        error: error.message,
      }),
    };
  }
};
