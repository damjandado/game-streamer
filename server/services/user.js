const { flatten, count_items, sortProperties, remove_duplicates } = require('../utils/utils.js');

const getUserRecommendations = (user) => {
    let users = [],
        games = [];
    const { visits } = user;
    if (visits) {
        if (visits.users.length < 4) {
            users = processQuery(user, 'users', visits.users.length);
        } else {
            users = processQuery(user, 'users', 4);
        }
        if (visits.games.length < 4) {
            games = processQuery(user, 'games', visits.games.length);
        } else {
            games = processQuery(user, 'games', 4);
        }
    }
    return { games, users };
};

const processQuery = (user, prop, count) => {
    const select = user.visits[prop];

    let mostVisited = sortProperties(select);
    mostVisited = mostVisited.slice(-count);

    let recent = remove_duplicates(select);
    recent = recent.slice(recent.length - count);

    let joined = mostVisited.concat(recent);
    return remove_duplicates(joined);
};

module.exports = {
    getUserRecommendations,
};
