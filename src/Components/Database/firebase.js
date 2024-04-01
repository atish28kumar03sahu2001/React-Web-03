import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCapXbxeHAw3NbLV1bNsvAbTs_r5F5eBqc",
    authDomain: "sprct-redux.firebaseapp.com",
    databaseURL: "https://sprct-redux-default-rtdb.firebaseio.com",
    projectId: "sprct-redux",
    storageBucket: "sprct-redux.appspot.com",
    messagingSenderId: "664359895900",
    appId: "1:664359895900:web:ca16063760689d68273799"
};
export const app = initializeApp(firebaseConfig);