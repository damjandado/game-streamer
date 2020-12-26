const initialState = {
  name: "monstercat",
  found: false
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case "EMBED_STREAM":
      return { name: payload.user_name, found: true, ...payload };
    case "NOT_FOUND":
      return { found: false };
    default:
      return state;
  }
}
