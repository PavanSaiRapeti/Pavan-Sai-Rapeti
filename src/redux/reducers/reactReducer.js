import { SET_CURRENT_INDEX } from "../actions/types";



const initialState = {
    currentIndex: 2,
};


const reactReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_INDEX:
            return { ...state, currentIndex: action.payload };
        default:
            return state;
    }
};

export default reactReducer;