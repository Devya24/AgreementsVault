import { useState, useRef } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function HomePage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    emailId: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    emailId: "",
    phoneNumber: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const validateForm = () => {
    const newErrors = { username: "", emailId: "", phoneNumber: "" };
    if (!formData.username) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!formData.emailId) {
      newErrors.emailId = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = "Enter a valid email address.";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit Indian phone number.";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.emailId && !newErrors.phoneNumber;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return; // Prevent non-numeric input for phone number
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteCapturedImage = (index) => {
    setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file && capturedImages.length < 4) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX || e.touches[0].clientX - rect.left;
    const y = e.nativeEvent.offsetY || e.touches[0].clientY - rect.top;
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.nativeEvent.offsetX || e.touches[0].clientX - rect.left;
    const y = e.nativeEvent.offsetY || e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      setSignature(dataURL);
    }
    setIsDrawing(false);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  // const handleSubmit = () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   if ((!uploadedFile && capturedImages.length === 0) || !signature) {
  //     alert("All fields are mandatory!");
  //     return;
  //   }
  // };
  // useEffect(() => {
  //   fetch("/.netlify/functions/send-mail")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message); // "Email sent successfully!"
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }, []);
  const handleSubmit1 = async () => {
      const payload = {
        toEmail: "recipient@example.com", // Replace with recipient's email
        subject: "Welcome to Our Platform",
        content: "Thank you for joining us! Please find the attached agreement document.",
        htmlTemplate: `
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
              .footer {
                background-color: #f8f8f8;
                color: #777;
                text-align: center;
                padding: 20px;
                font-size: 0.9em;
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
                <p>Thank you for signing up! Below are the terms and conditions of our agreement.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Devya. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
  
      try {
        const response = await fetch("/.netlify/functions/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (response.ok) {
          console.log("Email sent successfully!");
        } else {
          console.error("Failed to send email:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
  };
  const sendEmail = async (recipientEmail) => {
    const response = await fetch('/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: recipientEmail, // Pass the recipient's email here
      }),
    });
  
    const data = await response.json();
    console.log(data.message);
  };
  
  // Usage:
  sendEmail("harish.inboxme@gmail.com");
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={!!errors.username}
            helperText={errors.username}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email ID"
            name="emailId"
            type="email"
            value={formData.emailId}
            onChange={handleInputChange}
            error={!!errors.emailId}
            helperText={errors.emailId}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          pt={2}
          pl={2}
          spacing={2} // Add spacing between the buttons
        >
          {/* Capture Image Section */}
          <Grid item xs={6} sm={6}>
            {" "}
            {/* Adjusted to make both buttons same size */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAltIcon />}
              >
                Capture
                <input
                  type="file"
                  accept="image/*"
                  capture="camera"
                  hidden
                  onChange={handleCameraCapture}
                />
              </Button>
            </Box>
          </Grid>

          {/* Upload Document Section */}
          <Grid item xs={6} sm={6}>
            {" "}
            {/* Adjusted to make both buttons same size */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUploadIcon />}
              >
                Upload
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.png,.jpg"
                  onChange={handleFileUpload}
                />
              </Button>
              {uploadedFile && <Typography>{uploadedFile.name}</Typography>}
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {capturedImages.length > 0 && (
            <Typography variant="body1">Captured Images:</Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {capturedImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: "calc(33.33% - 16px)", // Adjust to fit images in a row of 3
                  margin: "5px",
                  overflow: "hidden",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <img
                  src={image}
                  alt={`Captured ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "rgba(255, 255, 255, 0.8)",
                  }}
                  size="small"
                  onClick={() => handleDeleteCapturedImage(index)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">Digital Signature:</Typography>
          <canvas
            ref={canvasRef}
            width={300}
            height={100}
            style={{ border: "1px solid #000", marginTop: "8px" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          ></canvas>
          <Button variant="outlined" color="primary" onClick={handleReset}>
            Reset Signature
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 4, backgroundColor: "#143232" }}
        onClick={handleSubmit1}
      >
        Submit
      </Button>
    </Box>
  );
}

export default HomePage;
