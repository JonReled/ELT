import React, { ReactElement } from 'react';
import './App.css';
import { Tab } from 'semantic-ui-react';
import Stats from './Stats';
import Settings from './Settings';
import Logs from './Logs';
import Programs from './Programs';

const panes = [
  {
    menuItem: 'Stats',

    render: () => (
      <Tab.Pane attached={false}>
        <Stats />
      </Tab.Pane>
    ),
  },

  {
    menuItem: 'Logs',

    render: () => (
      <Tab.Pane attached={false}>
        <Logs />
      </Tab.Pane>
    ),
  },

  {
    menuItem: 'Settings',

    render: () => (
      <Tab.Pane attached={false}>
        <Settings />
      </Tab.Pane>
    ),
  },

  {
    menuItem: 'Programs',

    render: () => (
      <Tab.Pane attached={false}>
        <Programs />
      </Tab.Pane>
    ),
  },
];

function TabExampleSecondaryPointing(): ReactElement {
  return (
    <div>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  );
}

export default TabExampleSecondaryPointing;
