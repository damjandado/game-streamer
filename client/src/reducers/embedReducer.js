const initialState = {
  name: 'monstercat',
  found: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "EMBED_STREAM":
      let obj = action.ebd.stream || action.ebd;
      console.log('EMBED_STREAM', action.ebd);
      obj = obj.channel || obj;
      const temp_state = {
        channel: obj || "null",
        logo: obj.logo || "https://static-cdn.jtvnw.net/ttv-static/404_preview-120x72.jpg",
        game: obj.game || "null",
        name: obj.name || obj.name,
        display_name: obj.display_name || "null",
        status: obj.status || "null",
        text: action.ebd.text || "",
        title: action.ebd.title || "",
        views: obj.views || "null",
        followers: obj.followers || "null",
        found: true
      };
      return Object.assign({}, temp_state);
    case "NOT_FOUND":
      return { found: false };
    default:
      return state;
  }
}
