// src/redux/reducers/starsReducer.js

const initialState = {
  aoma_stars: 0,
  activation_stars: 0,
};

const starsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STARS":
      return {
        ...state,
        aoma_stars: action.payload.aoma,
        activation_stars: action.payload.activation,
      };
    default:
      return state;
  }
};

export default starsReducer;
