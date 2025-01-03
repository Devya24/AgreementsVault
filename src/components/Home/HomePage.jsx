import { useState, useRef, useEffect } from "react";
import { Typography, Box, Button, TextField, Grid } from "@mui/material";
import { jsPDF } from "jspdf";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Import Camera Icon

function HomePage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ username: "", emailId: "" });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set up canvas properties
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const getTouchPosition = (e) => {
    const touch = e.touches[0] || e.changedTouches[0];
    return { x: touch.pageX - canvasRef.current.offsetLeft, y: touch.pageY - canvasRef.current.offsetTop };
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = e.nativeEvent ? e.nativeEvent : getTouchPosition(e);
    setLastPosition({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const { x, y } = e.nativeEvent ? e.nativeEvent : getTouchPosition(e);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
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
      !uploadedFile ||
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
        <Grid item xs={12}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CameraAltIcon />} // Using Camera Icon here
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
        <Grid item xs={12}>
          <Typography variant="body1">Digital Signature:</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <canvas
                ref={canvasRef}
                width={300}
                height={100}
                style={{ border: "1px solid #000", marginTop: "8px" }}
                onTouchStart={handleMouseDown} // Added touch support
                onTouchMove={handleMouseMove} // Added touch support
                onTouchEnd={handleMouseUp} // Added touch support
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              ></canvas>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Reset Signature
              </Button>
            </Grid>
          </Grid>
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
