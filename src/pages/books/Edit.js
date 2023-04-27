import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '../../components/form/TextField';
import { ErrorButton } from '../../components/form/Buttons';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FileField from '../../components/form/FileField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Button } from '../../components/form/Buttons';
import MUILink from '@material-ui/core/Link';
import books from '../../store/actions/books';
import Editor from '../../components/form/Editor';
import * as yup from 'yup';
import { FormControl } from '@material-ui/core';
import Modal from '../../components/Modal';
import routes from '../../constants/routes.json';

const validationSchema = yup.object().shape({
  bookname: yup.string().required('Book name is required'),
  subtitle: yup.string().required('Subtitle is required'),
  coverImage: yup.object({
    src: yup.string().url('Cover image is not valid url'),
  }),
});

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    overflow: 'hidden',
  },
  form: {
    maxWidth: 1440,
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
    backgroundColor: '#fff',
  },
  title: {},
  subTitle2: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '17px',
    letterSpacing: '0.15px',
    padding: '4px 0px',
  },
  sectionTitle: {
    margin: '12px 0 4px',
  },
  sectionDesc: {
    // color: '#BDBDBD',
    fontSize: 16,
    lineHeight: '19px',
    marginBottom: 19,
  },
  field: {
    // margin: '20px 0'
    padding: '11px 17px',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 0',
    },
  },
  actionBtnContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-end',
    },
  },
  action: {
    marginRight: 10,
    flex: '1 1 100%',
    minWidth: 'auto',
    maxWidth: '160px',
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0,
    },
  },
  contentTitle: {
    [theme.breakpoints.down('md')]: {
      fontFamily: 'Fira Sans',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '29px',
      letterSpacing: '0px',
      textAlign: 'center',
    },
  },
  submit: {
    flex: '1 1 100%',
    minWidth: 'auto',
    maxWidth: '160px',
    marginLeft: 10,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
  btnYes: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const [bookname, setBookName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState({ src: '', format: '' });
  const [errors, setErrors] = useState({});
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const { bookId } = useParams();
  useFirestoreConnect([
    {
      collection: 'books',
      doc: bookId,
    },
  ]);
  const book = useSelector(
    (state) => state.firestore.data.books && state.firestore.data.books[bookId]
  );
  const [dirty, setDirty] = useState(false);
  const buildEventData = () => {
    return {
      id: bookId,
      bookname,
      subtitle,
      description,
      coverImage,
      isUpcoming,
    };
  };
  const doValidation = () => {
    const data = buildEventData();
    try {
      validationSchema.validateSync(
        { ...data },
        { abortEarly: false, recursive: true, stripUnknown: true }
      );
      setErrors({});
      return true;
    } catch (e) {
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };
  const updateBook = () => dispatch(books.updateBook(buildEventData()));
  const deleteBook = () => dispatch(books.deleteBook(bookId));
  const handleSubmit = () => {
    const valid = doValidation();
    setDirty(true);
    if (valid) {
      updateBook()
        .then(() => {
          history.goBack();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const clickDeleteBook = () => {
    setConfirmDlg(true);
  };
  const confirmDelete = () => {
    deleteBook()
      .then(() => {
        history.push(routes.BOOKS);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    if (book) {
      setBookName(book.bookname);
      setCoverImage(book.coverImage);
      setSubtitle(book.subtitle);
      setDescription(book.description);
      setIsUpcoming(book.isUpcoming);
    }
  }, [book]);

  return (
    <>
      <Grid className={classes.root} container justify="center">
        <Grid
          data-testid="updateBookForm"
          className={classes.form}
          item
          container
          component="form"
          wrap="wrap"
          alignItems="flex-start"
          justify="flex-start"
          spacing={4}
        >
          <Grid item xs={12}>
            <Typography className={classes.title} color="primary" variant="h4">
              Update Book
            </Typography>
            <Typography className={classes.subTitle2}>
              <MUILink href="/" color="secondary">
                Home
              </MUILink>
              /
              <MUILink href="/books" color="secondary">
                Books
              </MUILink>
              /Update Book
            </Typography>
          </Grid>
          <Grid item md={8} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  General information
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Describe title, subtitle and description of the book
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  data-testid="textfield-BookName"
                  variant="outlined"
                  fullWidth
                  name="bookname"
                  value={bookname}
                  error={!!errors.bookname}
                  helperText={!!errors.bookname && errors.bookname.message}
                  label="Book Name*"
                  placeholder="Book Name"
                  color="secondary"
                  onChange={(e) => setBookName(e.target.value)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  data-testid="textfield-Subtitle"
                  variant="outlined"
                  fullWidth
                  name="subtitle"
                  value={subtitle}
                  error={!!errors.subtitle}
                  helperText={!!errors.subtitle && errors.subtitle.message}
                  label="Subtitle*"
                  placeholder="Subtitle"
                  color="secondary"
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Editor
                  data-testid="textfield-desc"
                  value={description}
                  placeholder="Background story"
                  error={!!errors.description ? errors.description : ''}
                  color="secondary"
                  onChange={setDescription}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.sectionTitle} color="primary" variant="h5">
                  Multimedia
                </Typography>
                <Typography className={classes.sectionDesc} color="secondary">
                  Upload image and sound
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FileField
                  data-testid="filefield-CoverImage"
                  label="Book Cover"
                  fullWidth
                  name="coverImage"
                  value={coverImage}
                  error={!!errors['coverImage.src']}
                  helperText={!!errors['coverImage.src'] && errors['coverImage.src'].message}
                  onChange={setCoverImage}
                  placeholder="Add story picture here"
                  variant="outlined"
                  color="secondary"
                  fileTypes={['image']}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} direction="column">
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUpcoming}
                    onChange={(e) => setIsUpcoming(e.target.checked)}
                    name="isUpcoming"
                    color={'secondary'}
                    data-testid="checkbox-isUpcoming"
                  />
                }
                label={<Typography variant="caption">Upcoming book</Typography>}
              />
            </FormControl>
          </Grid>
          <Grid item md={8} sm={4} xs={12}>
            <ErrorButton
              data-testid="btn-delete"
              // className={classes.action}
              size="large"
              variant="contained"
              onClick={clickDeleteBook}
            >
              DELETE
            </ErrorButton>
          </Grid>
          <Grid item md={4} sm={8} xs={12} className={classes.actionBtnContainer}>
            <Button
              data-testid="btn-discard"
              className={classes.action}
              size="large"
              variant="outlined"
              color="secondary"
              onClick={() => {
                history.goBack();
              }}
            >
              CANCEL
            </Button>
            <Button
              data-testid="btn-updateBook"
              className={classes.submit}
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleSubmit}
            >
              UPDATE
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Modal open={confirmDlg} onClose={() => setConfirmDlg(false)} data-testid="modal-confirm">
        <Grid container direction="column" spacing={6}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to permanently delete the book?
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.btnYes}
              onClick={() => setConfirmDlg(false)}
            >
              BACK
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <MUILink
              component="button"
              onClick={() => confirmDelete()}
              data-testid="btn-confirm"
              color="error"
            >
              PERMANENT DELETE
            </MUILink>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
