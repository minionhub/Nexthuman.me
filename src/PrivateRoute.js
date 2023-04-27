import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from './session/Auth';
import Root from './pages/Root';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import configStripe from './constants/stripe.json';

const stripe = loadStripe(configStripe.publishable);

const PrivateRoute = ({ component: Component, payment, ...otherProps }) => {
  const { authUser } = useContext(AuthContext);
  return (
    <Root>
      <Route
        {...otherProps}
        render={(props) =>
          authUser != null && authUser.emailVerified ? (
            payment ? (
              <Elements stripe={stripe}>
                <Component {...props} />
              </Elements>
            ) : (
              <Component {...props} />
            )
          ) : (
            <Redirect to={otherProps.redirectTo ? otherProps.redirectTo : '/sign_in'} />
          )
        }
      />
    </Root>
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
