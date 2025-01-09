import sgMail from "@sendgrid/mail";
import chromium from "chrome-aws-lambda";
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generatePdf = async (htmlContent) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: true,
  });
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
    return true; // Return true if email is sent successfully
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error); // Detailed error logging
    return false; // Return false if there is an error
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
      /* Styles omitted for brevity */
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
        <!-- Terms and conditions omitted for brevity -->
      </div>
      <div class="footer">
        <p>&copy; Devya. All rights reserved.</p>
        <p><a href="https://devya.in">Visit our website</a></p>
      </div>
    </div>
  </body>
</html>
`;

const sendEmailWithPdfAttachment = async (recipientEmail) => {
  try {
    // Generate PDF from HTML
    const pdfBuffer = await generatePdf(htmlTemplate);

    // Send email with PDF as attachment
    const emailSent = await sendEmailWithAttachment(
      recipientEmail, // Dynamically pass the recipient's email
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );

    return emailSent; // Return whether email was sent successfully or not
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    return false; // Return false if there's an error
  }
};

export const handler = async (event) => {
  try {
    const { recipientEmail } = JSON.parse(event.body); // Extract the email from the request body

    // Call the function to send the email with the attachment
    const emailSent = await sendEmailWithPdfAttachment(recipientEmail);

    if (emailSent) {
      // Return a success response if email is sent
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Email sent successfully",
        }),
      };
    } else {
      // Return an error response if email sending failed
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error sending email",
        }),
      };
    }
  } catch (error) {
    console.error("Error in Lambda function:", error);

    // Return an error response if there's an error in the Lambda function
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing request",
        error: error.message,
      }),
    };
  }
};
