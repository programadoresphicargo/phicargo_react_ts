export interface ManeuverStateCountApi {
  maneuvers_count: number;
  state: string;
}

export interface ManeuversDriverJobCountApi {
  driver: string;
  maneuvers_count: number;
}

export interface ManeuversTerminalCountApi {
  maneuvers_count: number;
  terminal: string;
}

export interface ManeuverStatsApi {
  maneuvers_late: ManeuverStateCountApi[];
  maneuvers_by_operator: ManeuversDriverJobCountApi[];
  maneuvers_by_mover: ManeuversDriverJobCountApi[];
  maneuvers_by_terminal: ManeuversTerminalCountApi[];
}
