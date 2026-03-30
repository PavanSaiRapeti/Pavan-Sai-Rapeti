import { SET_CURRENT_INDEX } from "./types";



export const setCurrentIndex = (index) => ({
    type: SET_CURRENT_INDEX,
    payload: index,
});