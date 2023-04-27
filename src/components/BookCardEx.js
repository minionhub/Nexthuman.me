import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, Grid, Typography, Button } from '@material-ui/core';
import RoundButton from './form/RoundButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MUILink from '@material-ui/core/Link';
const useStyles = makeStyles(theme => ({
    root: {
        // height: '350px',
        width: '260px',
        [theme.breakpoints.down('sm')]: {
            width: '180px',
            // height: '270px',
        },
    },
    coverImg: {
        backgroundImage: props => props.background,
        backgroundSize: 'cover',
        backgroundPositionY: 'center',
        backgroundPositionX: 'center',
        position: 'relative',        
        width: '260px',
        height: '360px',
        [theme.breakpoints.down('sm')]: {
            height: '270px',
            width: '180px',
        },
    },
    description: {
        height: '200px',
        padding: '18px 12px'
    },
    body3: {
        fontFamily: 'Lato',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: '14px',
        letterSpacing: '0.25px',
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
    }
    
}))

export default (props) => {
    const classes = useStyles({...props, theme: useTheme() });
    const deeperDreams = (e) => {

    }

    return (
        <Card elevation={0}>
            <Grid container className={classes.root} direction="column" >
                <Grid item container className={classes.coverImg} >
                    
                </Grid>
                <Grid item container direction={'column'} alignItems={'flex-start'} className={classes.description} spacing={1}>
                    <Grid item><Typography color='primary' variant="h6">Countryside</Typography></Grid>
                    <Grid item><MUILink className={classes.body3} color='secondary'>Volutpat leo hendrerit</MUILink></Grid>
                    <Grid item>
                    <Typography className={classes.body2}>
                        Volutpat leo hendrerit potenti sodales  nisl augue morbi quisque Consectetur faucibus commodo eu ...
                    </Typography>
                    </Grid>
                   
                </Grid>
            </Grid>
        </Card>
        
    )  
};