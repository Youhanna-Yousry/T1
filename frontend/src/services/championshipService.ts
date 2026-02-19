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

export async function getChampionshipDriversStandings(competitionId?: number): Promise<ChampionshipResponse> {
    const params = competitionId ? { competitionId } : {};
    const response = await axios.get<ChampionshipResponse>("/championship/standings/drivers", { params });
    return response.data;
}