import { useState, useRef } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import { jsPDF } from "jspdf";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";

function HomePage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ username: "", emailId: "" });
  const [errors, setErrors] = useState({ username: "", emailId: "" });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if ((!uploadedFile && capturedImages.length === 0) || !signature) {
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
    }

    capturedImages.forEach((image, index) => {
      doc.text(`Captured Image ${index + 1}:`, 10, 50 + index * 10);
      doc.text("Image uploaded from camera", 10, 60 + index * 10);
      const imgWidth = 50;
      const imgHeight = 20;
      doc.addImage(image, "PNG", 10, 70 + index * 20, imgWidth, imgHeight);
    });

    if (signature) {
      doc.text("Signature:", 10, 80 + capturedImages.length * 20);
      const imgWidth = 50;
      const imgHeight = 20;
      doc.addImage(
        signature,
        "PNG",
        10,
        90 + capturedImages.length * 20,
        imgWidth,
        imgHeight
      );
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

        <Grid item xs={6}>
          {capturedImages.length > 0 && (
            <Typography variant="body1">Captured Images:</Typography>
          )}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {capturedImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  display: "inline-block",
                  width: "100px",
                  height: "100px",
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
          <Button
            variant="outlined"
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleReset}
          >
            Reset Signature
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 4, backgroundColor: "#143232" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default HomePage;
