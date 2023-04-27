import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';

export const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    },
    width: '100%'
  },
  expanded: {}
})(MuiAccordion);

export const AccordionSummary = withStyles(theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
      backgroundColor: '#6A2C70',
      color: 'white'
    },
    '&$expanded button': {
      color: 'white'
    },
    '& button': {
      color: theme.palette.secondary.main
    },
    color: '#283C63'
  },
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
}))(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: '30px 90px',
    [theme.breakpoints.down('md')]: {
      padding: '17px  12px'
    }
  }
}))(MuiAccordionDetails);

export default props => {
  const { handleChange, summary, panelId, expanded } = props;
  return (
    <Accordion square expanded={expanded === panelId} onChange={handleChange(panelId)}>
      <AccordionSummary aria-controls={`${panelId}-content`} id={`${panelId}-header`}>
        <Typography>{summary}</Typography>
        {props.button && props.button}
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
};
