export type tonType = { mediante: number[]; end: number[] };

export const tons: {
    [key: string]: tonType;
} = {
    "1f": { mediante: [0, 2], end: [2, 1] },
    "3b": { mediante: [0, 2], end: [0, 2] },
    "4g": { mediante: [2, 1], end: [0, 1] },
    "7c": { mediante: [0, 2], end: [0, 2] },
    "7c2": { mediante: [0, 2], end: [0, 2] },
    p: { mediante: [3, 1], end: [1, 1] },
    "none": { mediante: [0, 0], end: [0, 0] },
};
