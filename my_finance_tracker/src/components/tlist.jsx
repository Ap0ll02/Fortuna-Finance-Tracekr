import { invoke } from '@tauri-apps/api/tauri';
import {useState, useEffect} from 'react';
import "../App.css";
const TList = ({transactions, onGetT}) => {
    const [desc, setDesc] = useState('');
    const [amt, setAmt] = useState('');
    const [dt, setDt] = useState('');

    const handleDel = (transaction) => {
	console.log(transaction.description);
	console.log(transaction.amount);
	console.log(transaction.date);
	deleteTransaction(transaction.description, transaction.amount, transaction.date);
    }

    const deleteTransaction = async (desc, amt, dt) => {
	try {
	    const description = desc;
	    const amount = parseFloat(amt);
	    const date = dt;
	    const response = await invoke('del_transaction', { description, amount, date });
	    console.log(response);
	    
	    onGetT();
	}
	catch (error) {
	    console.log("Failed To Delete Transaction", error);
	}
    }
    
    return (
	<div>
	    <h1>Transactions</h1>
	    <div className="t_list_main">
                {transactions.map((transaction, index) => (
		    <table key={index} className="t_table">
			<tr>
			<th className="t_desc">Description</th>
			<th className="t_amt">Amount</th>
			    <th className="t_dt">Date</th>
			    </tr>
		<tr>
		  <td className="t_desc">{transaction.description}</td>
                    <td className="t_amt">${transaction.amount}</td>
                    <td className="t_dt">{transaction.date}</td>
		    <td><button className="black_btn" onClick={ () => {
				    handleDel(transaction);
				}}
			>Delete Transaction</button></td>
		 </tr>
		</table>
	        ))}
	</div>
	</div>
    )
};

export default TList;
