import React ,{useState, useEffect, useMemo}from 'react'
import { useAuth } from './services/AuthContext';
import { isValidToken } from './services/jwt';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    Typography,
    Grid,
    Button,
    MenuItem,
    Select,
    TextField,
    InputLabel 
  } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {  styled, ThemeProvider } from "@mui/material/styles";
import newTheme from './themes';
import dayjs from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import shadows from "@mui/material/styles/shadows";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Box} from "@mui/system";
import { Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns"
import Feedback from './Feedback';
import FailFeedback from './FailFeedback';

function ReservationPage() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [numberOfPerson, setNumberOfPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [selectedPerson, setSelectedPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [ user, setUser] = useState("");
    const [reservationCreated, setReservationCreated]  = useState(false);
    const [pageChange, setPageChange]= useState(false);
    const [errorFeedback,setErrorFeedback] = useState(false)
    const [selectedValue, setSelectedValue] = useState('');
   
    const getUser = async () => {

        try{
            
            fetch("http://localhost:8080/users/myInfo" , {
                method: "GET",
                headers:{  "Authorization" : "Bearer "+token }
            }).then((response) => response.json())
            .then((data) => {
              // Handle the login response
              setUser(data)
              
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
      }, []);
     
      const StyledTextField = styled(TextField)`
        textarea {
          resize: both;
        }
      `;

      const initialValues = {
        reservationDate: "",
        startTime: "",
        numberOfPerson: "",
        comment: ""
      };
    
      const validationSchema = useMemo(() => Yup.object({
        reservationDate: Yup.date().label("ReservationDate").required("required"),
        startTime: Yup.string().label("StartTime").required("required"),
        numberOfPerson: Yup.number().integer().label("Persons").required("required")
        
      }), []);
      const handleSubmit = (values, actions) => {
        postReservation(values.reservationDate, values.startTime, values.numberOfPerson, values.comment);
        actions.setSubmitting(false);
        actions.setTouched({}, false);
        actions.setErrors({});
        actions.setFieldError({});
        actions.setFieldTouched({}, false, false);
      };
      
      const postReservation = (reservationDate, startTime, numberOfPerson, comment) => {
        setErrorFeedback(false)
        const reservationPayload = {
        reservationDate: reservationDate,
        startTime: startTime,
        numberOfPerson: numberOfPerson,
        appUser: { userId: user.id},
        comment: comment
        }
        try{
            
          fetch("http://localhost:8080/reservation/add" , {
              method: "POST",
              headers:{ "Content-type": "application/json",  
                "Authorization" : "Bearer "+ token },
                body: JSON.stringify(reservationPayload)
          }).then((response) => {
            if(!response.ok) 
            setErrorFeedback(true)
            else {
              return response.json();}
          }).then((data) => {
            // Handle the login response
            if(data)
            setReservationCreated(true);
          })
      }catch(error){
        setErrorFeedback(true)
            // Handle any errors
            console.log(error);
          };
      }
      function disabledays(date) {
        let selectedDate = new Date(date)
        let dayofWeek = selectedDate.getDay();
        return dayofWeek === 1;
      }

      useEffect(() => {
        if (pageChange && isValidToken) {
          navigate("/userdetail");
        }
      }, [pageChange]);
    
  return (
    <>

      <div className="bg">
        <ThemeProvider theme={newTheme}>
              <br></br>
              <br></br>

              {/* BACK BUTTON */}
              <Button
                size="medium"
                color="inherit"
                sx={{ color: "grey.700" }}
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={()=> navigate("/userdetail")}
              >
                Back to Dashboard
              </Button>
              <br></br>
              <br></br>
          <div className="divPosition">
          <Box
     
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        width: 350,
        height: 400,
        display:"relative",
        justifyContent:"center",
        alignItems:"center",
        left:"550px"
      }}
      
    >
            <br/>
            <Typography variant="h4" gutterBottom display="inline" >
              Reserve Your Table
            </Typography>
            <br/>
            <br/>
            <div>
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
                isSubmitting
              }) => (
                <Form noValidate >
                 <Grid container spacing={2}>
                      <Grid item xs md={12} spacing={2}>
                          <div>
                          <InputLabel id="numberOfPerson">Select No. of Persons</InputLabel>
                                  <Select
                                  labelId="numberOfPerson"
                                  id="numberOfPerson"
                                  label="Persons"
                                  name="numberOfPerson"
                                  value={selectedValue}
                                  onChange={(event)=> setFieldValue("numberOfPerson", event.target.value)}
                                  onBlur={() => setFieldTouched("numberOfPerson", true)}
                                  options={numberOfPerson}
                                  sx={{
                                    color: "black",
                                    background: "#B6B6B4",
                                    width: 230,
                                    height: 40,
                                    display:"relative",
                                    justifyContent:"center",
                                    alignItems:"center",
                                  
                                  }}
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
                                value={values.reservationDate}
                                onChange={(newValue) => {
                                  setFieldValue(
                                    "reservationDate",
                                    format(newValue.toDate(), "yyyy-MM-dd")
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
                          //inputFormat="HH:MM"
                          format="hh:mm"
                          mask="__:__"
                          label="Time Picker"
                          minTime={dayjs().set('hour', 14) }
                          maxTime={dayjs().set('hour', 22)}
                          value={values.startTime}
                          onChange={(time)=> setFieldValue(
                            "startTime", 
                            format(new Date(time), "HH:mm"))
                          }
                          inputProps={{ step: 1 }}
                          renderValue={(params) => (
                            <Field
                              style={{ color: "black", backgroundColor: "#B6B6B4",svg: { color: "black"  } }}
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
                            style={{ color: "black", backgroundColor: "#B6B6B4" }}
                            component={StyledTextField}
                            id="comment"
                            label="comment"
                            name="comment"
                            placeholder="Comment"
                            multiline
                            variant="outlined"
                            onChange={(event)=> setFieldValue("comment", event.target.value)}
                          />
                        </div>
                      </Grid>
              
                    <Grid item xs>
                      <Button style={{ width: "230px", height: "55px", margin: "4px",  fontSize: 16, }}  type="submit" variant="contained" color="primary">Confirm Reservation</Button>
                    </Grid>
                   
                  </Grid>
                </Form>
              )}
            </Formik>
            </div>
            </Box>
          </div>
          

          {/* FEED BACK of Success */}
        <Feedback
          open={reservationCreated}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Reserviert
              </Typography>
            </>
          }
          handleClose={()=> {
            setReservationCreated(false)
            setPageChange(true)}}
        />

              {/* FEED BACK of Failure */}
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
        </ThemeProvider>
        </div>
    </>
  )
}

export default ReservationPage