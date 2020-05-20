import React from 'react';
import './App.css';
import './semantic/dist/semantic.css';
import { Tab } from 'semantic-ui-react'
import Stats from './StatsTab/Stats';
import Settings from './SettingsTab/Settings';
import Logs from './LogsTab/Logs';

const panes = [
  {
    menuItem: 'Stats',
    render: () => <Tab.Pane attached={false}><Stats /></Tab.Pane>,
  },
  {
    menuItem: 'Logs',
    render: () => <Tab.Pane attached={false}><Logs /></Tab.Pane>,
  },
  {
    menuItem: 'Settings',
    render: () => <Tab.Pane attached={false}><Settings /></Tab.Pane>,
  },
]

const TabExampleSecondaryPointing = () => (
  <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
)

export default TabExampleSecondaryPointing