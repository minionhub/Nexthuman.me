import React from 'react';
import Grid from '@material-ui/core/Grid';
import ProducerCard from './ProducerCard';

export default ({ characters, spacing = 0 }) => {
  return (
    <Grid container spacing={spacing}>
      {characters &&
        characters.map((character) => {
          return (
            <Grid item key={character.id}>
              <ProducerCard
                id={character.id}
                photo={character.avatar}
                name={character.name}
                designation={character.tagline}
                isClickable={true}
              />
            </Grid>
          );
        })}
    </Grid>
  );
};
