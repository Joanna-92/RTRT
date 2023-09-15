import { createTheme } from "@mui/material/styles";
const newTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            fontSize: '24px', // Replace with your desired font size
          },
          cell: {
            color: '#34282C', // Replace with your desired text color
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Replace with your desired color
          },
        },
      },
    },
    palette: {
      primary: {
        main: '#566D7E', // Replace with your desired primary color
      },
      secondary: {
        main: '#566D7E', // Replace with your desired secondary color
      },
    },
    typography: {
      h3: {
        fontFamily: 'Raleway',
        color: '#000000', // Replace with your desired color
        fontSize: '36px', // Replace with your desired font size
      },
      h4: {
        fontFamily: 'Raleway',
        color: '#000000', // Replace with your desired color
        fontSize: '36px', // Replace with your desired font size
      },
      h5: {
        fontFamily: 'Raleway',
        color: '#000000', // Replace with your desired color
        fontSize: '30px', // Replace with your desired font size
      },
      body1: {
        color: '#000000', // Replace with your desired color
        fontSize: '16px', // Replace with your desired font size
      },
    },
    
  });

  export default newTheme;