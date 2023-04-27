import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Accordion from './Accordion';
export default (props) => {
    const { accordions } = props;
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        console.log(panel);
        console.log(newExpanded);
        setExpanded(newExpanded ? panel : false);
    };
    return (
        <>
            {accordions.map((item, key) => {
                return (
                    <Accordion panelId={`panel${key+1}`} expanded={expanded} handleChange={handleChange} summary={`Chapter ${item.num}: ${item.name}`}>
                        {item.component}
                    </Accordion>
                )
            })}
        </>
    )
}