exports.makeid = (num) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < num; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

exports.flatten = (arr) => {
    return [].concat(...arr);
};

exports.remove_duplicates = (arr) =>
    arr.filter(
        (thing, index, self) =>
            self.findIndex((t) => t.id === thing.id) === index
    );

exports.count_items = (arr) => {
    return arr.reduce(function (prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
    }, {});
};

exports.sortProperties = (arr) => {
    const sortable = arr.slice();
    sortable.sort(function (a, b) {
        return (a.count ?? 0) - (b.count ?? 0);
    });
    return sortable;
};
