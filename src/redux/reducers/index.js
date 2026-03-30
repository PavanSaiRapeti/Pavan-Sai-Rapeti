import { combineReducers } from "redux";
import cameraReducer from "./cameraReducer";
import reactReducer from "./reactReducer";

const rootReducer = combineReducers({
  camera: cameraReducer,
  react: reactReducer,
});

export default rootReducer;
