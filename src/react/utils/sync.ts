import { Stream } from "../models/Stream";

export const checkConflicts = (streams1: Stream[], streams2: Stream[]) => {
    for (const stream1 of streams1) {
        for (const partition1 of stream1.partitions) {
            for (const epoch1 of partition1.epochs) {
                for (const stream2 of streams2) {
                    for (const partition2 of stream2.partitions) {
                        for (const epoch2 of partition2.epochs) {
                            if (epoch1.end > epoch2.start && epoch1.start < epoch2.end) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
};

export const mergeStreams = (streams1: Stream[], streams2: Stream[]) => {
    const mergedStreams = [...streams1];

    for (const stream2 of streams2) {
        let stream1 = mergedStreams.find(stream => stream.topic === stream2.topic);

        if (!stream1) {
            mergedStreams.push(stream2);
            continue;
        }

        for (const partition2 of stream2.partitions) {
            let partition1 = stream1.partitions.find(partition => partition.name === partition2.name);

            if (!partition1) {
                stream1.partitions.push(partition2);
                continue;
            }

            partition1.epochs = [...partition1.epochs, ...partition2.epochs];
        }
    }

    return mergedStreams;
};