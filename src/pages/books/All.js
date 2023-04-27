import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  makeStyles,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Grid,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import MUILink from '@material-ui/core/Link';
import AddIcon from '@material-ui/icons/Add';
import theme from '../../theme';
import { Button } from '../../components/form/Buttons';
import FloatingBtnContainer from '../../components/FloatingBtnContainer';
import FloatingButton from '../../components/form/FloatingButton';
import BookItem from '../../components/BookCard';
import UpcomingBookCard from '../../components/UpcomingBookCard';
import { getBookForList, getUpcomingBook } from '../../services/book/book.firebase';
import { getAllChapters } from '../../services/chapter/chapter.firebase';
import { getAllStories } from '../../services/story/story.firebase';
import routes from '../../constants/routes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
  },
  container: {
    padding: '20px 20px',
    maxWidth: '1440px',
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
  tabContainer: {
    width: '100%',
  },
  tabs: {
    margin: '40px 0px',
    ['@media (max-width: 959px)']: {
      width: '100%',
      maxWidth: '540px',
    },
    ['@media (max-width: 599px)']: {
      maxWidth: '384px',
      '& .all-tab': {
        width: '204px !important',
      },
      '& .my-books-tab': {
        width: '180px !important',
      },
    },
    ['@media (max-width: 414px)']: {
      '& .all-tab': {
        width: '50% !important',
      },
      '& .my-books-tab': {
        width: '50% !important',
      },
    },
    '& .MuiButtonBase-root': {
      height: '50px',
      margin: `0 ${theme.spacing(2)}px`,
      fontFamily: 'Fira Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '22px',
      textTransform: 'capitalize',
      ['@media (max-width: 959px)']: {
        width: '50%',
        maxWidth: '270px',
        margin: 0,
      },
    },
    '& .Mui-selected': {
      backgroundColor: '#FAFAFA',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '20px 0px',
    },
  },
  subTitle2: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.15px',
    padding: '10px 0px',
  },
  title: {
    padding: '40px 0px',
  },
  loadMoreBtnWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: `${theme.spacing(2)}px`,
    '@media (max-width:960px)': {
      justifyContent: 'center',
    },
  },
  loadMoreBtn: {
    '@media (max-width:960px)': {
      width: '100%',
      maxWidth: 368,
      height: 48,
      border: '1px solid  #6A2C70',
    },
  },
  floatingBtnContainer: {
    maxWidth: 1440,
    paddingRight: 20,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 20,
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: 40,
    },
    [theme.breakpoints.up('lg')]: {
      paddingRight: 160,
    },
    '@media (max-width:960px)': {
      paddingRight: 0,
    },
    position: 'fixed',
    bottom: 80,
    right: 0,
    zIndex: 999,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
export default () => {
  const classes = useStyles({ theme: useTheme() });

  const authUser = useSelector((state) => state.userStore.authUser);

  const [value, setValue] = useState(0);
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState({});
  const [upcomingBooks, setUpcomingBooks] = useState([]);

  const matchesTablet = useMediaQuery('(max-width:959px)');

  useEffect(() => {
    const getAllDatas = async () => {
      const resBooks = await getBookForList(null, window.innerWidth > 959 ? 6 : 3);
      setBooks(resBooks);
      setLoading(false);
    };
    getAllDatas();
    getUpcomingBook(null, 4)
      .then((res) => {
        setUpcomingBooks(res);
      })
      .catch((err) => {
        console.log('Book All Page: Get Upcoming Book');
        console.log(err);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const goToBook = (bookId) => {
    history.push(`/books/${bookId}`);
  };

  const clickLoadMore = () => {
    getBookForList(books.lastRef, window.innerWidth > 959 ? 6 : 3)
      .then((res) => {
        setBooks({
          books: [...books.books, ...res.books],
          loadMore: res.loadMore,
          lastRef: res.lastRef,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid className={classes.root} container justify="center">
      <Grid
        container
        className={classes.container}
        wrap="wrap"
        alignItems="flex-start"
        direction={'column'}
        justify="flex-start"
      >
        <Grid item>
          <Typography variant="h4" color="primary">
            Library of Books
          </Typography>
          <Typography className={classes.subTitle2}>
            <MUILink href="/" color="secondary">
              Home
            </MUILink>
            /Books
          </Typography>
        </Grid>
        <Grid container direction="column" alignItems="flex-start" justify="center">
          {/* <Grid item container justify="center">
            <Tabs
              value={value}
              indicatorColor="secondary"
              textColor="secondary"
              onChange={handleTabChange}
              centered
              aria-label="Books"
              className={classes.tabs}
            >
              <Tab className="all-tab" label="All" {...a11yProps(0)} />
              <Tab className="my-books-tab" label="My Books" {...a11yProps(1)} />
            </Tabs>
          </Grid> */}

          {/* <TabPanel value={value} index={0} dir={theme.direction} className={classes.tabContainer}> */}
          <Grid item container justify={'space-between'} spacing={matchesTablet ? 3 : 4}>
            {loading ? (
              <Grid item container justify={'center'}>
                <CircularProgress />
              </Grid>
            ) : (
              <>
                {books.books.map((book, idx) => {
                  if (!!book && !book.isUpcoming) {
                    return (
                      <Grid item xs={12} md={6} key={book.id}>
                        <BookItem
                          book={book}
                          openBook={goToBook}
                          styles={{ margin: matchesTablet ? '0 auto' : 0 }}
                          detailBackBg={'#FAFAFA'}
                        />
                      </Grid>
                    );
                  }
                })}
                {books.loadMore && (
                  <Grid item xs={12} className={classes.loadMoreBtnWrapper}>
                    <Button className={classes.loadMoreBtn} onClick={clickLoadMore}>
                      Load More
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
          <Grid item container>
            <Grid item xs={12}>
              <Typography variant="h4" color="primary" className={classes.title}>
                Upcoming Books
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid item container justify={'flex-start'} spacing={4}>
                {loading ? (
                  <Grid item container justify={'center'}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  <>
                    {upcomingBooks.map((book, idx) => {
                      if (!!book && book.isUpcoming) {
                        return (
                          <Grid item xs={6} sm={3} key={book.id}>
                            <UpcomingBookCard book={book} openBook={goToBook} />
                          </Grid>
                        );
                      }
                    })}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
          {/* </TabPanel> */}
          {/* <TabPanel value={value} index={1} dir={theme.direction} className={classes.tabContainer}>
            <Grid item container justify={'space-between'} spacing={matchesTablet ? 3 : 4}>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {books.map((book, idx) => {
                    if (!!book) {
                      return (
                        <Grid item xs={12} md={6} key={book.id}>
                          <BookItem
                            book={{
                              ...book,
                              latestStories: getBookLatestStory(book.id),
                              upcomingEvents: getBookUpcomingEvents(book.id),
                            }}
                            openBook={goToBook}
                            styles={{ margin: matchesTablet ? '0 auto' : 0 }}
                            detailBackBg={'#FAFAFA'}
                          />
                        </Grid>
                      );
                    }
                  })}
                </>
              )}
            </Grid>
          </TabPanel> */}
        </Grid>
        {authUser && authUser.emailVerified && (
          <FloatingBtnContainer>
            <FloatingButton
              variant="contained"
              color="secondary"
              data-testid="btn-createNewBook"
              startIcon={<AddIcon />}
              onClick={() => history.push(routes.NEWBOOK)}
            >
              CREATE NEW BOOK
            </FloatingButton>
          </FloatingBtnContainer>
        )}
      </Grid>
    </Grid>
  );
};
