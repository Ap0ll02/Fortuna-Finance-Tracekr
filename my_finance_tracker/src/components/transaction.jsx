import React, {useState} from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import "../App.css";
const Transaction = () => {
    const [desc, setDesc] = useState('');
    const [amt, setAmt] = useState('');
    const [dt, setDt] = useState('');
    const [lastTransaction, setLastTransaction] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleClick(desc, amt, dt);
    };

    const handleClick = async (desc, amt, dt) => {
        try {
            const description = desc;
            const amount = amt;
            const date = dt;

            const response = await invoke('add_transaction', { description, amount, date });
            console.log(response);
            setLastTransaction({description, amount, date});
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div>
      {lastTransaction && (
        <p className="desc">Last Transaction: {lastTransaction.description}, ${lastTransaction.amount} on {lastTransaction.date}</p>
      )}
      <form>
        <label className='desc'>Input Transaction Name (ex: Morning coffee):</label>
        <br></br>
        <input className='black_btn' type="text" value={desc} onChange={(e) => setDesc(e.target.value)}></input>
        <br></br>
        <label className='desc'>Input Transaction Amount (ex: 5.99):</label>
        <br></br>
        <input className='black_btn' type="text" value={amt} onChange={(e) => setAmt(e.target.value)}></input>
        <br></br>
        <label className='desc' value={dt} onChange={(e) => setDt(e.target.value)}>Input Transaction Date (DD/MM/YEAR):</label>
        <br></br>
        <input className='black_btn' type="text"></input><br></br>
        <input className="black_btn" type="submit" value="Add Transaction" onSubmit={handleSubmit}></input>
      </form>
    </div>
  )
};

export default Transaction
