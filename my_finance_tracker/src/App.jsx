import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Transaction from "./components/transaction";
import TList from "./components/tlist";

function App() {
  async function addTransaction(description, amount, date) {
    try {
      const response = await invoke("add_transaction", {description, amount, date});
      console.log(response);
    } catch (error) {
      console.log('Error Adding Transaction: ', error)
    }
  }

  async function getTransactions() {
    try {
      const transactions = await invoke('get_transactions');
      console.log(transactions);
    } catch (error) {
      console.log('Failed To Get Transactions: ', error)
    }
  }

  async function delTransaction(description, amount, date) {
    try {
      const response = await invoke("del_transaction", {description, amount, date});
      console.log(response);
    } catch (error) {
      console.log('Failure To Delete Transaction:', error)
    }
  }

    return (
   <div>
      <div className="container">
	  <button id="t_btn">Transactions</button>
	  <h1>Fortuna Finance</h1>
      </div>
       <TList/>
        <Transaction/>
   </div>
  )
}

export default App;
