import React, { useState, useRef, useEffect, createRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Grid, Container, Box } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles({
  root: {
    marginTop: 60,
    marginBottom: 60,
    maxWidth: 1120,
    fontFamily: '',
  },
  title: {
    fontSize: 34,
  },
  termsList: {
    background: '#FAFAFA',
    padding: '22px 32px',
    height: '100%',
    color: '#283C63',
    width: '100%',
  },
  termsContent: {
    fontSize: 17,
    color: '#000',
  },
});

export default (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const dataOrigin = [
    {
      name: 'Terms',
      children: [
        {
          name: 'Term one',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae eros quam. Duis molestie mi non ante dictum vulputate. Nunc vehicula sapien sit amet velit tempus fringilla. Morbi fermentum vehicula enim, in ultricies nulla suscipit eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam faucibus diam ac sapien rutrum, sed molestie purus cursus. Etiam at nisi quis neque interdum varius a a massa. Mauris gravida porta consequat. Aenean in dolor bibendum, porttitor lacus non, sodales ex. Nunc ultricies ex sed posuere imperdiet. Vestibulum et odio et ligula fringilla imperdiet sed id nisi.',
          children: [
            {
              name: 'Term one',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae eros quam. Duis molestie mi non ante dictum vulputate. Nunc vehicula sapien sit amet velit tempus fringilla. Morbi fermentum vehicula enim, in ultricies nulla suscipit eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam faucibus diam ac sapien rutrum, sed molestie purus cursus. Etiam at nisi quis neque interdum varius a a massa. Mauris gravida porta consequat. Aenean in dolor bibendum, porttitor lacus non, sodales ex. Nunc ultricies ex sed posuere imperdiet. Vestibulum et odio et ligula fringilla imperdiet sed id nisi.',
            },
            {
              name: 'Term two',
              content:
                'Nulla non laoreet augue, a dapibus urna. Fusce interdum arcu efficitur justo scelerisque vestibulum. Proin faucibus sagittis leo, volutpat varius tortor mollis eu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula fermentum libero, eget pulvinar arcu ultrices a. Vestibulum est ante, volutpat posuere odio sed, mattis fringilla tellus. Maecenas congue, lacus a interdum vestibulum, libero ipsum rhoncus justo, et viverra velit erat nec lectus. Etiam hendrerit leo elit, id viverra orci vehicula ut. Suspendisse porttitor vitae odio dignissim pulvinar. Sed vitae leo nisi. Mauris lorem nibh, ullamcorper ac vulputate quis, porta sed elit. Donec et viverra justo. Sed pharetra nulla nec nibh porta tristique. Integer iaculis blandit faucibus.',
            },
            {
              name: 'Term three',
              content:
                'Sed mauris velit, sodales aliquet ante eget, commodo fringilla nisi. Duis dignissim felis nibh. Curabitur at finibus lectus, et maximus metus. Quisque hendrerit mattis enim quis eleifend. Aenean suscipit, metus vulputate malesuada maximus, metus justo ullamcorper nulla, sed lacinia lectus libero vitae diam. Vivamus sollicitudin dui ante, sed faucibus justo dictum sed. Curabitur nec diam convallis, dapibus risus in, tristique odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque id finibus ex. Nullam venenatis, ex ac luctus molestie, sapien mauris gravida quam, non porttitor metus metus nec eros. Nam sit amet sapien consectetur, cursus nisl et, pretium tellus.',
            },
          ],
        },
        {
          name: 'Term two',
          content:
            'Nulla non laoreet augue, a dapibus urna. Fusce interdum arcu efficitur justo scelerisque vestibulum. Proin faucibus sagittis leo, volutpat varius tortor mollis eu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula fermentum libero, eget pulvinar arcu ultrices a. Vestibulum est ante, volutpat posuere odio sed, mattis fringilla tellus. Maecenas congue, lacus a interdum vestibulum, libero ipsum rhoncus justo, et viverra velit erat nec lectus. Etiam hendrerit leo elit, id viverra orci vehicula ut. Suspendisse porttitor vitae odio dignissim pulvinar. Sed vitae leo nisi. Mauris lorem nibh, ullamcorper ac vulputate quis, porta sed elit. Donec et viverra justo. Sed pharetra nulla nec nibh porta tristique. Integer iaculis blandit faucibus.',
        },
        {
          name: 'Term three',
          content:
            'Sed mauris velit, sodales aliquet ante eget, commodo fringilla nisi. Duis dignissim felis nibh. Curabitur at finibus lectus, et maximus metus. Quisque hendrerit mattis enim quis eleifend. Aenean suscipit, metus vulputate malesuada maximus, metus justo ullamcorper nulla, sed lacinia lectus libero vitae diam. Vivamus sollicitudin dui ante, sed faucibus justo dictum sed. Curabitur nec diam convallis, dapibus risus in, tristique odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque id finibus ex. Nullam venenatis, ex ac luctus molestie, sapien mauris gravida quam, non porttitor metus metus nec eros. Nam sit amet sapien consectetur, cursus nisl et, pretium tellus.',
        },
      ],
    },
    {
      name: 'Conditions',
      children: [
        {
          name: 'Condition one',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae eros quam. Duis molestie mi non ante dictum vulputate. Nunc vehicula sapien sit amet velit tempus fringilla. Morbi fermentum vehicula enim, in ultricies nulla suscipit eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam faucibus diam ac sapien rutrum, sed molestie purus cursus. Etiam at nisi quis neque interdum varius a a massa. Mauris gravida porta consequat. Aenean in dolor bibendum, porttitor lacus non, sodales ex. Nunc ultricies ex sed posuere imperdiet. Vestibulum et odio et ligula fringilla imperdiet sed id nisi.',
        },
        {
          name: 'Condition two',
          content:
            'Nulla non laoreet augue, a dapibus urna. Fusce interdum arcu efficitur justo scelerisque vestibulum. Proin faucibus sagittis leo, volutpat varius tortor mollis eu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula fermentum libero, eget pulvinar arcu ultrices a. Vestibulum est ante, volutpat posuere odio sed, mattis fringilla tellus. Maecenas congue, lacus a interdum vestibulum, libero ipsum rhoncus justo, et viverra velit erat nec lectus. Etiam hendrerit leo elit, id viverra orci vehicula ut. Suspendisse porttitor vitae odio dignissim pulvinar. Sed vitae leo nisi. Mauris lorem nibh, ullamcorper ac vulputate quis, porta sed elit. Donec et viverra justo. Sed pharetra nulla nec nibh porta tristique. Integer iaculis blandit faucibus.',
        },
        {
          name: 'Condition three',
          content:
            'Sed mauris velit, sodales aliquet ante eget, commodo fringilla nisi. Duis dignissim felis nibh. Curabitur at finibus lectus, et maximus metus. Quisque hendrerit mattis enim quis eleifend. Aenean suscipit, metus vulputate malesuada maximus, metus justo ullamcorper nulla, sed lacinia lectus libero vitae diam. Vivamus sollicitudin dui ante, sed faucibus justo dictum sed. Curabitur nec diam convallis, dapibus risus in, tristique odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque id finibus ex. Nullam venenatis, ex ac luctus molestie, sapien mauris gravida quam, non porttitor metus metus nec eros. Nam sit amet sapien consectetur, cursus nisl et, pretium tellus.',
        },
      ],
    },
  ];

  const setLinearId = (data, endId) => {
    let startId = typeof endId != 'undefined' ? endId + 1 : 0;
    for (let i = 0; i < data.length; i++) {
      data[i].linearId = startId;
      if (data[i].children) {
        startId = setLinearId(data[i].children, startId);
      } else startId += 1;
    }
    return startId;
  };

  const count = setLinearId(dataOrigin);
  let refs = [];
  for (let i = 0; i < count; i++) {
    refs.push(createRef());
  }

  const myRef = useRef(refs);
  const [list, setList] = useState(null);

  const executeScroll = (linearId) => {
    myRef.current[linearId].current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!list) {
      setLinearId(dataOrigin);
      setList(dataOrigin);
    }
  });

  const TCList = ({ data, prefix }) => {
    let depth = prefix ? prefix.split('.').length : 0;
    let _prefix = prefix ? prefix + '.' : '';
    let sep = depth == 0 ? '.' : '';
    return (
      <List component="nav" style={prefix ? {} : { position: 'sticky', top: 0 }}>
        {data.map((item, index) => (
          <React.Fragment key={`iam-${_prefix}${index + 1}`}>
            <ListItem
              button
              style={{ paddingLeft: depth * 30 }}
              onClick={() => executeScroll(item.linearId)}
            >
              <ListItemText primary={`${_prefix}${index + 1}${sep} ${item.name}`} />
            </ListItem>
            {item.children && (
              <Collapse in={true}>
                <TCList data={item.children} prefix={`${_prefix}${index + 1}`} />
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    );
  };

  const TCContent = ({ data, prefix }) => {
    let depth = prefix ? prefix.split('.').length : 0;
    let _prefix = prefix ? prefix + '.' : '';
    let sep = depth == 0 ? '.' : '';
    return data.map((item, index) => (
      <React.Fragment key={`ibm-${_prefix}${index + 1}`}>
        <Typography
          ref={myRef.current[item.linearId]}
          style={{ marginBottom: 30, fontSize: 24 - depth * 3, fontWeight: 600 }}
        >{`${_prefix}${index + 1}${sep} ${item.name}`}</Typography>
        {item.content && <Typography style={{ marginBottom: 30 }}>{item.content}</Typography>}
        {item.children && <TCContent data={item.children} prefix={`${_prefix}${index + 1}`} />}
      </React.Fragment>
    ));
  };

  return (
    <Container className={classes.root}>
      <Box style={{ marginBottom: 40 }}>
        <Typography color="primary" className={classes.title}>
          Terms & Conditions
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item md={4} sm={12} xs={12}>
          <Box className={classes.termsList}>{list && <TCList data={list} />}</Box>
        </Grid>
        <Grid item md={8} sm={12} xs={12}>
          <Box className={classes.termsText}>{list && <TCContent data={list} />}</Box>
        </Grid>
      </Grid>
    </Container>
  );
};
