export function getTranslatedEventName(name: string, t: any) {
    const key = `activities.${name.toLowerCase().replace(/\s+/g, '_')}`;
    return t(key, name);
};

export function getTranslatedCompetitionName(name: string, t: any) {
    const key = `competitions.${name.toLowerCase().replace(/\s+/g, '_')}`;
    return t(key, name);
}