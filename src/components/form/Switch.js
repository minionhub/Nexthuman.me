
import React from 'react';
import { withStyles, Switch } from '@material-ui/core';
import theme from '../../theme';

export default withStyles({
	switchBase: {
	  color: '#BDBDBD',
	  '&$checked': {
		color: theme.palette.additional,
	  },
	  '&$checked + $track': {
		backgroundColor: theme.palette.additional,
	  },
	},
	checked: {},
	track: {},
  })(Switch);