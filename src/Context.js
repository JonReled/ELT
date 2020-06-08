import React from 'react';

export const LogStatsContext = React.createContext([{}, () => {}]);

export const ClickedDayContext = React.createContext([new Date(), () => {}]);

export const StandardTypeContext = React.createContext(['Estimated Level', () => {}]);
