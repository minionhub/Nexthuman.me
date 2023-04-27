import React from 'react';
import withWidth from '@material-ui/core/withWidth';
import Fab from '@material-ui/core/Fab';

function FabButton(props) {
  return (
    <Fab {...props} variant="extended">
      {props.icon}
      {props.children}
    </Fab>
  );
}
export default withWidth()(FabButton);
