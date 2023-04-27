import React from 'react';
import Chip from '@material-ui/core/Chip';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
export default ({ experiences, spacing = 0 }) => {
  return (
    <Grid container spacing={spacing}>
      {experiences &&
        experiences.map((experience, idx) => {
          return (
            <Grid item key={idx}>
              <Chip
                icon={<StarIcon style={{ fill: '#F2994A' }} />}
                label={experience.name}
                key={experience.id}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};
