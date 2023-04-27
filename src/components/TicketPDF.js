import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  root: {
    padding: '50px',
    margin: '0 auto',
  },
  mbLg: {
    marginBottom: 20,
  },
  mbMd: {
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#283C63',
  },
  subtitle: {
    fontSize: 18,
    color: '#283C63',
    textAlign: 'center',
  },
  subDesc: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#828282',
    textAlign: 'center',
  },
  subContent: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subContentUpper: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    padding: 30,
    marginBottom: 40,
  },
  desc: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
    textAlign: 'center',
    width: '100%',
  },
});

export default ({ ticket, ...props }) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.root}>
          <View style={styles.mbLg}>
            <Text style={styles.title}>Payment Received</Text>
          </View>
          <View style={styles.mbLg}>
            <Text style={styles.desc}>
              You have successfully paid
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 20,
                  textTransform: 'uppercase',
                  color: '#6A2C70',
                }}
              >
                {` ${ticket.currency} ${parseInt(ticket.amount)} `}
              </Text>
              {`for ${ticket.eventTitle}`}
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.mbLg}>
              <Text color="primary" style={styles.subtitle}>
                Event Details
              </Text>
            </View>
            <View style={styles.mbMd}>
              <Text style={styles.subDesc}>Event</Text>
              <Text style={styles.subContent}>{ticket.eventTitle}</Text>
            </View>
            <View style={styles.mbMd}>
              <Text style={styles.subDesc}>Start date</Text>
              <Text style={styles.subContent}>
                {moment(ticket.eventFrom).format('MMM DD, YYYY LT')}
              </Text>
            </View>
            <View style={styles.mbLg}>
              <Text style={styles.subDesc}>End date</Text>
              <Text style={styles.subContent}>
                {moment(ticket.eventTo).format('MMM DD, YYYY LT')}
              </Text>
            </View>

            <View style={styles.mbLg}>
              <Text style={styles.subtitle}>Payment Details</Text>
            </View>
            <View style={styles.mbMd}>
              <Text style={styles.subDesc}>Amount paid</Text>
              <Text style={styles.subContentUpper}>{`${ticket.currency} ${parseInt(
                ticket.amount
              )}`}</Text>
            </View>
            <View style={styles.mbMd}>
              <Text style={styles.subDesc}>Payment date</Text>
              <Text style={styles.subContent}>{moment(ticket.created).format('MMM DD, YYYY')}</Text>
            </View>
            <View style={styles.mbMd}>
              <Text style={styles.subDesc}>Payment method</Text>
              <Text style={styles.subContentUpper}>
                {ticket.cardType && ticket.cardLast4
                  ? `${ticket.cardType} - ${ticket.cardLast4}`
                  : 'N/A'}
              </Text>
            </View>
            <View>
              <Text style={styles.subDesc}>Transaction ID</Text>
              <Text style={styles.subContent}>{ticket.transactionId.slice(-10)}</Text>
            </View>
          </View>

          <View style={styles.mbLg}>
            <Text style={styles.desc}>
              A copy of this invoice will be sent to your email. If you have any questions,
              <Link href="/" style={{ color: '#6A2C70' }}>
                {' contact us'}
              </Link>
              .
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
