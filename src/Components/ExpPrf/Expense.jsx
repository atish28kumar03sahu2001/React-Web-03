import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addexpense, setexpenses, deleteexpense, editemployee } from "../../Redux/Action";
import { getDatabase, ref, push, onValue, remove, update } from "firebase/database";
import '../Styles/Expense.css';

const Expense = () => {
    const userEmail = localStorage.getItem("UserMail");
    const userName = userEmail.split("@")[0];

    const dispatch = useDispatch();
    const expenses = useSelector((state) => state.expenses);

    const [Eid, SetEid] = useState("");
    const [Ename, SetEname] = useState("");
    const [Edes, SetEdes] = useState("");
    const [Eprice, SetEprice] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const expenseRef = ref(db, `Expense/${userEmail.replace('.', '')}`);
        onValue(expenseRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.Expenses) {
                dispatch(setexpenses(Object.values(data.Expenses)));
                calculateTotalAmount(Object.values(data.Expenses));
            } else {
                dispatch(setexpenses([]));
            }
        });
    }, [dispatch, userEmail]);

    const calculateTotalAmount = (expenses) => {
        const total = expenses.reduce((acc, expense) => acc + parseInt(expense.price), 0);
        setTotalAmount(total);
    }

    const AddExpense = (event) => {
        event.preventDefault();
        if (isEditing) {
            updateExpense();
        } else {
            const OBJ = { id: Eid, name: Ename, description: Edes, price: Eprice };
            dispatch(addexpense(OBJ));

            const db = getDatabase();
            push(ref(db, `Expense/${userEmail.replace('.', '')}/Expenses`), OBJ);

            SetEid("");
            SetEname("");
            SetEdes("");
            SetEprice("");
        }
    };

    const updateExpense = () => {
        const updatedExpense = { id: Eid, name: Ename, description: Edes, price: Eprice };
        const db = getDatabase();

        // Find the key of the expense in Firebase
        const expenseRef = ref(db, `Expense/${userEmail.replace('.', '')}/Expenses`);
        onValue(expenseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.entries(data).forEach(([key, value]) => {
                    if (value.id === editId) {
                        // Update the expense at the found key
                        update(ref(db, `Expense/${userEmail.replace('.', '')}/Expenses/${key}`), updatedExpense)
                            .then(() => {
                                dispatch(editemployee(updatedExpense));
                                setIsEditing(false);
                                setEditId(null);
                                SetEid("");
                                SetEname("");
                                SetEdes("");
                                SetEprice("");
                                console.log("Expense updated successfully");
                            })
                            .catch((error) => {
                                console.error("Error updating expense: ", error);
                            });
                    }
                });
            }
        });
    };

    const DeleteExpense = (id) => {
        const db = getDatabase();
        const expenseRef = ref(db, `Expense/${userEmail.replace('.', '')}/Expenses`);

        onValue(expenseRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.entries(data).forEach(([key, value]) => {
                    if (value.id === id) {
                        remove(ref(db, `Expense/${userEmail.replace('.', '')}/Expenses/${key}`))
                            .then(() => {
                                console.log("Expense deleted successfully");
                                dispatch(deleteexpense(id));
                            })
                            .catch((error) => {
                                console.error("Error deleting expense: ", error);
                            });
                    }
                });
            }
        });
    };

    const editExpense = (id) => {
        const expenseToEdit = expenses.find((expense) => expense.id === id);
        if (expenseToEdit) {
            setIsEditing(true);
            setEditId(id);
            SetEid(expenseToEdit.id);
            SetEname(expenseToEdit.name);
            SetEdes(expenseToEdit.description);
            SetEprice(expenseToEdit.price);
        }
    };

    return (
        <>
            <div className="PFHD">
                <p className="PFP">hi, {userName}</p>
                <p className="PFP">Welcome To Your Expense Report</p>
            </div>
            <div className="FRMDV">
                <form className="FRMDD" onSubmit={AddExpense}>
                    <div className="DV1">
                        <div className="FDV1">
                            <label className="LBL" htmlFor="EXPID">Expense Id:</label>
                            <input required className="IP P" type="text" placeholder="Expense Id" onChange={(e) => SetEid(e.target.value)} value={Eid} />
                        </div>
                        <div className="FDV1">
                            <label className="LBL" htmlFor="EXPNM">Expense Name:</label>
                            <input required className="IP P" type="text" placeholder="Expense Name" onChange={(e) => SetEname(e.target.value)} value={Ename} />
                        </div>
                    </div>
                    <div className="DV1">
                        <div className="FDV1">
                            <label className="LBL" htmlFor="EXPDES">Expense Description:</label>
                            <input required className="IP P" type="text" placeholder="Expense Description" onChange={(e) => SetEdes(e.target.value)} value={Edes} />
                        </div>
                        <div className="FDV1">
                            <label className="LBL" htmlFor="EXPPRC">Expense Price:</label>
                            <input required className="IP P" type="text" placeholder="Expense Price" onChange={(e) => SetEprice(e.target.value)} value={Eprice} />
                        </div>
                    </div>
                    <div>
                        <button className="BTN EXPB" type="submit">{isEditing ? "Update Expense" : "Add Expense"}</button>
                    </div>
                </form>
            </div>
            <div className="TABLDV">
                <p>Total Amount: {totalAmount}</p>
            </div>
            <div className="EXPLIST">
                {expenses.map((expense) => (
                    <div key={expense.id} className="LST">
                        <p>{expense.id}</p>
                        <p>{expense.name}</p>
                        <p>{expense.description}</p>
                        <p>{expense.price}</p>
                        <button className="BT DEL" onClick={() => DeleteExpense(expense.id)}>
                            <FontAwesomeIcon icon={faTrashCan} size="xl" style={{ color: "#ffffff" }} />
                        </button>
                        <button className="BT EDT" onClick={() => editExpense(expense.id)}>
                            <FontAwesomeIcon icon={faPenToSquare} size="xl" style={{ color: "#ffffff" }} />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};
export default Expense;