import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#ffffff",
      dark: "#DB4444",
      customBlack: "#191919",
      loading: "#1E90FF",
      buttonHover: "#ccc",
    },
    secondary: {
      main: "#background.paper",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    fontFamily: "Roboto, Raleway, Montserrat, sanserif",
    h1: {
      fontSize: "6rem",

      "@media (max-width: 960px)": {
        fontSize: "5rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "4rem",
      },
      "@media (max-width: 414px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontSize: "3.75rem",

      "@media (max-width: 960px)": {
        fontSize: "3rem",
      },
      "@media (max-width: 662px)": {
        fontSize: "2.3rem",
      },
      "@media (max-width: 414px)": {
        fontSize: "2.2rem",
      },
    },

    h3: {
      fontSize: "3rem",
      "@media (max-width: 960px)": {
        fontSize: "2.4rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "2rem",
      },
      "@media (max-width: 414px)": {
        fontSize: "1.7rem",
      },
    },
    h4: {
      fontSize: "2.125rem",
      "@media (max-width: 960px)": {
        fontSize: "1.5rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontSize: "1.5rem",
      "@media (max-width: 960px)": {
        fontSize: "1.5rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "1.1rem",
      },
    },
    h6: {
      fontSize: "1.25rem",
      "@media (max-width: 960px)": {
        fontSize: "1.1rem",
      },
      "@media (max-width: 600px)": {
        fontSize: "1rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width: 960px)": {
        fontSize: "1rem",
      },
      "@media (max-width:600px)": {
        fontSize: ".9rem",
      },
    },
    body2: {
      fontSize: "1rem",
      "@media (max-width: 960px)": {
        fontSize: "1rem",
      },
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
      "@media (max-width: 480px)": {
        fontSize: ".97rem",
      },
    },
  },
});

export default theme;
