import { Switch, Route } from 'react-router-dom';
import React from 'react';
import AuthCallback from './AuthCallback';
import contxtSDK from '../services/ContxtService.js';

export function withAuth(WrappedComponent, history) {
  return class extends React.Component {
    static displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

    constructor(props) {
      super();
      this.handleAuthentication = this.handleAuthentication.bind(this);
    }

    handleAuthentication(nextState) {
      if (/access_token|id_token|error/.test(nextState.location.hash)) {
        contxtSDK.auth.handleAuthentication();
      }
    }

    render() {
      return (
        <Switch>
          <Route path="/callback" render={(props) => {
            this.handleAuthentication(props);
            return <AuthCallback {...props} label="Signing you in"/>;
          }}/>
          <Route {...this.props} render={(props) => {
            if (contxtSDK.auth.isAuthenticated()) {
              return <WrappedComponent auth={contxtSDK.auth}/>;
            } else {
              // Capture current location so we can return user to correct page after login.
              localStorage.setItem('redirect_pathname', props.location.pathname);
              contxtSDK.auth.logIn();
              return null;
            }
          }}/>
        </Switch>
      );
    }
  };
}
