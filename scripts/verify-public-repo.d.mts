export type PublicEntry = {path: string; size: number; text: string | null};
export const scanEntries: (entries: PublicEntry[]) => string[];
export const verifyPublicRepo: (root: string) => {ok: true; files: number};
