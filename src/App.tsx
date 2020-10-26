import React, { ReactElement } from 'react';
import './App.css';
import { Tab } from 'semantic-ui-react';
import { BrowserRouter, Switch, NavLink, Route } from 'react-router-dom';
import Stats from './Stats';
import Settings from './Settings';
import Logs from './Logs';
import Programs from './Programs';

const panes = [
  {
    menuItem: {
      as: NavLink,
      id: 'Stats',
      content: 'Stats',
      to: '/stats',
      exact: true,
      key: 'stats',
    },
    pane: (
      <Route
        path="/stats"
        exact
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
      exact: true,
      key: 'Logs',
    },
    pane: (
      <Route
        path="/logs"
        exact
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
      id: 'Settings',
      content: 'Settings',
      to: '/settings',
      exact: true,
      key: 'Settings',
    },
    pane: (
      <Route
        path="/settings"
        exact
        render={() => (
          <Tab.Pane attached={false}>
            <Settings />
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
      exact: true,
      key: 'Programs',
    },
    pane: (
      <Route
        path="/programs"
        exact
        render={() => (
          <Tab.Pane attached={false}>
            <Programs />
          </Tab.Pane>
        )}
      />
    ),
  },
];

function TabExampleSecondaryPointing(): ReactElement {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Tab renderActiveOnly={false} activeIndex={-1} menu={{ secondary: true, pointing: true }} panes={panes} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default TabExampleSecondaryPointing;
