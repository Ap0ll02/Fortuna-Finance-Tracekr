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

    conn.execute("
    CREATE TABLE IF NOT EXISTS transactions (
        id  INTEGER PRIMARY KEY
        description TEXT NOT NULL
        amount  REAL NOT NULL
        date   TEXT NOT NULL)
    ",
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


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
