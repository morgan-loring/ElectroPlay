



exports.QueueEnqueue = (queue, ob) => {
    queue.push(ob);
    return queue;
}

exports.QueueDequeue = (queue) => {
    queue.splice(0, 1);
    return queue;
}

