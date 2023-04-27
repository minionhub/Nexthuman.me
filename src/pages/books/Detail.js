import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, Grid, Typography, CardMedia, IconButton } from '@material-ui/core';
import SimpleBar from 'simplebar-react';
import { Button } from '../../components/form/Buttons';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 'auto',
    minHeight: 'calc(100vh - 130px)',
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 130px)',
    },
    ['@media (min-width: 780px)']: {
      minHeight: 'calc(100vh - 160px)',
    },
  },
  container: {
    maxWidth: 1440,
    width: '100%',
    padding: '20px 20px',
    [theme.breakpoints.up('sm')]: {
      padding: '60px  20px',
    },
    [theme.breakpoints.up('md')]: {
      padding: '60px  40px',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '60px  160px',
    },
  },
  bookContainer: {
    border: '1px solid #F2F2F2',
    borderRadius: '8px',
    overflow: 'hidden',
    height: 'auto',
    [theme.breakpoints.up('sm')]: {
      height: '640px',
    },
    [theme.breakpoints.up('md')]: {
      height: '740px',
    },
  },
  details: {
    zIndex: 1,
    color: 'white',
    padding: '60px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: '50px 24px',
    },
  },
  mediaContent: {
    position: 'relative',
    width: '100%',
    height: '525px',
    [theme.breakpoints.up('sm')]: {
      width: '48%',
      height: '100%',
    },
  },
  media: {
    borderRadius: '4px 4px 0 0',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mediaOverlay: {
    opacity: 0.5,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'linear-gradient(115.76deg, #283C63 -8.21%, #6A2C70 106.61%);',
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '34px',
      lineHeight: '41px',
      letterSpacing: '0.25px',
    },
  },
  subTitle: {
    fontFamily: 'Lato',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    letterSpacing: '0.25px',
  },
  chipIcon: {
    fontSize: 12,
    width: 12,
    height: 12,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      width: 11,
      height: 11,
    },
  },
  actionContainer: {
    padding: '40px 24px',
    width: '100%',
    height: 'auto',
    minHeight: '425px',
    maxHeight: '650px',
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      padding: '24px 30px',
      width: '52%',
      height: '100%',
      maxHeight: '100%',
    },
  },
  subjectTitle: {
    [theme.breakpoints.down('sm')]: {
      flexGrow: 1,
    },
  },
  editButton: {
    padding: '8px',
    '& .MuiSvgIcon-root': {
      fontSize: '24px',
    },
  },
  label: {
    fontFamily: 'Lato',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
      lineHeight: '12px',
    },
  },
  description: {
    flex: '1 1 100%',
    overflow: 'hidden',
    marginTop: '12px',
    '& .MuiTypography-body1': {
      lineHeight: '24px',
    },
  },
  action: {
    marginLeft: '15px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '4px',
    },
  },
  openBtn: {
    marginTop: 12,
    [theme.breakpoints.down('sm')]: {
      marginTop: 18,
    },
  },
}));

const DEFAULT_COVER_IMAGE =
  'https://images.squarespace-cdn.com/content/v1/551dabf6e4b008920a354e82/1452714433264-6T39HAD2T42VF3JG7U6Z/ke17ZwdGBToddI8pDm48kMUW853eF0JL6ooZqMQl0TEUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcBT4_6C-oPlXEmdkc_QKpzD5vE2TZB1uAoZtbWfS3iPUVbK0u-K9mznXgIgdDqg7W/event+booking+background.jpg?format=2500w';
export default () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { bookId } = useParams();
  useFirestoreConnect([
    {
      collection: 'books',
      doc: bookId,
    },
  ]);
  const history = useHistory();
  const editBook = (bookId) => {
    history.push(`/books/${bookId}/chapters`);
  };
  const authUser = useSelector((state) => state.userStore.authUser);
  const book = useSelector(
    (state) => state.firestore.data.books && state.firestore.data.books[bookId]
  );
  return (
    <Grid container justify="center" className={classes.root}>
      <Card elevation={0} className={classes.container}>
        <Grid container className={classes.bookContainer}>
          {book && (
            <>
              <Grid item container className={classes.mediaContent}>
                <Grid item container xs={12}>
                  <CardMedia
                    className={classes.media}
                    image={book.coverImage ? book.coverImage.src : DEFAULT_COVER_IMAGE}
                  >
                    <div className={classes.mediaOverlay} />
                  </CardMedia>
                  <Grid
                    item
                    container
                    className={classes.details}
                    direction="column"
                    justify="flex-end"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography variant="h3" className={classes.title} data-testid="book-name">
                        {book.bookname}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" data-testid="book-subtitle">
                        {book.subtitle}
                      </Typography>
                    </Grid>
                    {/* <Grid item container direction={'row'}>
                      <Chip
                        icon={<MenuBookIcon className={classes.chipIcon} />}
                        label="18 Stories"
                        color="secondary"
                        size="small"
                        className={classes.label}
                      />
                      <Chip
                        icon={<DateRangeIcon className={classes.chipIcon} />}
                        label="18 Events"
                        color="secondary"
                        size="small"
                        className={[classes.label, classes.action].join(' ')}
                      />
                    </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container direction={'column'} className={classes.actionContainer}>
                <Grid
                  item
                  container
                  justify={'space-between'}
                  alignItems={'center'}
                  className={classes.subjectTitle}
                >
                  <Typography color="secondary" variant="h4">
                    Background
                  </Typography>
                  {authUser && authUser.type === 'admin' && (
                    <IconButton
                      className={classes.editButton}
                      aria-label="edit"
                      onClick={() => {
                        history.push(`/books/edit/${bookId}`);
                      }}
                      data-testid="edit-book"
                    >
                      <EditOutlinedIcon fontSize="large" color="secondary" />
                    </IconButton>
                  )}
                </Grid>
                <Grid item className={classes.description}>
                  <SimpleBar style={{ maxHeight: '100%', paddingRight: '15px' }}>
                    <Typography
                      variant="body1"
                      data-testid="book-description"
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    ></Typography>
                  </SimpleBar>
                </Grid>
                {!book.isUpcoming && (
                  <Grid item style={{ flexGrow: 1 }}>
                    <Button
                      variant="contained"
                      className={classes.openBtn}
                      data-testid="open-book"
                      onClick={() => editBook(book.id)}
                      style={{ minWidth: 'auto' }}
                    >
                      OPEN BOOK
                    </Button>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Card>
    </Grid>
  );
};
