import Database from 'better-sqlite3';
import db from '../db.js';
import axios from 'axios';
import logger from '../logger.js';

export function storeState(state: string): Database.RunResult {
    const currTime = new Date().toISOString();
    const stmt = db.prepare<[string, string], {state: string, createdAt: string}>(`INSERT INTO LineLoginState (state, createdAt) VALUES (?, ?)`);
    return stmt.run(state, currTime);
}

export function getState(state: string): {state: string, createdAt: string} | undefined {
    const stmt = db.prepare<string, {state: string, createdAt: string}>(`SELECT * FROM LineLoginState WHERE state = ?`);
    return stmt.get(state);
}

export function removeState(state: string): Database.RunResult {
    const stmt = db.prepare<string>(`DELETE FROM LineLoginState WHERE state = ?`);
    return stmt.run(state);
}

export const message = async(lineId: string, message: string): Promise<{
    success: boolean,
    message?: string,
    status?: number,
    error?: string
}> => {
    if (process.env.NODE_ENV === 'test') {
        // SHUT
        return { success: false, error: "Sending messages are disabled during testing." };
    }

    const access_token = process.env.LINE_MESSAGING_API_ACCESS_TOKEN;
    if (!access_token) {
        logger.error("LINE messaging failed: Missing LINE_MESSAGING_API_ACCESS_TOKEN");
        return { success: false, error: "Missing LINE_MESSAGING_API_ACCESS_TOKEN" };
    }
    try {
        const res = await axios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: lineId,
                messages: [
                    {
                        type: "text",
                        text: message
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        );
        return {
            success: true,
            message: "Message sent successfully",
            status: res.status
        };
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
        logger.error(`LINE messaging failed for lineId ${lineId}: ${errorMessage}`, {
            lineId,
            status: error?.response?.status,
            error: errorMessage
        });
        return {
            success: false,
            error: errorMessage,
            status: error?.response?.status
        };
    }
}

export const messageMany = async (
    lineIds: string[],
    message: string
): Promise<{
    success: boolean,
    message?: string,
    status?: number,
    error?: string
}> => {
    if (process.env.NODE_ENV === 'test') {
        return { success: false, error: "Sending messages are disabled during testing." };
    }

    if (!Array.isArray(lineIds) || lineIds.length === 0) {
        logger.error("LINE messaging failed: No lineIds provided");
        return { success: false, error: "No lineIds provided." };
    }
    if (typeof message !== "string" || message.trim() === "") {
        logger.error("LINE messaging failed: Message must be a non-empty string");
        return { success: false, error: "Message must be a non-empty string." };
    }

    const access_token = process.env.LINE_MESSAGING_API_ACCESS_TOKEN;
    if (!access_token) {
        logger.error("LINE messaging failed: Missing LINE_MESSAGING_API_ACCESS_TOKEN");
        return { success: false, error: "Missing LINE_MESSAGING_API_ACCESS_TOKEN" };
    }

    // Helper to sleep for ms milliseconds
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Batch lineIds into groups of 100
    const batches: string[][] = [];
    for (let i = 0; i < lineIds.length; i += 100) {
        batches.push(lineIds.slice(i, i + 100));
    }

    let lastStatus: number | undefined = undefined;
    let errors: string[] = [];
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        try {
            const res = await axios.post(
                "https://api.line.me/v2/bot/message/multicast",
                {
                    to: batch,
                    messages: [
                        {
                            type: "text",
                            text: message
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            );
            lastStatus = res.status;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
            logger.error(`LINE messaging failed for batch ${i + 1}/${batches.length}: ${errorMessage}`, {
                batchIndex: i,
                batchSize: batch.length,
                status: error?.response?.status,
                error: errorMessage
            });
            errors.push(errorMessage);
            lastStatus = error?.response?.status;
        }
        // Wait 1000ms between batches, except after the last one
        if (i < batches.length - 1) {
            await sleep(1000);
        }
    }

    if (errors.length === 0) {
        return {
            success: true,
            message: "All messages sent successfully",
            status: lastStatus
        };
    } else {
        logger.error(`LINE messaging failed for ${errors.length} out of ${batches.length} batches: ${errors.join("; ")}`, {
            totalBatches: batches.length,
            failedBatches: errors.length,
            errors: errors
        });
        return {
            success: false,
            error: errors.join("; "),
            status: lastStatus
        };
    }
};

export const messageGroup = async (str: string): Promise<{
    success: boolean,
    message?: string,
    status?: number,
    error?: string
}> => {
    if (!process.env.LINE_LOGGING_GROUP_ID)
    {
        logger.error("LINE group messaging failed: LINE_LOGGING_GROUP_ID undefined");
        return { success: false, error: "LINE Logging Group ID undefined." };
    }
    return await message(process.env.LINE_LOGGING_GROUP_ID, str);
}