import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Registeration from './Registeration';
import { Button , Grid, Stack, Typography, TextField} from '@mui/material';
import Box from '@mui/material/Box';
import { useAuth } from './services/AuthContext';
import {  setSession } from './services/jwt';
import FailFeedback from './FailFeedback';
import {  ThemeProvider } from "@mui/material/styles";
import newTheme from './themes';


function SignIn() {
    const navigate = useNavigate();
    const { authenticate } = useAuth();
    const [email,setemail] = useState('');
    const[password,setpassword] = useState('');
    const[ registerationForm, setRegisterationForm] = useState(true);
    const [loginError, setLoginError] = useState(false);
    
    
    const handleChange = (event) => {
        const newValue = event.target.value;
        setemail(newValue);
        }

    const handleSubmit =  (e) => {
        e.preventDefault();
        try{
        const user = { email, password}
        
        fetch("http://localhost:8080/users/signin" , {
            method: "POST",
            headers:{ "Content-type": "application/json"},
            body: JSON.stringify(user)
        }).then(response => {response.json().then( data =>{
            if(response.status === 200){
                // Handle the login response
              authenticate(data?.token, data?.token);
              setSession(data?.token, data?.token);
              localStorage.setItem('token', data.token);
              navigate("/dashboard");
            }
            else{
                setLoginError(true);
            }
        })
    });
        
    }catch(error){
          // Handle any errors
          console.log("erro in sigin " + error);
          setLoginError(true)
        };
    };

    return (
        <> {registerationForm ? 
            (
            <div className="bg" >
              <ThemeProvider theme={newTheme}>
                <form noValidate onSubmit={handleSubmit}>
                 <div style={{position: "relative",top: "350px", left:"800px"}}>
                    <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '32ch' },
                        width: 300,
                        height: 300,
                        display:"relative",
                        justifyContent:"center",
                        alignItems:"center",
                        top: "200px",
                    }}
                    
                    >
                    <Stack direction="column">
                        <Grid container>
                           
                            <Grid container md={12} spacing={2}>
                                <Grid item xs>
                                    <TextField
                                        margin="dense"
                                        id="email"
                                        label="email"
                                        name="email"
                                        variant="filled"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        my={2}
                                        sx={{
                                            input: {
                                              color: "black",
                                              background: "#B6B6B4"
                                            }
                                          }}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        type={"password"}
                                        margin="dense"
                                        id="password"
                                        label="password"
                                        value={password}
                                        onChange={(e)=> setpassword(e.target.value)}
                                        variant="filled"
                                        required
                                        fullWidth
                                        my={2}
                                        name="password"
                                        sx={{
                                            input: {
                                              color: "black",
                                              background: "#B6B6B4"
                                            }
                                          }}
                                    />
                                </Grid>
                                <Grid item xs>
                            <Button style={{ width: "150px", height: "35px", margin: "2px",  fontSize: 16, }}  type="submit" variant="contained" color="primary">Sign In</Button>
                            </Grid>
                            </Grid>
                        </Grid>
                        </Stack>  
                        </Box>
                            </div>
                 </form>
                                
                        <br/>
                            
                            <Button style={{ left:"980px",top:"420px",width: "250px", height: "45px", margin: "2px",  fontSize: 16, }}  
                        variant="contained" 
                        color="primary" 
                        onClick={() => setRegisterationForm(false)}>Sign Up</Button>
                        </ThemeProvider>
                            </div>
                            )
            : <Registeration setRegisterationForm={setRegisterationForm}/>}
            
            {/* FAILURE FEEDBACK */}
            <FailFeedback
            open={loginError}
            title={"Failure"}
            severity="warning"
            message={
              <>
                <Typography align="center">
                  Server Failure or Bad Request.
                </Typography>
              </>
            }
            handleClose={() => {
              setLoginError(false)
            }}
          />
            
        </>
    
    )
}

export default SignIn