import sgMail from "@sendgrid/mail";
import chromium from "chrome-aws-lambda"; // For prebuilt Chromium
import puppeteer from "puppeteer-core"; // Lightweight puppeteer package

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "load" });
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return pdfBuffer;
};

const sendEmailWithAttachment = async (toEmail, subject, content, pdfBuffer) => {
  const msg = {
    to: toEmail,
    from: "developer@devya.in",
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
