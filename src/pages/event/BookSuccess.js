import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';
import { Box, Container, Grid, Typography, CircularProgress, Button } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import { useFirestoreConnect } from 'react-redux-firebase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from '../../components/TicketPDF';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '60px 0',
    '& .MuiContainer-maxWidthXl': {
      maxWidth: '730px !important',
    },
  },
  mbLg: {
    marginBottom: 40,
  },
  mbMd: {
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    [theme.breakpoints.down('sm')]: {
      fontSize: 34,
    },
  },
  subtitle: {
    fontSize: 24,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
  subDesc: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#828282',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  subContent: {
    fontSize: 20,
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
  content: {
    width: '100%',
    padding: 90,
    background: '#FAFAFA',
    [theme.breakpoints.down('sm')]: {
      padding: '50px 16px',
    },
  },
  desc: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#333333',
    width: '100%',
  },
}));

export default () => {
  const classes = useStyles();
  const { ticketId } = useParams();

  useFirestoreConnect([
    {
      collection: 'tickets',
      doc: ticketId,
    },
  ]);

  const ticket = useSelector(
    (state) => state.firestore.data.tickets && state.firestore.data.tickets[ticketId]
  );

  return (
    <>
      {!ticket && (
        <Box
          style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {ticket && (
        <Box className={classes.root}>
          <Container maxWidth="xl">
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Check color="primary" style={{ fontSize: 100 }}></Check>
              </Grid>
              <Grid item className={classes.mbLg}>
                <Typography variant="h3" color="primary" className={classes.title}>
                  Payment Received
                </Typography>
              </Grid>
              <Grid item className={classes.mbLg}>
                <Typography className={classes.desc}>
                  You have successfully paid
                  <Typography
                    component="span"
                    color="secondary"
                    style={{ fontWeight: '700', fontSize: 20, textTransform: 'uppercase' }}
                  >
                    {` ${ticket.currency} ${parseInt(ticket.amount)} `}
                  </Typography>
                  {`for ${ticket.eventTitle}`}
                </Typography>
              </Grid>

              <Grid
                item
                container
                direction="column"
                className={classes.content}
                style={{ marginBottom: 40 }}
              >
                <Grid item className={classes.mbLg}>
                  <Typography color="primary" className={classes.subtitle}>
                    Event Details
                  </Typography>
                </Grid>
                <Grid item container className={classes.mbMd} justify="space-between">
                  <Typography className={classes.subDesc}>Event</Typography>
                  <Typography className={classes.subContent}>{ticket.eventTitle}</Typography>
                </Grid>
                <Grid item container className={classes.mbMd} justify="space-between">
                  <Typography className={classes.subDesc}>Start date</Typography>
                  <Typography className={classes.subContent}>
                    {moment(ticket.eventFrom).format('MMM DD, YYYY LT')}
                  </Typography>
                </Grid>
                <Grid item container className={classes.mbLg} justify="space-between">
                  <Typography className={classes.subDesc}>End date</Typography>
                  <Typography className={classes.subContent}>
                    {moment(ticket.eventTo).format('MMM DD, YYYY LT')}
                  </Typography>
                </Grid>

                <Grid item className={classes.mbLg}>
                  <Typography color="primary" className={classes.subtitle}>
                    Payment Details
                  </Typography>
                </Grid>
                <Grid item container className={classes.mbMd} justify="space-between">
                  <Typography className={classes.subDesc}>Amount paid</Typography>
                  <Typography className={classes.subContent} style={{ textTransform: 'uppercase' }}>
                    {ticket.amount > 0 ? `${ticket.currency} ${parseInt(ticket.amount)}` : 'Free'}
                  </Typography>
                </Grid>
                <Grid item container className={classes.mbMd} justify="space-between">
                  <Typography className={classes.subDesc}>Payment date</Typography>
                  <Typography className={classes.subContent}>
                    {moment(ticket.created).format('MMM DD, YYYY')}
                  </Typography>
                </Grid>
                <Grid item container className={classes.mbMd} justify="space-between">
                  <Typography className={classes.subDesc}>Payment method</Typography>
                  <Typography
                    className={classes.subContent}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {ticket.cardType && ticket.cardLast4
                      ? `${ticket.cardType} - ${ticket.cardLast4}`
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item container justify="space-between">
                  <Typography className={classes.subDesc}>Transaction ID</Typography>
                  <Typography className={classes.subContent}>
                    {ticket.transactionId.slice(-10)}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item className={classes.mbLg}>
                <Typography className={classes.desc}>
                  A copy of this invoice will be sent to your email.
                </Typography>
              </Grid>
              <Grid item style={{ width: '100%' }}>
                <PDFDownloadLink
                  data-testid="eventBookSuccessDownload"
                  document={<TicketPDF ticket={ticket} />}
                  style={{
                    fontSize: 20,
                    padding: '10px 0',
                    color: '#6A2C70',
                    textDecoration: 'none',
                  }}
                  fileName="invoice.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download as PDF'
                  }
                </PDFDownloadLink>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};
