import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material';
import {  ThemeProvider } from "@mui/material/styles";
import newTheme from './themes';

function HomePage() {
    const navigate = useNavigate();
  return (
    <>
    <div  className="bg">
    <ThemeProvider theme={newTheme}>
        <Button style={{ left:"980px",top:"520px",width: "250px", height: "45px", margin: "2px",  fontSize: 26, }}  
        variant="contained" 
        color="primary" 
        onClick={() => navigate('signin')}>Get Started</Button>
        </ThemeProvider>
    </div>
    </>
  )
}

export default HomePage