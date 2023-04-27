import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#283C63'
    },
    secondary: {
      main: '#6A2C70'
    },
    text: {
      primary: '#333'
    },
    background: {
      default: '#fff'
    },
    error: {
      main: '#E84545'
    },
    additional: '#F08A5D',
    border: {
      light: '#f6f7fa',
      dark: 'rgba(0, 0, 0, 0.2)'
    }
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    h1: {
      fontFamily: 'Fira Sans',
      fontSize: 96,
      lineHeight: '115px',
      letterSpacing: -1.5,
      fontWeight: 'normal'
    },
    h2: {
      fontFamily: 'Fira Sans',
      fontSize: 60,
      lineHeight: '72px',
      fontWeight: 'normal',
      letterSpacing: -0.5
    },
    h3: {
      fontFamily: 'Fira Sans',
      fontSize: 48,
      lineHeight: '58px',
      fontWeight: '500',
      letterSpacing: 0
    },
    h4: {
      fontFamily: 'Fira Sans',
      fontSize: 34,
      lineHeight: '41px',
      fontWeight: 'normal',
      letterSpacing: 0.25
    },
    h5: {
      fontFamily: 'Fira Sans',
      fontSize: 24,
      lineHeight: '29px',
      fontWeight: 'normal',
      letterSpacing: 0
    },
    h6: {
      fontFamily: 'Fira Sans',
      fontSize: 20,
      lineHeight: '24px',
      fontWeight: 500,
      letterSpacing: 0.15
    },
    subtitle1: {
      fontFamily: 'Fira Sans',
      fontSize: 16,
      lineHeight: '19px',
      fontWeight: 'normal',
      letterSpacing: 0.15
    },
    subtitle2: {
      fontFamily: 'Fira Sans',
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 'normal',
      letterSpacing: 0.1
    },
    body1: {
      fontSize: 17,
      lineHeight: '22px',
      fontWeight: 'normal',
      letterSpacing: 0.5
    },
    body2: {
      fontSize: 15,
      lineHeight: '18px',
      fontWeight: 'normal',
      letterSpacing: 0.25
    },
    body3: {
      fontSize: 12,
      lineHeight: '14.4px',
      fontWeight: 'normal',
      letterSpacing: 0.25
    },
    button: {
      fontSize: 15,
      lineHeight: '18px',
      fontWeight: 500,
      letterSpacing: 1.25
    },
    caption: {
      fontSize: 13,
      lineHeight: '16px',
      fontWeight: 500,
      letterSpacing: 0.4
    },
    overline: {
      fontSize: 10,
      lineHeight: '12px',
      fontWeight: 'normal',
      letterSpacing: 1.5
    }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none'
      }
    },

    MuiInputBase: {
      root: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: 0.15
      }
    },

    MuiInputLabel: {
      root: {
        fontSize: 13,
        lineHeight: '16px',
        letterSpacing: 0.4,
        color: '#4f4f4f'
      },
      outlined: {
        '&.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.85)'
        }
      }
    }
  }
});
