import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '../../components/form/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FileField from '../../components/form/FileField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Button } from '../../components/form/Buttons';
import MUILink from '@material-ui/core/Link';
import Editor from '../../components/form/Editor';
import books from '../../store/actions/books';
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
  // agreeTerms: yup.bool().oneOf([true], 'The terms and conditions must be accepted.')
});

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    overflow: 'hidden',
  },
  form: {
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
    backgroundColor: '#fff',
  },
  title: {},
  section: {
    // padding: '21px 17px',
  },
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
  action: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  btnYes: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
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
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const [id] = useState(uuidv4());
  const [bookname, setBookName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState({ src: '', format: '' });
  // const [agreeTerms, setAgreeTerms] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [confirmUpcomingDlg, setConfirmUpcomingDlg] = useState(false);
  const history = useHistory();
  const firestore = useFirestore();
  const dispatch = useDispatch();
  useFirestoreConnect([
    {
      collection: 'books',
      doc: id,
    },
  ]);
  const createdBook = useSelector(
    (state) => state.firestore.data.books && state.firestore.data.books[id]
  );
  const [dirty, setDirty] = useState(false);
  const buildEventData = () => {
    return {
      id,
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
        // { ...data, agreeTerms },
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
  const createBook = () => dispatch(books.createBook(buildEventData()));
  const handleSubmit = () => {
    setDirty(true);
    createBook()
      .then(() => {
        TagManager.dataLayer({
          dataLayer: {
            event: 'newBookCreated',
            eventProps: {
              title: bookname,
              subtitle: subtitle,
            },
          },
        });
        history.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const showConfirm = () => {
    const valid = doValidation();
    if (valid) {
      setConfirmDlg(true);
    }
  };
  const handleCloseConfirmDlg = () => {
    setConfirmDlg(false);
  };
  return (
    <>
      <Grid className={classes.root} container justify="center">
        <Grid
          data-testid="createBookForm"
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
              Create a new book
            </Typography>
            <Typography className={classes.subTitle2}>
              <MUILink href="/" color="secondary">
                Home
              </MUILink>
              /
              <MUILink href="/books" color="secondary">
                Books
              </MUILink>
              /Create book
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
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Editor
                  data-testid="textfield-desc"
                  value={description}
                  placeholder="Background story"
                  error={!!errors.description}
                  color="secondary"
                  onChange={setDescription}
                />
                {/* <TextField
								data-testid="textfield-Desc"
								variant="outlined"
								fullWidth
                                name="description"
                                multiline
								value={description}
								error={!!errors.description}
								helperText={!!errors.description && errors.description.message }
                                label="Background story"
                                placeholder="Background story"
                                rows={20}
								onChange={e => setDescription(e.target.value)}
							/> */}
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
                  Upload image
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
                    onChange={(e) => {
                      if (e.target.checked) {
                        setConfirmUpcomingDlg(true);
                      } else setIsUpcoming(e.target.checked);
                    }}
                    name="isUpcoming"
                    color={'secondary'}
                    data-testid="checkbox-isUpcoming"
                  />
                }
                label={<Typography variant="caption">Add this book as upcoming book</Typography>}
              />
            </FormControl>
            {/* <FormControl required error={!!errors.agreeTerms}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    name="agreeTerms"
                    color={'secondary'}
                    data-testid="checkbox-agreeTerms"
                  />
                }
                label={
                  <Typography variant="caption">
                    I agree to the{' '}
                    <MUILink href="#" color="secondary">
                      terms of use and conditions
                    </MUILink>
                  </Typography>
                }
              />
              {!!errors.agreeTerms && (
                <FormHelperText id="my-helper-text">
                  Please accept our terms of use and conditions
                </FormHelperText>
              )}
            </FormControl> */}
          </Grid>
          <Grid item container xs={12} wrap="wrap-reverse" justify="space-between" spacing={3}>
            <Grid item sm={'auto'} xs={12}>
              <Button
                className={classes.action}
                size="large"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  history.goBack();
                }}
                data-testid="btn-discard"
              >
                CANCEL
              </Button>
            </Grid>
            <Grid item sm={'auto'} xs={12}>
              <Button
                className={classes.action}
                size="large"
                variant="contained"
                color="secondary"
                onClick={showConfirm}
                data-testid="btn-createBook"
              >
                CREATE
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Modal open={confirmDlg} onClose={handleCloseConfirmDlg} data-testid="modal-confirm">
        <Grid container direction="column" spacing={6}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to create a new book in NextHuman?
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              className={classes.btnYes}
              size="large"
              data-testid="btn-confirm"
              onClick={handleSubmit}
            >
              Yes
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <MUILink component="button" onClick={() => setConfirmDlg(false)} color="error">
              No
            </MUILink>
          </Grid>
        </Grid>
      </Modal>

      {/* upcoming confirm modal */}
      <Modal
        open={confirmUpcomingDlg}
        onClose={() => {
          setConfirmUpcomingDlg(false);
        }}
        data-testid="modal-confirm-upcoming"
      >
        <Grid container direction="column" spacing={6}>
          <Grid item xs={12}>
            <Typography
              align="center"
              variant="h3"
              color="primary"
              className={classes.contentTitle}
            >
              Do you want to create a new book as upcoming book?
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              className={classes.btnYes}
              size="large"
              data-testid="btn-confirm-upcoming"
              onClick={() => {
                setConfirmUpcomingDlg(false);
                setIsUpcoming(true);
              }}
            >
              Yes
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <MUILink
              component="button"
              onClick={() => {
                setConfirmUpcomingDlg(false);
                setIsUpcoming(false);
              }}
              color="error"
            >
              No
            </MUILink>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
