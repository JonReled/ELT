import React from 'react';

interface LogStatsContextProps {
  stats: any[];
  setStats: React.Dispatch<React.SetStateAction<any>>;
}

interface ClickedDayContextProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<any>>;
}

interface StandardTypeContextProps {
  type: string;
  setType: React.Dispatch<React.SetStateAction<any>>;
}

interface NewProgramContextProps {
  program: any[];
  setProgram: React.Dispatch<React.SetStateAction<any>>;
}

export const LogStatsContext = React.createContext<LogStatsContextProps>({
  stats: [],
  setStats: () => null,
});

export const ClickedDayContext = React.createContext<ClickedDayContextProps>({
  date: new Date(),
  setDate: () => null,
});

export const StandardTypeContext = React.createContext<StandardTypeContextProps>({
  type: 'Estimated Level',
  setType: () => null,
});

export const NewProgramContext = React.createContext<NewProgramContextProps>({
  program: [],
  setProgram: () => null,
});
