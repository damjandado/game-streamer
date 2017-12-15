const initialState = {
  name: "monstercat",
  display_name: "Monstercat",
  text: "Monstercat prides itself in supporting rising electronic artists from around the globe. We are proving that independent labels have the ability to reshape the music industry landscape.",
  logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/monstercat-profile_image-3e109d75f8413319-300x300.jpeg"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "EMBED_STREAM":
      const obj = action.ebd.stream || action.ebd;
      console.log('EMBED_STREAM');
      const temp_state = {
        channel: obj.channel || "null",
        logo: obj.channel.logo || "https://static-cdn.jtvnw.net/ttv-static/404_preview-120x72.jpg",
        game: obj.game || "null",
        name: obj.channel.name || obj.name,
        display_name: obj.channel.display_name || "null",
        status: obj.channel.status || "null",
        text: action.ebd.text || "",
        views: obj.channel.views || "null",
        followers: obj.channel.followers || "null"
      };
      return Object.assign({}, state, temp_state);
    default:
      return state;
  }
}
