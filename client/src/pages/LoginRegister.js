// LoginRegister.js

import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { setToken, axiosInstance } from '../utils/authUtil.js';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  gap: '20px',
});

const LoginRegister = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      });
      const token = response.data.token;
      setToken(token);
      onLogin();
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post('/register', {
        email,
        password,
      });
      const token = response.data.token;
      setToken(token);
      onLogin();
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again');
    }
  };

  return (
    <Root>
      <Typography variant='h4'>Chat Application</Typography>
      <FormContainer>
        <TextField
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant='contained' color='primary' onClick={handleLogin}>
          Login
        </Button>
        <Button variant='contained' color='secondary' onClick={handleRegister}>
          Register
        </Button>
      </FormContainer>
    </Root>
  );
};

export default LoginRegister;
