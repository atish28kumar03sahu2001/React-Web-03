import { ADD_EXPENSE, SET_EXPENSES, DELETE_EXPENSE, EDIT_EXPENSE } from "./Action";
const initalState = {
    expenses: [],
};
const  Reducer = (state = initalState, action) => {
    switch(action.type) {
        case ADD_EXPENSE:
            return {
                ...state,
                expenses: [...state.expenses, action.payload]
            };
        case SET_EXPENSES:
            return {
                ...state, expenses: action.payload
            }
        case DELETE_EXPENSE:
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload)
            };
            case EDIT_EXPENSE:
                return {
                    ...state,
                    expenses: state.expenses.map((expense) =>
                        expense.id === action.payload.id ? action.payload : expense
                    ),
                };
        default: 
            return state;
    }
};
export default Reducer;