#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Serialize)]
struct Transaction {
    id: i32,
    description: String,
    amount: f64,
    date: String,
}

#[tauri::command] 
fn setup_db() -> Result<Connection> {
    // Initialize a connection to the database (SQLite) and the execute a table setup
    // command, dependent on whether a table already exists
    let conn = Connection::open("my_finance.db")?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS transactions (
        id  INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        amount  REAL NOT NULL,
        date   TEXT NOT NULL
        )",
    [],
    )?;
    // Return the connection result.
    Ok(conn)
}

#[tauri::command]
fn add_transaction(description: String, amount: f64, date: String) -> Result<String, String> {
    // Open connection with the setup_db function, and map the error it returns, next 
    // execute an update operation to add data to the table
    let conn = setup_db().map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO transactions (description, amount, date) VALUES(?1, ?2, ?3)",
    params![description, amount, date],
    ).map_err(|e| e.to_string())?;

    Ok("Transaction Added Successfully".into())
}


#[tauri::command] 
fn get_transactions() -> Result<Vec<Transaction>, String> {
    let conn = setup_db().map_err(|e| e.to_string())?;
    // After connecting, prepare a query statement, without fully executing it.
    // Map the query result to a transaction iterator, which will allow us to iterate 
    // over the results of the query.  
    let mut stmt = conn.prepare("SELECT id, description, amount, date FROM transactions").map_err(|e| e.to_string())?;
    let transaction_iter = stmt.query_map([], |row| {
        Ok(Transaction {
            id: row.get(0)?,
            description: row.get(1)?,
            amount: row.get(2)?,
            date: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;
    // Create a vector to hold the transactions, and iterate over the transaction iterator
    let mut transactions = Vec::new();
    for transaction in transaction_iter {
        transactions.push(transaction.map_err(|e| e.to_string())?);
    }
    Ok(transactions)
}

#[tauri::command] 
fn del_transaction(description: String, amount: f64, date: String) -> Result<String, String> {
    // Setup a connection to the database, execute the query to delete any entry in transaction
    // table that matches the description amount and date props. Setting this to a variable allows
    // us to determine affected rows, noting that a non-zero amount means something was successfully
    // deleted from the DB. 
    let conn = setup_db().map_err(|e| e.to_string())?;

    let affected_rows = conn.execute(
        "DELETE FROM transactions WHERE description = ?1 AND amount = ?2 AND date = ?3",
        params![description, amount, date],
    ).map_err(|e| e.to_string())?;

    if affected_rows == 0 {
        return Err("No Matching Transaction Found".into());
    }

    Ok("Transaction Deleted Successfully!".into())
}

#[tauri::command]
fn get_total() -> Result<f64, String> {
    let conn = setup_db().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT sum(amount) FROM transactions").map_err(|e| e.to_string())?;
    let total_amount: f64 = match stmt.query_row(params![], |row| row.get(0)) {
        Ok(total) => total,
        Err(err) => return Err(format!("Failed To Execute Query: {}", err)),
    };

    Ok(total_amount)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_transaction, get_transactions, del_transaction, get_total])
        .setup(|_app| {
            setup_db().expect("Failed to initialize database");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
