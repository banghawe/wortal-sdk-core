/**
 * AddictingGames SDK interface
 * @hidden
 */
export interface AddictingGamesSDK {
    on(event: string, callback: () => void): void;
    getInstance(options: object): AddictingGamesSDK;
    startSession(): Promise<void>;
    startGame(): Promise<void>;
    endGame(options: object): Promise<void>;
    showAd(): Promise<void>;
    getScoreCategories(): Promise<object>;
    getScores(options: object): Promise<object>;
    postScore(options: object): Promise<object>;
    postDailyScore(options: object): Promise<object>;
    hasDailyScore(options: object): Promise<object>;
    getAchievementCategories(): Promise<object>;
    postAchievement(options: object): Promise<object>;
    getUserAchievements(options: object): Promise<object>;
    postDatastore(options: object): Promise<object>;
    getUserDatastore(options: object): Promise<object>;
}
