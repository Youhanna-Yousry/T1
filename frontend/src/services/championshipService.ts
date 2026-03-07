import axios from "api/axios";

export interface ChampionshipStanding {
    rank: number;
    firstName: string;
    lastName: string;
    teamName: string;
    teamCode: string;
    teamColor: string;
    totalPoints: number;
}

export interface CompetitionSummary {
    name: string;
    year: number;
    status: string;
}

export interface ChampionshipResponse {
    competitionSummary: CompetitionSummary;
    standings: ChampionshipStanding[];
}

export interface WeekSummary {
    weekId: number;
    weekNumber: number;
    weekName: string;
}

export async function getChampionshipLeaderboard(competitionId?: number): Promise<ChampionshipResponse> {
    const params = competitionId ? { competitionId } : {};
    const response = await axios.get<ChampionshipResponse>("/championship/leaderboard/overall", { params });
    return response.data;
}

export async function getWeeklyLeaderboard(competitionId?: number, weekId?: number): Promise<ChampionshipResponse> {
    const params: Record<string, number> = {};
    if (competitionId) params.competitionId = competitionId;
    if (weekId) params.weekId = weekId;
    const response = await axios.get<ChampionshipResponse>("/championship/leaderboard/weekly", { params });
    return response.data;
}

export async function getFinishedRounds(competitionId?: number): Promise<WeekSummary[]> {
    const params = competitionId ? { competitionId } : {};
    const response = await axios.get<WeekSummary[]>("/championship/rounds/finished", { params });
    return response.data;
}