// netlify/functions/send-mail.js
const sendMail = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Email sent successfully!"
    }),
  };
};

// Use ES module export
export { sendMail as handler };
