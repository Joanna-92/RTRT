import React ,{useState, useEffect, useMemo}from 'react';
import PropTypes from "prop-types";
import { useAuth } from './services/AuthContext';
import { hashPassword } from './services/hash-password';
import { isValidToken } from './services/jwt';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/base';
import {
    Chip as MuiChip,
    Typography,
    Stack,
    Grid,
    Button,
    MenuItem,
    OutlinedInput,
    Select,
    ListItemText,
    TextField
  } from "@mui/material";
  import { TimePicker } from '@mui/x-date-pickers/TimePicker';
  import { styled } from "@mui/material/styles";
  import TextareaAutosize from '@mui/base/TextareaAutosize';
  import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
  import dayjs from 'dayjs';
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
  import { DatePicker } from "@mui/x-date-pickers/DatePicker";
  import shadows from "@mui/material/styles/shadows";
  import { LocalizationProvider } from "@mui/x-date-pickers";
  import { useTranslation } from "react-i18next";
  import { Box} from "@mui/system";
  import { Form, Field, Formik } from "formik";
  import * as Yup from "yup";
  import { format } from "date-fns"
  import Feedback from './Feedback';
  import FailFeedback from './FailFeedback';
  import { moment } from 'moment';

function EditReservation({editReservation, userReservations, userId , reservationId, setEditReservation}) {
  const navigate = useNavigate();
    const { token } = useAuth();
    const [reservationDate, setReservationDate] = useState();
    const [ startTime, setStartTime] = useState();
    const [numberOfPerson, setNumberOfPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [selectedPerson, setSelectedPerson] = useState([1,2,3,4,5,6,7,8,9,10]);
    const [comment, setComment] = useState(" ");
    const [reservationCreated, setReservationCreated]  = useState(false);
    const handleClose = () => setEditReservation(false);
    const [updatedReservation, setUpdatedReservation] = useState();
    let dateTimeValueCopy = {};
   
    
    // const replaceCommasWithDashes = () => {
    //   const modifiedValue = reservationDate.split(',').join('-');
    //   const modifiedValueAsString = modifiedValue.toString();
     
    // };
        useEffect(() => {
           if( userReservations){
            const result = userReservations.find((item)=>{
              if(item.reservationId == reservationId)
                return item;
              })
              if(result !== undefined) {
                var dateValue = (result.reservationDate).toString() ?? "";
                dateTimeValueCopy.reservationDate = dateValue.split(',').join('/');
                var timeValue = (result.startTime).toString() ?? "";
                dateTimeValueCopy.startTime = timeValue.split(',').join(':');
              }
              setUpdatedReservation(dateTimeValueCopy);
            }
        }, [updatedReservation]); 
   
    
    
    const style = {
      position: 'fixed',
       top: '30%',
       left: '40%',
      //transform: 'translate(-100%, -200%)',
      width: 400,
      height:400,
      bgcolor: 'white',
      border: '2px solid #000',
      boxShadow: 24,
      p: 8,
    };
    
    const StyledTextField = styled(TextField)`
    textarea {
      width: 235px;
      height: 100px;
      fontSize: '18px'
    }
  `;
  
  // console.log(" values Edit button " + dateTimeValue.reservationDate+ " +dateTimeValue.reservationDate+ " +dateTimeValue.startTime+ " + dateTimeValue.startTime")
    const initialValues = {
      reservationDate:   "",
      startTime:   "",
      numberOfPerson: updatedReservation.numberOfPerson || "",
      comment: updatedReservation.comment || ""
    };
  
    const validationSchema = useMemo(() => Yup.object({
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
      postReservation(values.reservationDate, values.startTime, values.numberOfPerson, values.comment);
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
            console.log("handle submit try block " + reservationPayload  )
              
            fetch("http://localhost:8080/reservation/updata/`id`" , {
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
              if(data)
              setReservationCreated(true);
              console.log(data);
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


  return (
    <>
     <Modal
        open={editReservation}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <div>
                      <div style={{ position: 'absolute',
                    top: "25%",
                    left: "50%",
                    width: '30%',
                    height: '50%',
                    backgroundColor: 'white', // semi-transparent background color rgba(0, 0, 0, 0.5)
                    // zIndex: 9999,
                    justifyContent: 'center',
                    alignItems: 'center',}}
                                  >
              {/* <Box
                // sx={style}
              > */}
                  <br/>
                  <Typography variant="h5" gutterBottom display="center" >
                    Edit Reservation
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
                                          width: 265,
                                          height: 40,
                                          justifyContent:"center",
                                          alignItems:"center",
                                        
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
                                      defaultValue={values.reservationDate}
                                      value={values.reservationDate}
                                      sx={{width:265}}
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
                                // openTo="hours"
                                // views={['hours']}
                                //inputFormat="HH:MM"
                                format="hh:mm"
                                mask="__:__"
                                label="Time Picker"
                                minTime={dayjs().set('hour', 14)}
                                maxTime={dayjs().set('hour', 22)}
                                sx={{width:265}}
                                value={values.startTime}
                                onChange={(time)=> setFieldValue(
                                  "startTime", 
                                  format(new Date(time), "HH:mm"))
                                }
                                // renderValue={(props)=> <TextField{...props}/>}
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
                                
                            </div>
                            </Grid>
                      
                            <Grid item xs>
                              <div>
                                <Field
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
                            <Button style={{ width: "100px", height: "45px", margin: "4px",  fontSize: 16, }}  onClick={handleClose} variant="contained" color="primary">Close</Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                  </div>
                  {/* </Box> */}
                </div>
                </div>
      </Modal>
    </>
  )
}
EditReservation.propTypes = {
    open: PropTypes.bool.isRequired,
    // userReservation: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     start: PropTypes.string.isRequired,
    //     end: PropTypes.number.isRequired
    //   }).isRequired
    // ).isRequired,
    userId:PropTypes.number.isRequired,
  };

export default EditReservation
