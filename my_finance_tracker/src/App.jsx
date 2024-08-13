import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Transaction from "./components/transaction";
import TList from "./components/tlist";
import Modal from "./components/Modal";
function App() {
    
  async function addTransaction(description, amount, date) {
    try {
      const response = await invoke("add_transaction", {description, amount, date});
      console.log(response);
    } catch (error) {
      console.log('Error Adding Transaction: ', error)
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

  const [transactions, setTransactions] = useState([]);
const [add, setAdd] = useState(false);
  async function fetchTransactions() {
    try {
      const transactions = await invoke("get_transactions");
      setTransactions(transactions);
    } catch (error) {
      console.log("Failed To Fetch Transactions", error);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);
    
    return (
   <div>
      <div className="container">
	  <h1>Fortuna Finance</h1>
      </div>
       <button id="t_btn" onClick={() => {setAdd(prevAdd => !prevAdd)}}>&#43;</button>
       <Modal show={add} onClose = {() => setAdd(false)}>
	   <Transaction onGetT={fetchTransactions}/>
       </Modal>
       
       <TList transactions = {transactions} onGetT={fetchTransactions}/>
   </div>
  )
}

export default App;
