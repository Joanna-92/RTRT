import React ,{useState, useEffect, useMemo}from 'react'
import { useAuth } from './services/AuthContext';
import { isValidToken } from './services/jwt';
import { useNavigate } from 'react-router-dom';
import {
    Chip as MuiChip,
    Typography,
    Button,
    MenuItem,
    Select,
    TextField
  } from "@mui/material";
  import { TimePicker } from '@mui/x-date-pickers/TimePicker';
  import { styled, ThemeProvider } from "@mui/material/styles";
  import dayjs from 'dayjs';
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { DatePicker } from "@mui/x-date-pickers/DatePicker";
  import shadows from "@mui/material/styles/shadows";
  import { LocalizationProvider } from "@mui/x-date-pickers";
  import { Form, Field, Formik } from "formik";
  import * as Yup from "yup";
  import { format } from "date-fns"
  import Feedback from './Feedback';
  import FailFeedback from './FailFeedback';
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import newTheme from './themes';
  

function AdminReservationPage() {
  
    const navigate = useNavigate();
    const { token } = useAuth();
    const [reservationDate, setReservationDate] = useState("");
    const [ startTime, setStartTime] = useState("");
    const [numberOfPerson, setNumberOfPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [selectedPerson, setSelectedPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [comment, setComment] = useState(" ");
    const [ user, setUser] = useState("");
    const [reservationCreated, setReservationCreated]  = useState(false);
    const [pageChange, setPageChange]= useState(false);
    const [errorFeedback,setErrorFeedback] = useState(false)
    
   
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
              console.log(" I "+error);
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
          width: 235px;
          height: 100px;
          fontSize: '18px'
        }
      `;

      const initialValues = {
        firstName: "",
        lastName: "",
        customerContact:"",
        reservationDate: "",
        startTime: startTime,
        numberOfPerson: numberOfPerson,
        comment: ""
      };
    
      const validationSchema = useMemo(() => Yup.object({
        customerContact: Yup.string().label("Enter a valid email"),
        reservationDate: Yup.date().label("ReservationDate").required("required"),
        startTime: Yup.string().label("StartTime").required("required"),
        numberOfPerson: Yup.number().integer().label("Persons").required("required")
        
      }), []);
      const handleSubmit = (values, actions) => {
        console.log("handle submit ")
        setReservationDate(values.reservationDate);
        setStartTime(values.startTime);
        setNumberOfPerson(values.numberOfPerson);
        setComment(values.comment)
        postReservation(values.reservationDate, values.startTime, 
          values.numberOfPerson, values.comment, values.customerContact, values.firstName, values.lastName);
        actions.setSubmitting(false);
        actions.setTouched({}, false);
        actions.setErrors({});
        actions.setFieldError({});
        actions.setFieldTouched({}, false, false);
      };
      
      const postReservation = (reservationDate, startTime, numberOfPerson, comment, telephoneNumber, firstName, lastName) => {
        setErrorFeedback(false)
        const reservationPayload = {
        reservationDate: reservationDate,
        startTime: startTime,
        numberOfPerson: numberOfPerson,
        comment: comment
        }
        const params = new URLSearchParams();
          params.append('firstName', firstName);
          params.append('lastName', lastName);
          params.append('telephoneNumber', telephoneNumber);


        try{
          console.log("handle submit try block " + reservationPayload  )
            
          fetch(`http://localhost:8080/reservation/admin/add?${params.toString()}` , {
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
            console.log(data);
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
          navigate("/allreservations");
        }
      }, [pageChange]);
    
  return (
    <>

      <div className="bg">
         {/* //back to overview page */}
         <ThemeProvider theme={newTheme}>
      <Button
                size="medium"
                color="secondary"
                sx={{ color: "grey.700" }}
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={()=> navigate("/dashboard")}
            >
                Back to Dashboard
            </Button>
            </ThemeProvider>
            <br></br>
            <br></br>
          <div style={{display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,}}>
          
          <div>
            <Typography variant="h5" gutterBottom display="center" color={"primary"}>
              Make a Reservation
            </Typography>
            <br/>
            <div>
            </div>
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
               <div>
                 <TextField
                    margin="dense"
                    id="firstName"
                    label="First Name"
                    variant="outlined"
                    name={"firstName"}
                    required
                    value={values.firstName}
                    onChange={(event)=> setFieldValue("firstName", event.target.value)}
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                    my={2}
                    sx={{width:265}}
                /> 
                <br></br>
                </div>
                        <TextField
                            margin="dense"
                            id="lastName"
                            label="Last Name"
                            variant="outlined"
                            name={"lastName"}
                            my={2}
                            value={values.lastName}
                            onChange={(event)=> setFieldValue("lastName", event.target.value)}
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            sx={{width:265}}
                        />
                       <br></br>
           
                        <TextField
                            margin="dense"
                            id="customerContact"
                            label="Contact Number"
                            variant="outlined"
                            my={2}
                            name={"customerContact"}
                            value={values.customerContact}
                            onChange={(event)=> setFieldValue("customerContact", event.target.value)}
                            error={touched.customerContact && Boolean(errors.customerContact)}
                            helperText={touched.customerContact && errors.customerContact}
                            sx={{width:265}}
                        />
                     
                     <br></br>
                     <br></br>
                     <div>
                        <Select
                        labelId="numberOfPerson"
                        id="numberOfPerson"
                        label="Persons"
                        name="numberOfPerson"
                        onChange={(event)=> setFieldValue("numberOfPerson", event.target.value)}
                        onBlur={() => setFieldTouched("numberOfPerson", true)}
                        options={numberOfPerson}
                        sx={{
                          width: 265,
                          // height: 50,
                          
                        }}
                        //helperText={touched.numberOfPerson && errors.numberOfPerson}
                        error={errors.numberOfPerson && touched.numberOfPerson}
                      >
                        {selectedPerson.map((value, index) => (
                      <MenuItem size="small" key={index} value={value}>
                        
                        {value}
                      </MenuItem>
                      ))}
                      </Select>
                      </div>
                      <br></br>
                      <div>
                      
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="de"
                        >
                          <DatePicker
                            shouldDisableDate={disabledays}
                            disablePast
                            label="Reservation Date"
                            PaperProps={{ sx: { bomdhadow: shadows[3] } }}
                            value={values.reservationDate}
                            //onBlur={() => setFieldTouched("reservationDate", true)}
                            onChange={(newValue) => {
                              setFieldValue(
                                "reservationDate",
                                format(newValue.toDate(), "yyyy-MM-dd")
                              );
                            }}
                            
                            renderInput={(params) => (
                              <Field
                                component={TextField}
                                {...params}
                                required
                                name="reservationDate"
                                margin="none"
                                autoComplete="off"
                                
                                //helperText={touched.reservationDate && errors.reservationDate}
                                error={errors.reservationDate && touched.reservationDate}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: "TT.MM.JJJJ",
                                }}
                                
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <br></br>
                      </div>
                        <br></br>
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
                      mask="__"
                      label="Time Picker"
                      minTime={dayjs().set('hour', 14)}
                      maxTime={dayjs().set('hour', 22)}
                      value={values.startTime}
                      onChange={(time)=> setFieldValue(
                        "startTime", 
                        format(new Date(time), "HH:mm"))
                      }
                      inputProps={{ step: 1 }}
                      renderValue={(params) => (
                        <Field
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
                        <br></br>
                        </div>
                        <br></br>
                      <Field
                        component={StyledTextField}
                        id="comment"
                        label="comment"
                        name="comment"
                        placeholder="Comment"
                        multiline
                        variant="outlined"
                        onChange={(event)=> setFieldValue("comment", event.target.value)}
                      />
                     <br></br> <br></br>
                     <ThemeProvider theme={newTheme}>
                     <Button style={{ width: "230px", height: "55px", margin: "4px",  fontSize: 16, }}  type="submit" variant="contained" color="primary">Confirm Reservation</Button>
                     </ThemeProvider>
                
                  
                </Form>
              )}
            </Formik>
            </div>
          </div>
          
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
        
        </div>
    </>
  )
}

export default AdminReservationPage