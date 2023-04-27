import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
const styles = theme => ({
    root: {
        padding: '15px 24px',
        borderRadius: '50rem'
    }
})

export default withStyles(styles)(Button);