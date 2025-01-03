import { useState, useRef } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import { jsPDF } from "jspdf";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Import Camera Icon

function HomePage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ username: "", emailId: "" });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // New state to hold the captured image

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result); // Set the captured image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureEnd = () => {
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL("image/png"));
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    setSignature(null); // Reset the signature state
  };

  const handleSubmit = () => {
    if (
      !formData.username ||
      !formData.emailId ||
      (!uploadedFile && !capturedImage) || // Check for file or image
      !signature
    ) {
      alert("All fields are mandatory!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("User Details", 10, 20);
    doc.text(`Username: ${formData.username}`, 10, 30);
    doc.text(`Email ID: ${formData.emailId}`, 10, 40);

    if (uploadedFile) {
      doc.text("Uploaded Document:", 10, 50);
      doc.text(uploadedFile.name, 10, 60);
    } else if (capturedImage) {
      doc.text("Captured Image:", 10, 50);
      doc.text("Image uploaded from camera", 10, 60);
    }

    if (signature) {
      doc.text("Signature:", 10, 70);
      const imgWidth = 50;
      const imgHeight = 20;
      doc.addImage(signature, "PNG", 10, 80, imgWidth, imgHeight);
    }

    doc.save("user_details.pdf");
  };

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
          />
        </Grid>
        
        {/* Camera Icon Button */}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CameraAltIcon />} // Camera Icon here
          >
            Capture Image
            <input
              type="file"
              accept="image/*"
              capture="camera" // Open the camera on mobile devices
              hidden
              onChange={handleCameraCapture}
            />
          </Button>
          {capturedImage && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">Captured Image Preview:</Typography>
              <img src={capturedImage} alt="Captured" width="100%" />
            </Box>
          )}
        </Grid>
        
        {/* Upload Document Button */}
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
          >
            Upload Document
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={handleFileUpload}
            />
          </Button>
          {uploadedFile && (
            <Typography sx={{ mt: 1 }}>{uploadedFile.name}</Typography>
          )}
        </Grid>
        
        {/* Signature Field */}
        <Grid item xs={12}>
          <Typography variant="body1">Digital Signature:</Typography>
          <canvas
            ref={canvasRef}
            width={300}
            height={100}
            style={{ border: "1px solid #000", marginTop: "8px" }}
            onMouseUp={handleSignatureEnd}
          ></canvas>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={handleReset}
          >
            Reset Signature
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default HomePage;
