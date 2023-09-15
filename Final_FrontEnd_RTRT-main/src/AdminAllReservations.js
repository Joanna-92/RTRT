import React , { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Typography,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton as MuiIconButton,
} from "@mui/material";
import { styled, useTheme, ThemeProvider } from "@mui/material/styles";
import { useMediaQuery } from '@mui/material';
import { PowerSettingsNew as PowerIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import Feedback from './Feedback';
import FailFeedback from './FailFeedback';
import { useAuth } from './services/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import newTheme from './themes';
import {  setSession } from './services/jwt';

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function AdminAllReservations() {

    const [user, setUser] = useState("");
    const [allReservations, setAllReservations] = useState([]);
    const [reservationData, setReservationData] = useState(false);
    const [errorFeedback, setErrorFeedback] = useState(false);
    const [makeReservation, setMakeReservation] = useState(false);
    const handleReservation = () => setMakeReservation(true);
    const [isAvailableData, setIsAvailableData] = useState(false);
    const [updatingReservation, setUpdatingReservation] = useState([]);
    const [cancelReservaion, setCancelReservation] = useState(false);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loggingOut, setLoggingOut] = useState(false);

    const { token } = useAuth();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    //LogOut
    const logout = (token) => {
      try{

          if(token){
            setLoggingOut(true);
            localStorage.removeItem('token');
            sessionStorage.clear();
            localStorage.clear();
            navigate("/signIn");
          }
          else
              setLoggingOut(false);
      }catch(error){}
    };
    
    //to go to the reservation Page
    useEffect(() => {
      if (makeReservation) {
        navigate("/adminreservation");
      }
    }, [makeReservation]);
    
  

    // Reservation Details
    const getallReservations = async () => {

      try{
          
          fetch("http://localhost:8080/reservation/findAllActiveReservation" , {
              method: "GET",
              headers:{  "Authorization" : "Bearer " + token }
          }).then((response) => response.json())
          .then((data) => {
                // Handle the login response
                setAllReservations(data)
                setUpdatingReservation(data)
                setFilteredData(data);
                if(data.length > 0) 
                setIsAvailableData(true);
                console.dir(data);
            })
      }catch(error){
            // Handle any errors
            console.log(error);
          };
      };
    useEffect(() => { 
      getallReservations()
      return () => {
        setAllReservations([]); 
      };
    }, [cancelReservaion, searchQuery]);
    
   
    const renderSerialNumber = (index) => {
      const rowId = Number(index.row.reservationId); // Convert ID to a number
      const rowIndex = index.api.getRowIndexRelativeToVisibleRows(rowId);
      const serialNumber = rowIndex + 1;
  
      return <span>{serialNumber}</span>;
    };
    const columns = [
      {
        field: 'serialNumber',
        headerName: 'Id',
        width: 50,
        renderCell: renderSerialNumber,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
       
      }, 
      {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
          `${params.row.appUser.firstName || ''} ${params.row.appUser.lastName || ''}`,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
      },
  
      {
        field: 'reservationDate',
        headerName: 'Reservation Date',
        width: 200,
        renderCell: (params) => {
          return <>{params.value[2] + "-" + params.value[1] + "-" + params.value[0]}</>;
      },
       headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
      },
      {
        field: 'startTime',
        headerName: 'Start Time',
        width: 80,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
        renderCell: (params) => {
          return <>{ params.value[0] + ":" + params.value[1]+ "0"}</>;
      }
      },
      {
        field: 'endTime',
        headerName: 'End Time',
        width: 80,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
        renderCell: (params) => {
          return <>{ params.value[0] + ":" + params.value[1]+ "0"}</>;
      }
      },
      {
        field: 'numberOfPerson',
        headerName: 'No. of Persons',
        width: 120,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
      },
      {
        field: 'comment',
        headerName: 'Comment',
        width: 120,
        value: 8,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
      }, {
        field: 'status',
        headerName: 'Status',
        width: 120,
        value: 8,
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
        renderCell: (params) => {
           return <>{params.value === 1 ? 'Cancelled' : 'Confirmed'}</>;
        }
      },
      {
        field: "ActionDelete",
        headerName: " ",
        headerClassName: 'custom-header',
        headerAlign: 'center',
        align: 'center', 
        sortable: false,
        renderCell: (params) => {
           const onClick= () => {try{
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
    // const styles = {
    //   customHeader: {
    //     fontWeight: 'bold',
    //     color: 'black',
    //   },
    // };
    
    const handleSearch = () => {
      const filteredRows = allReservations.filter((row) => {
        return row.appUser.email.toLowerCase().includes(searchQuery.toLowerCase());
      });
  
      setFilteredData(filteredRows);
    };
 return (
    <> 
    <div className='bg'>

              {/* SEARCH FIELD */}
              <TextField
                  label="Search By Email"
                  placeholder='Customer Email'
                  type="text"
                  value={searchQuery}
                  style={{ position: "fixed", top: 50, right: 160,width: "200px", height: "50px", margin: "2px",  fontSize: 16, borderRadius: "2px"}}
                  onChange={(e) => setSearchQuery(e.target.value)}InputProps={{
                    startAdornment: (
                      <InputAdornment position="end" onClick={handleSearch} className="search-icon">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
            
     {/* //back to overview page */}
     
              <Button
                size="medium"
                color="inherit"
                sx={{ color: "grey.700" }}
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={()=> navigate("/dashboard")}
             >
                Back to Dashboard
            </Button>
            <br></br>
            <br></br>

         {/* Showing data table */}
        {isAvailableData ? (
          
        <div >
          <br/>
     
          <div sx={{ left:"100px" ,textAlign: "right", float: "right", position: "fixed" }}>
            <ThemeProvider theme={newTheme}>
                <Typography variant="h3" > ALL RESERVATIONS </Typography>
                </ThemeProvider>
              </div>
            <br/>
            <br/>
      
            <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '100vh',
                }}
              >     
    <ThemeProvider theme={newTheme}>
      <DataGrid
      sx={{
        // '& .MuiTextField-root': { m: 1, width: '82ch' },
        // width: 1050,
         left: "250px",
         right: "50px",
        // top: "120px",
        width: isSmallScreen ? "90%" : '800px',
        height: '600px',
    }}
        rows={filteredData}
        editMode="row"
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        autoPageSize
        // pageSizeOptions={[5]}
        getRowId= {(row) => row.reservationId}
        //classes={styles}
        
      />
     </ThemeProvider>
          {/* </div> */}
        </div>
      
     </div>)
: (
  <div style={{ left:"300px" ,width: '50%', height: "70px", textAlign: "right", float: "left" }}>
          <Typography variant="h3" color="primary"> NO Reservations Are Made</Typography>
          </div>)}
     

    {/* Feed backs to show the response */}
          <Feedback
          open={reservationData}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Reserviert
              </Typography>
            </>
          }
          handleClose={()=> {
            setReservationData(false)}}
        />

        {/* feedback for canceling a reservation */}
        <Feedback
          open={cancelReservaion}
          title={"Successful"}
          message={
            <>
              <Typography align="center">
              Canceled
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
              </div>
          
  </>
    
  )
}

export default AdminAllReservations