import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Typography,
  Input,
  TextField,
  InputAdornment,
  Container,
  IconButton,
  TableFooter,
  TablePagination,
  Button,
} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Switch from '../../components/form/Switch';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import userActions from '../../store/actions/users';
import { AuthContext } from '../../session/Auth';
import { useHistory } from 'react-router-dom';
import dateUtils from '../../utils/date';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    padding: '13px 22px',
  },
  body: {
    fontSize: 15,
    padding: '13px 22px',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  pagination: {
    flexShrink: 0,
    marginTop: '18px',
  },
  table: {
    // maxWidth: 1122,
  },
  title: {
    paddingBottom: '40px',
  },

  paginationBtn: {
    borderRadius: '0px',
    boxShadow: 'none',
    height: '40px',
    border: '1px solid #E0E0E0',
    backgroundColor: 'white',
  },
  paginationNumBtn: {
    minWidth: '40px',
    width: '40px',

    '&.active': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  search: {
    width: '350px',
    height: '40px',
    backgroundColor: '#F2F2F2',
    border: 0,
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;
  const totalPage = Math.ceil(count / rowsPerPage);
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, totalPage - 1));
  };
  return (
    <div className={classes.pagination}>
      <Button
        onClick={handleBackButtonClick}
        disabled={page === 0}
        variant="contained"
        aria-label="pref page"
        className={classes.paginationBtn}
      >
        Prev
      </Button>
      {Array.from(Array(Math.max(0, totalPage)), (e, i) => {
        return (
          <React.Fragment key={`page-${i}`}>
            {((page > 3 && i == 1) || (i == totalPage - 2 && page < totalPage - 4)) &&
            totalPage > 7 ? (
              <Button
                key={i}
                variant="contained"
                className={[classes.paginationBtn, classes.paginationNumBtn].join(' ')}
              >
                ...
              </Button>
            ) : (page == i) == true ? (
              <Button
                key={i}
                variant="contained"
                color={'secondary'}
                onClick={(e) => onChangePage(e, i)}
                className={[classes.paginationBtn, classes.paginationNumBtn, 'active'].join(' ')}
              >
                {i + 1}
              </Button>
            ) : (page == i - 1 || page == i + 1) == true ? (
              <Button
                key={i}
                variant="contained"
                onClick={(e) => onChangePage(e, i)}
                className={[classes.paginationBtn, classes.paginationNumBtn].join(' ')}
              >
                {i + 1}
              </Button>
            ) : (i == 0 ||
                i >= totalPage - 1 ||
                (page <= 3 && i < 5) ||
                (page >= totalPage - 4 && i >= totalPage - 5)) == true ? (
              <Button
                key={i}
                variant="contained"
                onClick={(e) => onChangePage(e, i)}
                className={[classes.paginationBtn, classes.paginationNumBtn].join(' ')}
              >
                {i + 1}
              </Button>
            ) : (
              ''
            )}
          </React.Fragment>
        );
      })}
      <Button
        onClick={handleNextButtonClick}
        variant="contained"
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        className={classes.paginationBtn}
      >
        Next
      </Button>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default () => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const rowsPerPage = 15;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const { authUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const updateUserType = (uid, type) => dispatch(userActions.updateUserType(uid, type));
  const setUserType = (state, id) => {
    updateUserType(id, state == true ? 'admin' : 'normal');
  };
  useFirestoreConnect([
    {
      collection: 'users',
    },
  ]);
  const users = useSelector((state) => state.firestore.data.users);
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  useEffect(() => {
    if (!authUser || authUser.type != 'admin') {
      history.goBack();
    }
  }, []);
  return (
    <Grid container className={classes.root}>
      <Grid className={classes.container} container>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.title}
        >
          <Typography variant="h4" color="primary">
            Manage Users
          </Typography>
          <TextField
            id="userSearch"
            variant="outlined"
            InputProps={{
              className: classes.search,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
            placeholder={'Type Name or Email'}
            value={keyword}
            color="secondary"
            data-testid="textField-keyword"
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
          />
        </Grid>

        <TableContainer>
          <Table className={classes.table} aria-label="user table" size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Typography variant="h6">#</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6">Name</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6">Email</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6">Created At</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6">Last login</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6" align="center">
                    Account Type
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="h6" align="center">
                    Make Admin
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoaded(users) && (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align={'center'}>
                    <CircularProgress data-testid="progress" />
                  </StyledTableCell>
                </StyledTableRow>
              )}

              {isLoaded(users) &&
                Object.keys(users)
                  .filter((userKey) => {
                    if (
                      keyword == '' ||
                      (users[userKey].name != undefined &&
                        users[userKey].name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0) ||
                      (users[userKey].email != undefined &&
                        users[userKey].email.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                    )
                      return userKey;
                    /// || (users[userKey].email != undefined && users[userKey].email.toLowerCase().indexOf(keyword.toLowerCase()))
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((key, index) => (
                    <StyledTableRow key={key}>
                      <StyledTableCell component="th" scope="row">
                        {page * rowsPerPage + index + 1}
                      </StyledTableCell>
                      <StyledTableCell>{users[key].name}</StyledTableCell>
                      <StyledTableCell>{users[key].email}</StyledTableCell>
                      <StyledTableCell>
                        {users[key].created
                          ? dateUtils.format(
                              users[key].created.toDate().toLocaleDateString('en-US') +
                                ' ' +
                                users[key].created.toDate().toLocaleTimeString('en-US')
                            )
                          : ''}
                      </StyledTableCell>
                      <StyledTableCell>
                        {users[key].lastLogin
                          ? dateUtils.format({
                              date:
                                users[key].lastLogin.toDate().toLocaleDateString('en-US') +
                                ' ' +
                                users[key].lastLogin.toDate().toLocaleTimeString('en-US'),
                            })
                          : ''}
                      </StyledTableCell>
                      <StyledTableCell align={'center'} data-testid="account-type">
                        {users[key].type}
                      </StyledTableCell>
                      <StyledTableCell align={'center'}>
                        {
                          <Switch
                            checked={users[key].type == 'admin'}
                            onChange={(e) => setUserType(e.target.checked, key)}
                            data-testid="switch-usertype"
                          />
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        {users && (
          <Grid container justify="flex-end">
            <TablePagination
              count={Object.values(users).length}
              rowsPerPage={rowsPerPage}
              component="div"
              page={page}
              rowsPerPageOptions={[1]}
              labelDisplayedRows={({ from, to, count }) => ''}
              onChangePage={handleChangePage}
              ActionsComponent={TablePaginationActions}
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
