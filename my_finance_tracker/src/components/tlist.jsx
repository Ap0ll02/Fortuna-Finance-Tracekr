import { invoke } from '@tauri-apps/api/tauri';
import {useState, useEffect} from 'react';
import "../App.css";
const TList = () => {

    const [transactions, setTransactions] = useState([]);
    const fetchTransactions = async () => {
	try {
	    const transactions = await invoke("get_transactions");
	    setTransactions(transactions);
	}
	catch(error){
	    console.log("Failed To Fetch Transactions", error); 
	}
    };

    useEffect(() => {
	fetchTransactions();
    }, []);
    
    return (
	<div>
	    <h1>Transactions</h1>
            <div className="table">
                <p className="t_header">Description</p>
                <p className="t_header">Amount</p>
                <p className="t_header">Date</p>
            </div>
<ul className="t_table">
                {transactions.map((transaction, index) => (
		<li key={index}>
		  <p className="t_desc">{transaction.description}</p>
                    <p className="t_amt">${transaction.amount}</p>
                    <p className="t_dt">{transaction.date}</p>
		</li>
	        ))};
            </ul>

	</div>
    );
};

export default TList;
