export type tonType = {
    mediante: [number, number, boolean?];
    end: [number, number, boolean?];
};

export const tons: {
    [key: string]: tonType;
} = {
    "1D": { mediante: [0, 2], end: [2, 1] },
    "1D2": { mediante: [0, 2], end: [2, 1] },
    "1f": { mediante: [0, 2], end: [2, 1] },
    "1g": { mediante: [0, 2], end: [2, 1] },
    "3b": { mediante: [0, 2], end: [0, 2] },
    "5a": { mediante: [0, 1], end: [0, 2] },
    "4g": { mediante: [2, 1], end: [0, 1] },
    "4A": { mediante: [2, 1], end: [3, 1] },
    "4E": { mediante: [2, 1], end: [3, 1] },
    "7b": { mediante: [0, 2], end: [0, 2] },
    "7c": { mediante: [0, 2], end: [0, 2] },
    "7c2": { mediante: [0, 2], end: [0, 2] },
    "8G": { mediante: [0, 1], end: [2, 1] },
    p: { mediante: [3, 1], end: [1, 1] },
    none: { mediante: [0, 0], end: [0, 0] },
};
