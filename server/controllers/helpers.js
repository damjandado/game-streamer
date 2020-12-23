exports.makeid = num => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < num; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

exports.flatten = (arr) => {
  return [].concat(...arr);
}

exports.remove_duplicates = (arr) => {
  return [...new Set(arr)];
}

exports.count_items = (arr) => {
  return arr.reduce(function(prev, cur) {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
}

exports.sortProperties = (obj) => {
  let sortable = [];
  for (let key in obj)
    if (obj.hasOwnProperty(key)) sortable.push([key, obj[key]]);

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });
  sortable = sortable.map(item => item[0]);
  return sortable;
}