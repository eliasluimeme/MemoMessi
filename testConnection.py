import psycopg2
from psycopg2 import sql, OperationalError

# Replace these with your actual database credentials
DATABASE_URL = "postgresql://username:password@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

def test_connection():
    try:
        # Connect to the PostgreSQL database
        connection = psycopg2.connect(DATABASE_URL)
        print("Connection to Supabase successful!")

    except OperationalError as e:
        print("Error connecting to Supabase:", e)

    finally:
        # Close the connection if it was established
        if 'connection' in locals():
            connection.close()
            print("Connection closed.")

if __name__ == "__main__":
    test_connection() 