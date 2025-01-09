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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if ((!uploadedFile && capturedImages.length === 0) || !signature) {
      alert("All fields are mandatory!");
      return;
    }
  };
  // useEffect(() => {
  //   fetch("/.netlify/functions/send-mail")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.message); // "Email sent successfully!"
  //     })
  //     .catch((error) => console.error("Error:", error));
  // }, []);
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
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}

export default HomePage;
