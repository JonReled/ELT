import React from 'react';

interface LogStatsContextProps {
  stats: any;
  setStats: React.Dispatch<React.SetStateAction<any>>;
}

interface StandardTypeContextProps {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

interface NewProgramContextProps {
  program: any[];
  setProgram: React.Dispatch<React.SetStateAction<any>>;
}

interface WeightUnitContextProps {
  weightUnit: string;
  setWeightUnit: React.Dispatch<React.SetStateAction<string>>;
}

export const LogStatsContext = React.createContext<LogStatsContextProps>({
  stats: [],
  setStats: () => null,
});

export const StandardTypeContext = React.createContext<StandardTypeContextProps>({
  value: 'Estimated Level',
  set: () => null,
});

export const NewProgramContext = React.createContext<NewProgramContextProps>({
  program: [],
  setProgram: () => null,
});

export const WeightUnitContext = React.createContext<WeightUnitContextProps>({
  weightUnit: 'kg',
  setWeightUnit: () => null,
});
