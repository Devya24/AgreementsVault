import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ username: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    let hasError = false;
    const newErrors = { username: '', password: '' };

    if (!username) {
      newErrors.username = 'Username is required';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return; // Do not proceed if there are validation errors

    onLogin(username, password); // Call the onLogin function passed from App.js
    navigate('/home'); // Redirect to the home page
  };

  return (
    <Container
      component="main"
      maxWidth="xs" // Ensures the container is small enough for mobile views
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#143232',
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          width: '100%', // Makes the Box responsive
          maxWidth: 400, // Set a max-width to prevent it from getting too wide
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#143232' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Devya Vault
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password}
          />
          {errors.general && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.general}
            </Alert>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 ,backgroundColor:"#143232"}}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

// Prop validation
LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginPage;
