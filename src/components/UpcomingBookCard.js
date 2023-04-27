import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, Box } from '@material-ui/core';
import MUILink from '@material-ui/core/Link';

const useStyles = makeStyles((theme, book) => ({
  root: {
    width: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  },
  coverImg: {
    paddingTop: '139.21%',
    backgroundSize: 'cover',
    backgroundPositionY: 'center',
    backgroundPositionX: 'center',
    position: 'relative',
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
  bookInfo: {
    padding: '18px 12px',
    overflow: 'hidden',
  },
  bookTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  body3: {
    display: 'block',
    fontFamily: 'Lato',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    letterSpacing: '0.25px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  body2: {
    fontFamily: 'Lato',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '18px',
    letterSpacing: '0.25px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: '14px',
    },
  },
  title: {
    fontFamily: 'Fira Sans',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px',
      lineHeight: '19px',
    },
  },
  description: {
    overflow: 'hidden',
    height: '110px',
    '& p': {
      padding: 0,
      margin: 0,
    },
  },
}));

// const DEFAULT_COVER_IMAGE =
//   'https://images.squarespace-cdn.com/content/v1/551dabf6e4b008920a354e82/1452714433264-6T39HAD2T42VF3JG7U6Z/ke17ZwdGBToddI8pDm48kMUW853eF0JL6ooZqMQl0TEUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcBT4_6C-oPlXEmdkc_QKpzD5vE2TZB1uAoZtbWfS3iPUVbK0u-K9mznXgIgdDqg7W/event+booking+background.jpg?format=2500w';

export default (props) => {
  const classes = useStyles({ ...props, theme: useTheme() });
  const { bookname, subtitle, description } = props.book;

  const { book, openBook } = props;
  const coverImageSrc = book.coverImage.src || '';

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      onClick={() => {
        openBook(book.id);
      }}
    >
      <Grid item className={classes.coverImg} style={{ backgroundImage: `url(${coverImageSrc})` }}>
        <Box className={classes.mediaOverlay} />
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems={'flex-start'}
        className={classes.bookInfo}
        spacing={1}
      >
        <Grid item xs={12}>
          <Typography className={classes.bookTitle} color="primary" variant="h6">
            {bookname}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MUILink className={classes.body3} color="secondary">
            {subtitle}
          </MUILink>
        </Grid>
        <Grid item xs={12}>
          <Box
            className={classes.description}
            dangerouslySetInnerHTML={{ __html: description }}
          ></Box>
        </Grid>
      </Grid>
    </Grid>
  );
};
