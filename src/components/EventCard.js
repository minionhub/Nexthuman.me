import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';
import StarIcon from '@material-ui/icons/Star';

import dateUtils from '../utils/date';
import { capitalize } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
  },
  header: {
    height: 177,
    minHeight: 177,
    position: 'relative',
    padding: '8px 12px',
    [theme.breakpoints.down('sm')]: {
      padding: '12px 8px',
    },
  },
  body: {
    width: '100%',
    padding: 12,
    [theme.breakpoints.down('sm')]: {
      padding: '12px 8px',
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
  price: {
    position: 'relative',
    color: '#fff',
    marginBottom: 5,
    fontSize: 24,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
  },
  date: {
    position: 'relative',
    color: '#fff',
    fontSize: 12,
    fontWeight: 300,
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      width: '50%',
    },
  },
  capacity: {
    position: 'relative',
    color: '#fff',
    fontSize: 12,
    fontWeight: 300,
  },
  experiences: {
    marginTop: 10,
    overflow: 'hidden',
    fontSize: 10,
    height: 84,
    width: '100%',
    alignContent: 'flex-start',
  },
  experience: {
    background: 'rgba(33, 33, 33, 0.04)',
    fontSize: 10,
    color: '#333',
    margin: 2,
    textTransform: 'capitalize',
    '& .MuiChip-label': {
      fontSize: 12,
    },
  },
  title: {
    marginBottom: 6,
    color: '#283C63',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: 18,
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 14,
    color: '#6A2C70',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const DEFAULT_COVER_IMAGE =
  'https://images.squarespace-cdn.com/content/v1/551dabf6e4b008920a354e82/1452714433264-6T39HAD2T42VF3JG7U6Z/ke17ZwdGBToddI8pDm48kMUW853eF0JL6ooZqMQl0TEUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcBT4_6C-oPlXEmdkc_QKpzD5vE2TZB1uAoZtbWfS3iPUVbK0u-K9mznXgIgdDqg7W/event+booking+background.jpg?format=2500w';

export default ({ event, onClick, ...props }) => {
  const classes = useStyles({ theme: useTheme() });
  const {
    title,
    subtitle,
    experiences = [],
    price: { value: priceValue = 0, currency = 'SEK' } = {},
    coverImage: { src: coverImageSrc = DEFAULT_COVER_IMAGE } = {},
    capacity = 0,
    sold = 0,
  } = event;

  const handleClick = () => {
    onClick && onClick(event);
  };

  return (
    <Card className={classes.root} variant="outlined" {...props}>
      <CardActionArea className={classes.content} onClick={handleClick}>
        <Grid className={classes.header} container direction="column" justify="flex-end">
          <CardMedia className={classes.media} title={title} image={coverImageSrc}>
            <div className={classes.mediaOverlay} />
          </CardMedia>
          <Typography className={classes.price} variant="h5" align="right">
            {priceValue}&nbsp;
            {currency}
          </Typography>
          <Grid container justify="space-between" wrap="nowrap">
            <Typography className={classes.date} variant="subtitle2">
              {dateUtils.formatRange({ from: event.from, to: event.to })}
            </Typography>
            <Typography className={classes.capacity} variant="subtitle2">
              Ticket: {capacity - (sold || 0)}/{capacity}
            </Typography>
          </Grid>
        </Grid>
        <CardContent className={classes.body}>
          <Typography className={classes.title} variant="subtitle1" color="primary">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="secondary" className={classes.subtitle}>
            {subtitle}
          </Typography>
          <Grid className={classes.experiences} container wrap="wrap">
            {experiences &&
              Object.values(experiences).map((exp) => (
                <Chip
                  className={classes.experience}
                  icon={<StarIcon style={{ color: '#F2994A', width: 13 }} />}
                  key={exp}
                  size="small"
                  label={exp}
                />
              ))}
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
