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

export async function getChampionshipStandings(competitionId?: number): Promise<ChampionshipStanding[]> {
    const params = competitionId ? { competitionId } : {};
    const response = await axios.get<ChampionshipStanding[]>("/championship/standings", { params });
    return response.data;
}
