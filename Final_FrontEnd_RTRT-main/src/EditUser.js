import React ,{useState, useMemo}from 'react';

import {
    Typography,
    Button,
    Chip as MuiChip,
    Grid,
    TextField,
  } from "@mui/material";
  import Feedback from './Feedback';
  import { useAuth } from './services/AuthContext';
  import { Modal } from '@mui/base';
  import { Form, Field, Formik } from "formik";
  import * as Yup from "yup";
  import newTheme from './themes';
  import { ThemeProvider } from "@mui/material/styles";

function EditUser({open, editUser, setEditUser, userId}) {
  const { token } = useAuth();
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [userUpdated, setUserUpdated] = useState(false)
  const [appUserRoles, setAppUserRoles] = useState("APP_CLIENT")

    const initialValues = {
        userId:   userId || "",
        firstName:  editUser.firstName||  "",
        lastName: editUser.lastName || "",
        telephoneNumber: editUser.telephoneNumber || "",
        birthDate: editUser.birthDate || "",
        appUserRoles: "ROLE_CLIENT",
      };
     
        const validationSchema = useMemo(() => Yup.object({
          firstName: Yup.string().label("FirstName").required("required"),
          lastName: Yup.string().label("LastName").required("required"),
          telephoneNumber: Yup.string().label("TelephoneNumber").required("required"),
          
        }), []);
        const handleSubmit = (values, actions) => {
          console.log("handle submit ")
          setFirstName(values.firstName);
          setLastName(values.lastName);
          setBirthDate(values.birthDate);
          setAppUserRoles(values.appUserRoles)
          updateUser(values.userId, values.firstName, values.lastName, values.birthDate, values.appUserRoles, values.telephoneNumber);
          actions.setSubmitting(false);
          actions.setTouched({}, false);
          actions.setErrors({});
          actions.setFieldError({});
          actions.setFieldTouched({}, false, false);
        };
        const updateUser = (userId, firstName, lastName, birthDate, appUserRoles, telephoneNumber)=> {
            
            const updateUserPayload = {
            id: userId,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            appUserRoles: appUserRoles,
            telephoneNumber: telephoneNumber
            }
              try{
                console.log("handle submit try block " + userId + " " + firstName+ " " + lastName+ " " +birthDate+ " " + appUserRoles )
                  
                fetch(`http://localhost:8080/users/update/${userId}` , {
                    method: "PUT",
                    headers:{ "Content-type": "application/json",  
                      "Authorization" : "Bearer "+ token },
                      body: JSON.stringify(updateUserPayload)
                }).then((response) => {
                  if(!response.ok) {
                  //setErrorFeedback(true)
                  console.log("")
                } else {
                    return response.json();}
                }).then((data) => {
                  // Handle the login response
                  if(data){
                  setUserUpdated(true);
                  console.log(data);}
                })
            }catch(error){
              
                  // Handle any errors
                  console.log(error);
                };
        }
  return (
    <>
     <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                    >
                <div>
                      <div style={{ position: 'absolute',
                    top: "25%",
                    left: "50%",
                    width: '20%',
                    height: '55%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent background color rgba(0, 0, 0, 0.5)
                    // zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',}}
                                  >
                    
                  <br/>
                  <ThemeProvider theme={newTheme}>
                  <Typography variant="h5" gutterBottom display="center" >
                    Edit Personal Information
                  </Typography>
                  <br/>
                  <br/>
                  <div>
                  { editUser && (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    validateOnMount={true}
                    onSubmit={handleSubmit}
                  >
                    {({
                      errors,
                      touched,
                      setFieldTouched,
                      values,
                      setFieldValue,
                      isSubmitting,
                      handleChange
                    }) => (
                      <Form noValidate >
                      <Grid container spacing={2}>
                            <Grid item xs md={12} spacing={2}>
                                <div>
                                <TextField
                                    style={{ color: "black", backgroundColor: "#B6B6B4" }}
                                    margin="dense"
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    variant="outlined"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    required
                                    fullWidth
                                    my={2}
                                />
                            </div>
                            </Grid>
                            <Grid item xs md={12} spacing={2}>
                                <div>
                                <TextField
                                    style={{ color: "black", backgroundColor: "#B6B6B4" }}
                                    margin="dense"
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    variant="outlined"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    error={touched.lastName && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    required
                                    fullWidth
                                    my={2}
                                />
                            </div>
                            </Grid>
                            <Grid item xs md={12} spacing={2}>
                                <TextField
                                style={{ color: "black", backgroundColor: "#B6B6B4" }}
                                    margin="dense"
                                    id="telephoneNumber"
                                    label="Telephone Number"
                                    name="telephoneNumber"
                                    variant="filled"
                                    value={values.telephoneNumber}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    my={2}
                                />
                            </Grid>
                          <Grid item xs>
                            <Button style={{ width: "100px", height: "45px", margin: "4px",  fontSize: 16, }}  type="submit" variant="contained" color="primary">Update</Button>
                          </Grid>
                          <Grid item xs>
                            <Button style={{ width: "100px", height: "45px", margin: "4px",  fontSize: 16, }}  onClick={()=>setEditUser(false)} variant="contained" color="primary">Close</Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik> )}
                  </div>
                  </ThemeProvider>
                </div>
                </div>
              </Modal>
              {/* Feed backs to show the response */}
    
          <Feedback
          open={userUpdated}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Your Profile has been updated.
              </Typography>
            </>
          }
          handleClose={()=> {
            setUserUpdated(false);
            setEditUser(false)
          }
          }
        /> 
    </>
  )
}

export default EditUser