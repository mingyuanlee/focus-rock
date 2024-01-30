export interface Epoch {
    target: string;
    start: number;
    end: number;
    endStatus: EndStatus;
}

enum EndStatus {
    FINISHED,
    UNFINISHED,
    INTERRUPTED,
}