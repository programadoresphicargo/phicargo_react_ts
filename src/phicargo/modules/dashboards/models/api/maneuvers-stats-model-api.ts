export interface ManeuverStateCountApi {
  maneuvers_count: number;
  state: string;
}

export interface ManeuversDriverJobCountApi {
  driver: string;
  total_maneuvers: number;
  maneuvers_late: number;
  maneuvers_on_time: number;
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
