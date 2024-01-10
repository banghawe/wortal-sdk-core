import { API_ENDPOINTS } from '../data/core-data'

export interface SaveData<T> {
    save_data: T;
    timestamp: number;
}

/**
 * To fetch game save data from wortal waves using xsolla token and game ID.
 * @param token Xsolla JWT token to identify the player
 * @param gameId game ID to fetch save data from
 * @returns save data object with save_data payload and timestamp
 */
export async function fetchSaveData<T=any>(token: string, gameId: number): Promise<SaveData<T>> {
    // GET /api/v1/waves/{gameId}
    const response = await fetch(
        `${API_ENDPOINTS.WAVES_API_BASE_URL}${gameId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch save data: ${response.statusText}`);
    }

    return await response.json() as SaveData<T>;
}

/**
 * To save game save data to wortal waves using xsolla token and game ID.
 * @param token Xsolla JWT token to identify the player
 * @param gameId game ID to save data to
 * @param payload data to save
 * @returns saved data object with save_data payload and timestamp
 */
export async function postSaveData<T=any>(token: string, gameId: number, payload: T): Promise<SaveData<T>> {
    // POST /api/v1/waves/{gameId}
    const response = await fetch(
        `${API_ENDPOINTS.WAVES_API_BASE_URL}${gameId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch save data: ${response.statusText}`);
    }

    return await response.json() as SaveData<T>;
}

/**
 * To save partial game save data to wortal waves using xsolla token and game ID.
 * @param token Xsolla JWT token to identify the player
 * @param gameId game ID to save data to
 * @param payload partial data to save
 * @returns saved data object with save_data payload and timestamp
 */
export async function patchSaveData<T=any>(token: string, gameId: number, payload: Partial<T>): Promise<SaveData<T>> {
    // PATCH /api/v1/waves/{gameId}
    const response = await fetch(
        `${API_ENDPOINTS.WAVES_API_BASE_URL}${gameId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch save data: ${response.statusText}`);
    }

    return await response.json() as SaveData<T>;
}
