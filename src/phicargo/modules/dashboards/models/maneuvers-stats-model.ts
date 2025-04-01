export interface ManeuverStateCount {
  maneuversCount: number;
  state: string;
}

export interface ManeuversDriverJobCount {
  driver: string;
  totalManeuvers: number;
  maneuversLate: number;
  maneuversOnTime: number;
}

export interface ManeuversTerminalCount {
  maneuversCount: number;
  terminal: string;
}

export interface ManeuverStats {
  maneuversLate: ManeuverStateCount[];
  maneuversByOperator: ManeuversDriverJobCount[];
  maneuversByMover: ManeuversDriverJobCount[];
  maneuversByTerminal: ManeuversTerminalCount[];
}
