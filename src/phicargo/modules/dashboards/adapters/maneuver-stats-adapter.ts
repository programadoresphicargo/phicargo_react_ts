import type {
  ManeuverStateCount,
  ManeuverStats,
  ManeuversDriverJobCount,
  ManeuversTerminalCount,
} from '../models/maneuvers-stats-model';
import type {
  ManeuverStateCountApi,
  ManeuverStatsApi,
  ManeuversDriverJobCountApi,
  ManeuversTerminalCountApi,
} from '../models/api/maneuvers-stats-model-api';

export class ManeuverStatsAdapter {
  static toManeuverStateCount(data: ManeuverStateCountApi): ManeuverStateCount {
    return {
      maneuversCount: data.maneuvers_count,
      state: data.state,
    };
  }

  static toManeuversDriverJobCount(
    data: ManeuversDriverJobCountApi,
  ): ManeuversDriverJobCount {
    return {
      driver: data.driver,
      totalManeuvers: data.total_maneuvers,
      maneuversLate: data.maneuvers_late,
      maneuversOnTime: data.maneuvers_on_time,
    };
  }

  static toManeuversTerminalCount(
    data: ManeuversTerminalCountApi,
  ): ManeuversTerminalCount {
    return {
      maneuversCount: data.maneuvers_count,
      terminal: data.terminal,
    };
  }

  static toManeuverStats(data: ManeuverStatsApi): ManeuverStats {
    return {
      maneuversLate: data.maneuvers_late.map((item) =>
        ManeuverStatsAdapter.toManeuverStateCount(item),
      ),
      maneuversByOperator: data.maneuvers_by_operator.map((item) =>
        ManeuverStatsAdapter.toManeuversDriverJobCount(item),
      ),
      maneuversByMover: data.maneuvers_by_mover.map((item) =>
        ManeuverStatsAdapter.toManeuversDriverJobCount(item),
      ),
      maneuversByTerminal: data.maneuvers_by_terminal.map((item) =>
        ManeuverStatsAdapter.toManeuversTerminalCount(item),
      ),
    };
  }
}

