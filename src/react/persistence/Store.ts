import { Stream } from "../models/Stream";

export interface Store {
    curr_streams: Stream[];
    archived_streams: Stream[];
}