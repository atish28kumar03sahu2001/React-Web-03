export const ADD_EXPENSE = "ADD_EXPENSE";
export const addexpense = (expense) => ({
    type: ADD_EXPENSE,
    payload: expense,
});

export const SET_EXPENSES = "SET_EXPENSES";
export const setexpenses = (expenses) => ({
    type: SET_EXPENSES,
    payload: expenses,
});

export const DELETE_EXPENSE = "DELETE_EXPENSE";
export const deleteexpense = (expenseId) => ({
    type: DELETE_EXPENSE,
    payload: expenseId,
});

export const EDIT_EXPENSE = "EDIT_EXPENSE";
export const editemployee = (expense) => ({
    type: EDIT_EXPENSE,
    payload: expense,
});
