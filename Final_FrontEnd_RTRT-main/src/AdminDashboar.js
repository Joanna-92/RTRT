import React, {useState, useEffect} from 'react'
import { 
  Button, 
  Grid, 
  Stack, 
  Typography, 
  Tooltip,
  IconButton as MuiIconButton,
} from '@mui/material';
import { styled, ThemeProvider } from "@mui/material/styles";
import newTheme from './themes';
import { PowerSettingsNew as PowerIcon } from '@mui/icons-material';
import { useNavigate} from 'react-router-dom';
import { useAuth } from './services/AuthContext';

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function AdminDashboard() {
  const [switchPage, setSwitchPage] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  useEffect(()=>{
    if(switchPage){
    navigate("/adminreservation");}
  },[switchPage])

    //LogOut
    const logout = (token) => {
      try{
  
          if(token){
            
            localStorage.removeItem('token');
            sessionStorage.clear();
            localStorage.clear();
            navigate("/signIn");
          }
         
      }catch(error){}
    };
  return (
    <>
    <div className="bg" >
      {/* LOg out button */}
      <ThemeProvider theme={newTheme}>
      <Tooltip title="Logout">
              <Button style={{ position: "fixed", top: 50, right: 50,width: "40px", height: "50px", margin: "2px",  fontSize: 16, borderRadius: "20px"}}  
                  variant="contained" 
                  color="primary" 
                  onClick={()=>{logout(token)}}
                  
                  >
                    <IconButton
                  aria-owns={"menu-appbar"}
                  aria-haspopup="true"
                  
                  color="inherit"
                  size="large"
                >
                    <PowerIcon />
                </IconButton>
                
                </Button>
              </Tooltip>
              </ThemeProvider>
      
                    <div style={{       
                          position: 'absolute',
                          top: "25%",
                          left: "50%",
                          width: '20%',
                          height: '55%',}}>
                 
                    <ThemeProvider theme={newTheme}>
                    <Stack direction="column">
                        <Grid container>
                            <Grid item xs>
                            
                            <Typography variant="h3" color={"primary"}>
                                Management
                            </Typography>
                            <br/>
                            <br/>
                            </Grid>
                            <Grid item xs>
                            <Button style={{ width: "250px", height: "35px", margin: "2px",  fontSize: 16, }} onClick={()=> setSwitchPage(true)} variant="contained" color="primary">Make a Reservation</Button>
                            </Grid>
                            <br/>
                            <Grid item xs>
                            <Button style={{ width: "250px", height: "35px", margin: "2px",  fontSize: 16, }} onClick={()=> navigate("/allreservations")} variant="contained" color="primary">View all Reservation</Button>
                            </Grid>
                            <br/>
                           
                        </Grid>
                        </Stack>  
                        </ThemeProvider>
      </div>
    </div>
    </>
    
  )
}

export default AdminDashboard