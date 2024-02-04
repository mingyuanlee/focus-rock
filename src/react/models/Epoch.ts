export interface Epoch {
    target: string;
    start: string | null;
    end: string | null;
    endStatus: EndStatus | null;
}

export enum EndStatus {
    FINISHED,
    UNFINISHED,
    INTERRUPTED,
    TODO,
}