const initialState = {
  name: "onstercat",
  display_name: "Monstercat",
  status: "Monstercat prides itself in supporting rising electronic artists from around the globe. We are proving that independent labels have the ability to reshape the music industry landscape.",
  logo: "https://static-cdn.jtvnw.net/jtv_user_pictures/monstercat-profile_image-3e109d75f8413319-300x300.jpeg"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "EMBED_STREAM":
      const obj = action.ebd.stream || action.ebd;
      console.log('EMBED_STREAM');
      const temp_state = {
        channel: obj.channel,
        logo: obj.channel.logo,
        game: obj.game,
        name: obj.channel.name,
        display_name: obj.channel.display_name,
        status: obj.channel.status,
        views: obj.channel.views,
        followers: obj.channel.followers
      };
      return Object.assign({}, state, temp_state);
    default:
      return state;
  }
}
