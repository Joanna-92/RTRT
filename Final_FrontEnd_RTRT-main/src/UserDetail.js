import { DataGrid } from '@mui/x-data-grid';
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Chip as MuiChip,
    Grid,
    MenuItem,
    Select,
    TextField,
    Tooltip,
  IconButton as MuiIconButton,
} from "@mui/material";
import { PowerSettingsNew as PowerIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Feedback from './Feedback';
import FailFeedback from './FailFeedback';
import { useAuth } from './services/AuthContext';
import { useNavigate } from 'react-router-dom';
import React ,{useState, useEffect, useMemo}from 'react';
import { Modal } from '@mui/base';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {  styled, ThemeProvider } from "@mui/material/styles";
import newTheme from './themes';
import dayjs from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import shadows from "@mui/material/styles/shadows";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import EditUser from './EditUser';

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function UserDetail() {

    const [user, setUser] = useState("");
    const [userReservations, setUserReservations] = useState([]);
    const [errorFeedback, setErrorFeedback] = useState(false);
    const [editReservation, setEditReservation] = useState(false);
    const [makeReservation, setMakeReservation] = useState(false);
    const handleReservation = () => setMakeReservation(true);
    const [isAvailableData, setIsAvailableData] = useState(false);
    const [updatingReservation, setUpdatingReservation] = useState([]);
    const [cancelReservaion, setCancelReservation] = useState(false);
    const navigate = useNavigate();

  
    const [resrvationId, setReservationId] = useState();
    const [numberOfPerson, setNumberOfPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [selectedPerson, setSelectedPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [reservationCreated, setReservationCreated]  = useState(false);
    const [userId, setUserId]= useState(null);
    const [editUser, setEditUser]= useState(false);
    //to go to the reservation Page
    useEffect(() => {
      if (makeReservation) {
        navigate("/reservation");
      }
    }, [makeReservation]);
   

    const { token } = useAuth();
    const getUser = async () => {

      try{
          
          fetch("http://localhost:8080/users/myInfo" , {
              method: "GET",
              headers:{  "Authorization" : "Bearer " + token }
          }).then((response) => response.json())
          .then((data) => {
            // Handle the login response
            setUser(data)
            setUserId(data.id)
            
            console.log(data);
          })
      }catch(error){
            // Handle any errors
            console.log(error);
          };
      };
    useEffect(() => { 
      getUser()
      return () => {
        setUser([]); 
      };
    }, [editUser]);

    // Reservation Details

    const getUserReservations = async () => {

      try{
          
          fetch("http://localhost:8080/reservation/findUserReservations" , {
              method: "GET",
              headers:{  "Authorization" : "Bearer " + token }
          }).then((response) => response.json())
          .then((data) => {
                // Handle the login response
                const updatedData = data.map((obj)=>{
                  if(obj.reservationDate){
                  let reservationDate = new Date(obj.reservationDate).toLocaleString('en-US', {
                      day: '2-digit',  
                      month: '2-digit',
                      year: 'numeric',
                    }).replace(/\//g, '-');
                    let startTime = obj.startTime;
                    let formattedStartTime = startTime.map(num => String(num).padStart(2, '0')).join(':');
                    
                    return {...obj, reservationDate: reservationDate, startTime: formattedStartTime};}
                    return {...obj};
                })
                setUserReservations(updatedData)
                if(data.length > 0) 
                setIsAvailableData(true);
                console.dir(data);
            })
      }catch(error){
            // Handle any errors
            console.log("userdetail "+error);
          };
      };
    useEffect(() => { 
      getUserReservations()
      return () => {
        setUserReservations([]); 
      };
    }, [cancelReservaion, reservationCreated]);

 //Edit reservation on click
 const handleClick = (value) =>{
  
  const result = userReservations.find((item)=>{
    if(item.reservationId == value){
      return item;
    }
    
  })
  setUpdatingReservation(result);
};

    const columns = [
      {
        field: 'serialNumber',
        headerName: 'Id',
        width: 50,
        renderCell: (index) =>
        index.api.getRowIndexRelativeToVisibleRows(index.row.reservationId) + 1,
       
      },
  
      {
        field: 'reservationDate',
        headerName: 'Reservation Date',
        width: 250,
        renderCell: (params) => {
          return <>{params.value}</>;
      }
      },
      {
        field: 'startTime',
        headerName: 'Start Time',
        width: 100,
        renderCell: (params) => {
          return <>{ params.value}</>;
      }
      },
      {
        field: 'endTime',
        headerName: 'End Time',
        width: 100,
        renderCell: (params) => {
          return <>{ params.value[0] + ":"  + "00"}</>;
      }
      },
      {
        field: 'numberOfPerson',
        headerName: 'No. of Persons',
        width: 120,
      },
      {
        field: 'comment',
        headerName: 'Comment',
        width: 120,
        value: 8
      },
      {
        field: "Action",
        headerName: "",
        sortable: false,
        renderCell: (params) => {
          var value= `${params.id}`
          setReservationId(value)
          return <Button onClick={()=>{handleClick(value); setEditReservation(true);}}>Edit</Button>;
        }
      },
      {
        field: "ActionDelete",
        headerName: " ",
        sortable: false,
        renderCell: (params) => {
           const onClick= () => {
              try{
                  fetch(`http://localhost:8080/reservation/cancel/${params.id}` , {
                      method: "PUT",
                      headers:{  "Authorization" : "Bearer " + token }
                  }).then((response) => response.json())
                  .then((data) => {
                    setCancelReservation(true)
                        console.dir(data);
                    })
              }catch(error){
                    // Handle any errors
                    console.log(error);
                  }}
          return <Button onClick={onClick}>Cancel</Button>;
        }
      },
    ];
    // Edit reservation section
    const StyledTextField = styled(TextField)`
    textarea {
      width: 235px;
      height: 100px;
      fontSize: '18px'
    }
  `;
 console.log("time is " + updatingReservation.startTime)
  const initialValues = {
    reservationDate:   updatingReservation.reservationDate || "",
    startTime:  updatingReservation.startTime ||  "",
    numberOfPerson: updatingReservation.numberOfPerson || "",
    comment: updatingReservation.comment || "",
    Id: userId || ""
  };
 
    const validationSchema = useMemo(() => Yup.object({
      reservationDate: Yup.date().label("ReservationDate").required("required"),
      startTime: Yup.string().label("StartTime").required("required"),
      numberOfPerson: Yup.number().integer().label("Persons").required("required")
      
    }), []);
    const handleSubmit = (values, actions) => {
    
      postReservation(values.reservationDate, values.startTime, values.numberOfPerson, values.comment, values.Id);
      actions.setSubmitting(false);
      actions.setTouched({}, false);
      actions.setErrors({});
      actions.setFieldError({});
      actions.setFieldTouched({}, false, false);
    };
    const postReservation = (reservationDate, startTime, numberOfPerson, comment) => {
        
        const reservationPayload = {
        reservationDate: reservationDate,
        startTime: startTime,
        numberOfPerson: numberOfPerson,
        appUser: { userId: userId},
        comment: comment
        }
          try{
            console.log("handle submit try block " + startTime )
              
            fetch(`http://localhost:8080/reservation/update/${updatingReservation.reservationId}` , {
                method: "PUT",
                headers:{ "Content-type": "application/json",  
                  "Authorization" : "Bearer "+ token },
                  body: JSON.stringify(reservationPayload)
            }).then((response) => {
              if(!response.ok) {
              //setErrorFeedback(true)
              console.log("")
            } else {
                return response.json();}
            }).then((data) => {
              // Handle the login response
              if(data){
              setReservationCreated(true);
              console.log(data);}
            })
        }catch(error){
          
              // Handle any errors
              console.log(error);
            };
    }
    
    function disabledays(date) {
      let selectedDate = new Date(date)
      let dayofWeek = selectedDate.getDay();
      return dayofWeek === 1;
    }
    const logout = (token) => {
      try{
  
          if(token){
              localStorage.removeItem("accessToken");
              sessionStorage.clear();
              localStorage.clear();
              navigate("/signIn");
          }
      }catch(error){}
    };

   
 return (
  <>             
  <div className='bg'>
      <ThemeProvider theme={newTheme}>

        {/* Log out Button */}
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
        {/* SHOWING USER PROFILE */}
      
              <Card sx={{ maxWidth:350, margin: '10px', padding: '30px'}}>
                <CardContent>
                    <Typography variant="h4" color="text.secondary" gutterBottom>
                        My Profile
                    </Typography>
                    <Typography variant="h6" component="div">
                       First Name: {user?.firstName}
                    </Typography>
                    <Typography variant="h6" component="div">
                       Last Name: {user?.lastName}
                    </Typography>
                    <Typography variant="h6" component="div" >
                       Telephone Number: {user?.telephoneNumber}
                    </Typography>
                    <Typography variant="h6" component="div">
                       Email: {user?.email}
                    </Typography>
                    
                </CardContent>

                {/* EDIT USER PROFILE */}
                <CardActions>
                <Button style={{ width: "150px", height: "45px", margin: "2px",  fontSize: 16, borderRadius: "4px"}}  
                        variant="contained" 
                        color="primary" 
                        onClick={()=>setEditUser(true)}
                        >Edit Profile</Button>
                </CardActions>
             </Card>
            
          <EditUser open={editUser} editUser={user} setEditUser={setEditUser} userId={userId}/>
         
         {/* Showing data table */}
        {isAvailableData ? (<Box  >
      <DataGrid
              sx={{
                '& .MuiTextField-root': { m: 1, width: '72ch' },
                width: 950,
                left: "350px",
                top: "200px",
            }}
                rows={userReservations}
                editMode="row"
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
              }}
              pageSizeOptions={[5]}
              getRowId= {(row) => row.reservationId}
        
      />
</Box>)
: (
  <div sx={{ left:"600px" ,width: '50%', height: "70px", textAlign: "right", float: "left", position: "fixed" }}>
          <Typography variant="h3" color="primary"> NO Reservation is Made :</Typography>
          </div>)}
{/* Make a reservation Button */}

            
                  <Button style={{ position: "fixed", top: 50, right: 160,width: "150px", height: "50px", margin: "2px",  fontSize: 16, borderRadius: "2px"}}  
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleReservation}
                                    >Make a Reservation</Button>
             
             </ThemeProvider>
    {/* Feed backs to show the response */}
    
          <Feedback
          open={reservationCreated}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Reservierung bearbeitet
              </Typography>
            </>
          }
          handleClose={()=> {
            setIsAvailableData(true);
            setReservationCreated(false)
            setEditReservation(false)}
          }
        /> 

        {/* feedback for canceling a reservation */}
        <Feedback
          open={cancelReservaion}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Reservierung storniert
              </Typography>
            </>
          }
          handleClose={()=> {
            setIsAvailableData(false);
            setCancelReservation(false)}}
        />
        <FailFeedback
            open={errorFeedback}
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
              setErrorFeedback(false)
            }}
          />
        {/* EDITING THE EXISTING RESERVATION */}
          <Modal
                open={editReservation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                    >
                <div>
                      <div style={{ 
                        position: 'absolute',
                        top: "25%",
                        left: "50%",
                        width: '20%',
                        height: '65%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent background color rgba(0, 0, 0, 0.5)
                        // zIndex: 9999,
                        justifyContent: 'center',
                        alignItems: 'center',}}
                      >
                    {/* <Box
                      // sx={style}
                    > */}
                  <br/>
                  <ThemeProvider theme={newTheme}>
                  <Typography variant="h4" gutterBottom display="center" >
                    Edit Reservation 
                  </Typography>
                  <Typography variant="h6" gutterBottom display="center" >
                     (*please update/repeat all fields)
                  </Typography>
                  <br/>
                  <br/>
                  <div>
                  { updatingReservation && (
                  <Formik
                    enableReinitialize
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
                      isSubmitting
                    }) => (
                      <Form noValidate >
                      <Grid container spacing={2}>
                            <Grid item xs md={12} spacing={2}>
                                <div>
                                        <Select
                                        labelId="numberOfPerson"
                                        id="numberOfPerson"
                                        label="Persons"
                                        name="numberOfPerson"
                                        defaultValue={values.numberOfPerson}
                                        value={values.numberOfPerson}
                                        onChange={(event)=> setFieldValue("numberOfPerson", event.target.value)}
                                        onBlur={() => setFieldTouched("numberOfPerson", true)}
                                        options={numberOfPerson}
                                        sx={{
                                          color: "black",
                                          background: "#B6B6B4",
                                          width: 265,
                                          height: 40,
                                          display:"relative",
                                          justifyContent:"center",
                                          alignItems:"center",
                                         
                                        
                                        }}
                                        helperText={touched.numberOfPerson && errors.numberOfPerson}
                                        error={errors.numberOfPerson && touched.numberOfPerson}
                                      >
                                        {selectedPerson.map((value, index) => (
                                      <MenuItem size="small" key={index} value={value}>
                                        
                                        {value}
                                      </MenuItem>
                                      ))}
                                      </Select>
                            </div>
                            </Grid>
                              <Grid item xs>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="de"
                                  >
                                    <DatePicker
                                      shouldDisableDate={disabledays}
                                      disablePast
                                      label="Reservation Date"
                                      PaperProps={{ sx: { boxShadow: shadows[3] } }}
                                      defaultValue={updatingReservation.reservationDate}
                                      value={dayjs(values.reservationDate)} 
                                      sx={{width:265}}
                                      onBlur={() => setFieldTouched("reservationDate", true)}
                                      onChange={(newValue) => {
                                        setFieldValue(
                                          "reservationDate",
                                         newValue ? format(newValue.toDate(), "yyyy-MM-dd") : updatingReservation.formattedDate
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <Field
                                          style={{ color: "black", backgroundColor: "#B6B6B4", svg: { color: "black" } }}
                                          component={TextField}
                                          {...params}
                                          required
                                          name="reservationDate"
                                          margin="none"
                                          autoComplete="off"
                                          helperText={touched.reservationDate && errors.reservationDate}
                                          error={errors.reservationDate && touched.reservationDate}
                                          inputProps={{
                                            ...params.inputProps,
                                            placeholder: "TT.MM.JJJJ",
                                          }}
                                        
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                              
                            </div>
                            </Grid>
                            <Grid item xs>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    adapterLocale="de"
                                  >
                                <TimePicker
                                ampm={false}
                                openTo="hours"
                                disableMinute={true}
                                views={['hours']}
                                format="hh:mm"
                                mask="__:__"
                                label="Time Picker"
                                minTime={dayjs().set('hour', 14)}
                                maxTime={dayjs().set('hour', 22)}
                                sx={{width:265}}
                                value={values.startTime}
                                onChange={(time)=> setFieldValue(
                                  "startTime", 
                                  time ? format(new Date(time), "HH:mm") : updatingReservation.startTime
                                  )}
                                inputProps={{ step: 1 }}
                                renderValue={(params) => (
                                  <Field
                                    style={{ color: "black", backgroundColor: "#B6B6B4", svg: { color: "black" } }}
                                    component={TextField}
                                    {...params}
                                    name="startTime"
                                    margin="none"
                                    autoComplete="off"
                                    helperText={touched.startTime && errors.startTime}
                                    error={errors.startTime && touched.startTime}
                                    
                                  />
                                )}
                                />
                                  </LocalizationProvider>
                                
                            </div>
                            </Grid>
                      
                            <Grid item xs>
                              <div>
                                <Field
                                style={{ color: "black", backgroundColor: "#B6B6B4", svg: { color: "black" } }}
                                  component={StyledTextField}
                                  id="comment"
                                  label="comment"
                                  name="comment"
                                  placeholder="Comment"
                                  multiline
                                  variant="outlined"
                                  defaultValue={values.comment}
                                  onChange={(event)=> setFieldValue("comment", event.target.value)}
                                />
                              </div>
                            </Grid>
                    
                          <Grid item xs>
                            <Button style={{ width: "100px", height: "45px", margin: "4px",  fontSize: 16, }}  type="submit" variant="contained" color="primary">Update</Button>
                          </Grid>
                          <Grid item xs>
                            <Button style={{ width: "100px", height: "45px", margin: "4px",  fontSize: 16, }}  onClick={()=> setEditReservation(false)} variant="contained" color="primary">Close</Button>
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
         
         
          <div>
    </div>
   
    </div>
  </>
    
  )
}

export default UserDetail