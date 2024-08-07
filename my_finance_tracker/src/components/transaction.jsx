import React, {useState} from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import "../App.css";
const Transaction = () => {
    const [lastTransaction, setLastTransaction] = useState(null);
    const handleClick = async () => {
        try {
            const description = "Lunch";
            const amount = 12.50;
            const date = "07/08/2024";

            const response = await invoke('add_transaction', { description, amount, date });
            console.log(response);
            setLastTransaction({description, amount, date});
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div>
      <button onClick={handleClick} className='t_main'>Add A Transaction</button>
      {lastTransaction && (
        <p id="last_t">Last Transaction: {lastTransaction.description}, ${lastTransaction.amount} on {lastTransaction.date}</p>
      )}
    </div>
  );
};

export default Transaction
