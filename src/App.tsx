import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Tab, Menu, Checkbox } from 'semantic-ui-react';
import { BrowserRouter, Switch, NavLink, Route, Redirect } from 'react-router-dom';
import Register from 'Register';
import { checkAuth, getLogout } from 'Database';
import ErrorPage from 'ErrorPage';
import Stats from './Stats';
import Logs from './Logs';
import Programs from './Programs';
import Login from './Login';
import { WeightUnitContext } from './Context';
import './index.css';

const panes = [
  {
    menuItem: {
      as: NavLink,
      id: 'Stats',
      content: 'Stats',
      to: '/stats',
      key: 'stats',
    },
    pane: (
      <Route
        key="stats"
        path="/stats"
        render={() => (
          <Tab.Pane attached={false}>
            <Stats />
          </Tab.Pane>
        )}
      />
    ),
  },

  {
    menuItem: {
      as: NavLink,
      id: 'Logs',
      content: 'Logs',
      to: '/logs',
      key: 'Logs',
    },
    pane: (
      <Route
        key="logs"
        path="/logs"
        render={() => (
          <Tab.Pane attached={false}>
            <Logs />
          </Tab.Pane>
        )}
      />
    ),
  },

  {
    menuItem: {
      as: NavLink,
      id: 'Programs',
      content: 'Programs',
      to: '/programs',
      key: 'Programs',
    },
    pane: (
      <Route
        key="programs"
        path="/programs"
        render={() => (
          <Tab.Pane attached={false}>
            <Programs />
          </Tab.Pane>
        )}
      />
    ),
  },
];

function TopMenu(): ReactElement {
  const weightUnit = useContext(WeightUnitContext);

  return (
    <Menu id="topbar" style={{ zIndex: 1, width: '100vw', position: 'fixed', top: 0, left: 0, margin: 0 }}>
      <Menu.Item onClick={getLogout}>Sign Out</Menu.Item>
      <Menu.Item>
        <Checkbox
          toggle
          onChange={(event, data) => {
            weightUnit.setWeightUnit(data.checked ? 'kg' : 'lb');
          }}
          defaultChecked={weightUnit.weightUnit === 'kg'}
          id="weight"
        />
      </Menu.Item>
    </Menu>
  );
}

function Website(): ReactElement {
  const [auth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    checkAuth().then((res) => setAuth(res));
  }, []);

  return (
    <BrowserRouter>
      <TopMenu />
      <Switch>
        {auth ? (
          <>
            <Tab renderActiveOnly={false} activeIndex={-1} menu={{ secondary: true, pointing: true }} panes={panes} />
          </>
        ) : (
          <>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Redirect to="/login" />
            </Route>
          </>
        )}
        <Route path="/error">
          <ErrorPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Website;
