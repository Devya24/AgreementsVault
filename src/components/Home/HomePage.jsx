import { useState, useRef } from 'react';
import { Typography, Box, Button, TextField, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PropTypes from 'prop-types';

function HomePage({ currentUser }) {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({ username: '', emailId: '' });
    const [uploadedFile, setUploadedFile] = useState(null);
    const [signature, setSignature] = useState(null);

    const handleSignOut = () => {
        navigate('/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleSignatureEnd = () => {
        const canvas = canvasRef.current;
        setSignature(canvas.toDataURL('image/png'));
    };

    const handleSubmit = () => {
        if (!formData.username || !formData.emailId || !uploadedFile || !signature) {
            alert('All fields are mandatory!');
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('User Details', 10, 20);
        doc.text(`Username: ${formData.username}`, 10, 30);
        doc.text(`Email ID: ${formData.emailId}`, 10, 40);

        if (uploadedFile) {
            doc.text('Uploaded Document:', 10, 50);
            doc.text(uploadedFile.name, 10, 60);
        }

        if (signature) {
            doc.text('Signature:', 10, 70);
            const imgWidth = 50;
            const imgHeight = 20;
            doc.addImage(signature, 'PNG', 10, 80, imgWidth, imgHeight);
        }

        doc.save('user_details.pdf');
    };

    return (
            <Box>
                <Typography variant="h6">Fill the Form</Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
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
                            startIcon={<FileUploadIcon />}
                        >
                            Upload Document
                            <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx,.png,.jpg"
                                onChange={handleFileUpload}
                            />
                        </Button>
                        {uploadedFile && <Typography sx={{ mt: 1 }}>{uploadedFile.name}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">Digital Signature:</Typography>
                        <canvas
                            ref={canvasRef}
                            width={300}
                            height={100}
                            style={{ border: '1px solid #000', marginTop: '8px' }}
                            onMouseUp={handleSignatureEnd}
                        ></canvas>
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
HomePage.propTypes = {
    currentUser: PropTypes.string.isRequired,
};

export default HomePage;
