import { Epoch } from "./Epoch";

export interface Stream {
    topic: string;
    epochs: Epoch[];
    archived: boolean;
}