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
    const sendResponse = await sgMail.send(msg);
    return { success: true, response: sendResponse }; // Return SendGrid's response
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error); // Log detailed error
    return { success: false, error: error.response ? error.response.body : error }; // Return the actual error
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
    const emailResult = await sendEmailWithAttachment(
      recipientEmail, // Dynamically pass the recipient's email
      "Welcome to Our Platform",
      "Please find the attached agreement document.",
      pdfBuffer
    );

    return emailResult; // Return the result of SendGrid's response or error
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    return { success: false, error: error.message }; // Return error if there's an issue
  }
};

export const handler = async (event) => {
  try {
    const { recipientEmail } = JSON.parse(event.body); // Extract the email from the request body

    // Call the function to send the email with the attachment
    const emailResult = await sendEmailWithPdfAttachment(recipientEmail);

    if (emailResult.success) {
      // Return SendGrid's response if email is sent successfully
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Email sent successfully",
          sendResponse: emailResult.response, // Include the SendGrid response
        }),
      };
    } else {
      // Return the actual error response if email sending failed
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Error sending email",
          error: emailResult.error, // Include the actual error message from SendGrid
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
