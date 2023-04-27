import React, { useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, Button, IconButton, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import MUILink from '@material-ui/core/Link';
import Accordion from '../../components/Accordion';
import Modal from '../../components/Modal';
import TextField from '../../components/form/TextField';
import LoadingOverlay from '../../components/LoadingOverlay';
import {
  getChaptersOfBook,
  createChapter,
  editChapter,
  deleteChapter,
} from '../../store/actions/chapters';
import StoryPanel from '../../components/StoryPanel';
import FloatingBtnContainer from '../../components/FloatingBtnContainer';
import FloatingButton from '../../components/form/FloatingButton';
import * as yup from 'yup';
import moment from 'moment';

const validationSchema = yup.object().shape({
  name: yup.string().required('Chapter name is required'),
});

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
  content: {
    paddingTop: '40px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '30px',
    },
    minHeight: '60vh',
    width: '100%',
  },
  createBtn: {
    padding: '15px 24px',
    borderRadius: '24px',
    marginTop: '30px',
  },
  form: {
    width: '400px',
    padding: 24,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  formBtn: {
    minWidth: '230px',
    padding: '15px 24px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
    position: 'fixed',
    bottom: 80,
    right: 0,
    zIndex: 999,
    '& .MuiButtonBase-root:nth-child(2)': {
      marginLeft: '20px',
    },
  },
  extendedIcon: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(1),
    },
  },
}));

export default () => {
  const classes = useStyles({ theme: useTheme() });
  const history = useHistory();
  const { bookId } = useParams();
  const [id, setId] = useState('');
  const [errors, setErrors] = useState({});
  const [confirmDlg, setConfirmDlg] = useState(false);
  const [deleteConfirmDlg, setDeleteConfirmDlg] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [chapterName, setChapterName] = useState('');

  const [isLoading, setLoading] = useState(true);
  const [isActionLoading, setActionLoading] = useState(false);
  const [chapters, setChapters] = useState([]);

  const [expanded, setExpanded] = useState('');
  const [storyExpandedId, setStoryExpandedId] = useState('');

  useEffect(() => {
    setLoading(true);
    getChaptersOfBook(bookId)
      .then((res) => {
        const tempChapters = [];
        res.forEach((doc) => {
          tempChapters.push(doc.data());
        });
        setChapters(
          tempChapters.sort((a, b) => {
            if (!a.created) return -1;
            if (!b.created) return 1;
            if (!a.created && !b.created) return 0;
            return moment(a.created).utc().valueOf() - moment(b.created).utc().valueOf();
          })
        );

        if (history.action === 'REPLACE') {
          const location = history.location;
          if (!!location.state && !!location.state.chapterId) {
            setExpanded(`panel_chapter_${location.state.chapterId}`);
            setStoryExpandedId(location.state.storyId);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setChapters([]);
        setLoading(false);
      });
  }, [history, bookId]);

  const userStore = useSelector((state) => state.userStore);

  const doValidation = () => {
    try {
      validationSchema.validateSync(
        { name: chapterName },
        {
          abortEarly: false,
          recursive: true,
          stripUnknown: true,
        }
      );
      setErrors({});
      return true;
    } catch (e) {
      setErrors(e.inner.reduce((result, err) => ({ ...result, [err.path]: err }), {}));
      return false;
    }
  };

  const handleCloseConfirmDlg = () => {
    setConfirmDlg(false);
  };

  const handleSubmit = () => {
    const valid = doValidation();
    if (valid) {
      setActionLoading(true);
      if (!isEdit) {
        const newChapter = {
          id: id,
          name: chapterName,
          bookId: bookId,
          created: moment().utc().format(),
          updated: moment().utc().format(),
        };
        createChapter(newChapter)
          .then(() => {
            setChapters([...chapters, newChapter]);
            setActionLoading(false);
            setConfirmDlg(false);
            TagManager.dataLayer({
              dataLayer: {
                event: 'newChapterCreated',
                eventProps: {
                  name: chapterName,
                  bookId: bookId,
                },
              },
            });
          })
          .catch(() => {
            setConfirmDlg(false);
            setActionLoading(false);
          });
      } else {
        editChapter({ id: id, name: chapterName, bookId: bookId })
          .then(() => {
            setActionLoading(false);
            setConfirmDlg(false);
            setChapters([
              ...chapters.map((item) => {
                if (item.id === id) return { ...item, name: chapterName };
                else return item;
              }),
            ]);
          })
          .catch(() => {
            setActionLoading(false);
            setConfirmDlg(false);
          });
      }
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
    if (!newExpanded) setStoryExpandedId(false);
  };
  const clickCreateChapter = () => {
    setId(uuidv4());
    setChapterName('');
    setIsEdit(false);
    setConfirmDlg(true);
  };
  const clickEditChapter = (chapterId, selectedChapterName) => {
    setId(chapterId);
    setChapterName(selectedChapterName);
    setIsEdit(true);
    setConfirmDlg(true);
  };
  const clickDeleteChapter = () => {
    setActionLoading(true);
    deleteChapter(id)
      .then(() => {
        setConfirmDlg(false);
        setDeleteConfirmDlg(false);
        setChapters([...chapters.filter((item) => item.id !== id)]);
        setActionLoading(false);
      })
      .catch(() => {
        console.log('Delete chapter failed');
        setActionLoading(false);
      });
  };

  return (
    <>
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
              Chapters
            </Typography>
          </Grid>
          <Grid item className={classes.content}>
            {isLoading ? (
              <Grid item container justify="center">
                <CircularProgress />
              </Grid>
            ) : (
              <>
                {chapters &&
                  chapters.map((item, index) => {
                    if (item) {
                      return (
                        <Accordion
                          panelId={`panel_chapter_${item.id}`}
                          key={index}
                          expanded={expanded}
                          handleChange={handleChange}
                          summary={`Chapter ${index + 1}: ${item.name}`}
                          button={
                            userStore.authUser && userStore.authUser.type === 'admin' ? (
                              <IconButton
                                aria-label="edit"
                                onClick={() => clickEditChapter(item.id, item.name)}
                              >
                                <EditIcon />
                              </IconButton>
                            ) : null
                          }
                        >
                          {`panel_chapter_${item.id}` === expanded && (
                            <StoryPanel
                              bookId={bookId}
                              chapterId={item.id}
                              expandedId={storyExpandedId}
                              setExpandedId={setStoryExpandedId}
                            />
                          )}
                        </Accordion>
                      );
                    }
                  })}
              </>
            )}
          </Grid>
          {userStore.authUser && userStore.authUser.type === 'admin' && (
            <FloatingBtnContainer>
              <FloatingButton
                variant="contained"
                color="secondary"
                data-testid="btn-createNewChapter"
                startIcon={<AddIcon />}
                onClick={() => clickCreateChapter()}
              >
                CREATE A CHAPTER
              </FloatingButton>
            </FloatingBtnContainer>
          )}
        </Grid>
      </Grid>
      <Modal
        open={confirmDlg}
        onClose={handleCloseConfirmDlg}
        title={isEdit ? 'Edit a chapter' : 'Create a chapter'}
        data-testid="modal-confirm"
      >
        <Grid container justify={'center'}>
          <Grid item container justify="center" className={classes.form} spacing={3}>
            <Grid item xs={12}>
              <TextField
                data-testid="textfield-ChapterName"
                variant="outlined"
                name="chaptername"
                fullWidth
                value={chapterName}
                error={!!errors.name}
                helperText={!!errors.name && errors.name.message}
                label="Chapter Name*"
                placeholder="Chapter Name"
                onChange={(e) => setChapterName(e.target.value)}
                title=""
              />
            </Grid>
            <Grid item container justify="center">
              <Button
                variant="contained"
                color="secondary"
                className={classes.formBtn}
                data-testid="btn-confirm"
                onClick={handleSubmit}
                title=""
              >
                {isEdit ? 'UPDATE' : 'CREATE'}
              </Button>
            </Grid>
            {isEdit ? (
              <Grid item container justify="center">
                <MUILink
                  component="button"
                  onClick={() => setDeleteConfirmDlg(true)}
                  color="error"
                  title=""
                >
                  DELETE
                </MUILink>
              </Grid>
            ) : (
              <Grid item container justify="center">
                <MUILink
                  component="button"
                  onClick={() => setConfirmDlg(false)}
                  color="error"
                  title=""
                >
                  CANCEL
                </MUILink>
              </Grid>
            )}
          </Grid>
          {isActionLoading && <LoadingOverlay />}
        </Grid>
      </Modal>

      <Modal
        open={deleteConfirmDlg}
        onClose={() => {
          setDeleteConfirmDlg(false);
        }}
        data-testid="modal-permanently-delete-confirm"
      >
        <Grid container justify={'center'}>
          <Grid item container direction="column" spacing={6}>
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="h3"
                color="primary"
                className={classes.contentTitle}
              >
                Do you want to permanently delete the chapter?
              </Typography>
            </Grid>
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className={classes.formBtn}
                onClick={() => setDeleteConfirmDlg(false)}
              >
                BACK
              </Button>
            </Grid>
            <Grid item xs={12} align="center">
              <MUILink
                component="button"
                onClick={() => clickDeleteChapter()}
                data-testid="btn-confirm"
                color="error"
              >
                PERMANENT DELETE
              </MUILink>
            </Grid>
          </Grid>
          {isActionLoading && <LoadingOverlay />}
        </Grid>
      </Modal>
    </>
  );
};
