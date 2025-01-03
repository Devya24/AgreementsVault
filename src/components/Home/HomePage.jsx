import { useState, useRef } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import { jsPDF } from "jspdf";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
function HomePage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ username: "", emailId: "" });
  const [errors, setErrors] = useState({ username: "", emailId: "" });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const validateForm = () => {
    const newErrors = { username: "", emailId: "" };

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

    setErrors(newErrors);
    return !newErrors.username && !newErrors.emailId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDeleteCapturedImage = () => {
    setCapturedImage(null);
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
        setCapturedImage(reader.result);
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if ((!uploadedFile && !capturedImage) || !signature) {
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
          <Button
            variant="outlined"
            component="label"
            startIcon={<CameraAltIcon />}
          >
            Capture Image
            <input
              type="file"
              accept="image/*"
              capture="camera"
              hidden
              onChange={handleCameraCapture}
            />
          </Button>
          {capturedImage && (
            <Box
              sx={{
                mt: 1,
                position: "relative",
                display: "inline-block",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              <img
                src={capturedImage}
                alt="Captured"
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(255, 255, 255, 0.8)",
                }}
                size="small"
                onClick={handleDeleteCapturedImage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" component="label">
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
