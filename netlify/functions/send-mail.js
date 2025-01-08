// netlify/functions/send-mail.js
const sendMail = async (event) => {
    // You can still handle logic like sending an email or similar here.
    // For now, we will just return a success response.
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully!"
      }),
    };
  };
  
  export { sendMail };
  