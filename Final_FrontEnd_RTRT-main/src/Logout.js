import React,{ useState } from "react";
import styled from "styled-components/macro";
import {
  Tooltip,
  IconButton as MuiIconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuth } from "./services/AuthContext";
import { PowerSettingsNew as PowerIcon } from '@mui/icons-material';
import { isValidToken } from './services/jwt';
import { useNavigate } from 'react-router-dom';
import SignIn from "./SignIn";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;


function Logout({token}) {
    const [loggingOut, setLoggingOut] = useState(true);
    const [anchorMenu, setAnchorMenu] = useState(null);
    // const { token } = useAuth();
    const navigate = useNavigate();

    const logout = (token) => {
      try{
  
          if(token){
              setLoggingOut(true);
              localStorage.removeItem("accessToken");
              sessionStorage.clear();
              localStorage.clear();
              navigate("/signIn");
          }
          else
              setLoggingOut(false);
      }catch(error){}
    };
    
  return (
    <>
    {/* LOg out button */}
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
    </>
  )
}

export default Logout