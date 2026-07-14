import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from datetime import datetime


# 1. Environment setup

ENV_PATH = r"C:\Users\owner\Desktop\Health Insurance MLM\Model\env.txt"
load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in env.txt")

engine = create_engine(DATABASE_URL)

TABLE_NAME = "medical_insurance"   

def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(" Connection successful")
        return True
    except Exception as e:
        print(f" Connection failed: {e}")
        return False

# 4. Export to CSV
def export_table_to_csv(table_name, output_dir="."):
    try:
        query = f'SELECT * FROM "{table_name}"'
        df = pd.read_sql_query(query, engine)
        if df.empty:
            print(f" Table '{table_name}' is empty.")
            return False

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"snapshot_{table_name}_{timestamp}.csv"
        filepath = os.path.join(output_dir, filename)
        df.to_csv(filepath, index=False)
        print(f" Exported {len(df)} rows to {filepath}")
        return True
    except Exception as e:
        print(f"Export failed: {e}")
        return False

def main():
    if test_connection():
        export_table_to_csv(TABLE_NAME)

if __name__ == "__main__":
    main()