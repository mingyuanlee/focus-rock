import { Epoch } from "./Epoch";

export interface Stream {
    topic: string;
    partitions: Partition[];
    archived: boolean;
}

export interface Partition {
    name: string;
    epochs: Epoch[];
}