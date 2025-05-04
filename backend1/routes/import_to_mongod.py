from pymongo import MongoClient
import pandas as pd
import os
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["insurance_db"]  # Specify your database

# Directory containing CSV files (adjust to your local path)
data_dir = "C:/Users/GANESH VARDHAN/Downloads/data"  # Update to your actual path

# Mapping of CSV files to MongoDB collections
csv_to_collection = {
    "feedback_data.csv": "feedback",
    "customers_data.csv": "customers",
    "users_data.csv": "users",
    "transactions_data.csv": "transactions",
    "recommendations_data.csv": "recommendations",
    "policies_data.csv": "policies",
    "payments_data.csv": "payments",
    "claims_data.csv": "claims",
    "interactions_data.csv": "interactions",
    "insurance_products_data.csv": "insuranceProducts",
    "insurance_plans_data.csv": "insurancePlans",
    "customer_profiles_data.csv": "customerProfiles",
    "inquiries_data.csv": "inquiries",
    "companies_data.csv": "companies",
    "documents_data.csv": "documents",
    "chats_data.csv": "chats",
    "activities_data.csv": "activities",
    "ocr_data.csv": "ocr"
}

# Import each CSV file
for csv_file, collection_name in csv_to_collection.items():
    file_path = os.path.join(data_dir, csv_file)
    if os.path.exists(file_path):
        print(f"Processing {csv_file}...")
        try:
            df = pd.read_csv(file_path, low_memory=False)  # Handle mixed types
            print(f"DataFrame shape: {df.shape}")  # Debug: Check number of rows and columns
            if df.empty:
                print(f"Warning: {csv_file} is empty. Skipping insertion.")
                continue
            # Convert DataFrame to list of dictionaries, handling datetime columns
            records = df.to_dict(orient='records')
            print(f"Number of records to insert: {len(records)}")  # Debug: Check record count
            if not records:
                print(f"Error: No records extracted from {csv_file}. Check file content or format.")
                continue
            # Validate each record
            valid_records = []
            for record in records:
                if not record or not isinstance(record, dict):
                    print(f"Invalid record found in {csv_file}: {record}")
                    continue
                # Convert string datetime to Python datetime if present
                for key, value in record.items():
                    if isinstance(value, str) and any(x in value for x in ['T', '-', ':']):
                        try:
                            # Try multiple datetime formats
                            for fmt in ['%Y-%m-%dT%H:%M:%S.%f', '%Y-%m-%d %H:%M:%S.%f', '%Y-%m-%d']:
                                try:
                                    record[key] = datetime.strptime(value, fmt)
                                    break
                                except ValueError:
                                    continue
                            else:
                                print(f"Warning: Invalid datetime format for {key} in {record}")
                        except ValueError:
                            print(f"Warning: Could not parse datetime for {key} in {record}")
                valid_records.append(record)
            if not valid_records:
                print(f"Error: No valid records after processing {csv_file}.")
                continue
            # Insert into MongoDB
            db[collection_name].insert_many(valid_records, ordered=False)
            print(f"Imported {len(valid_records)} records into {collection_name}.")
        except pd.errors.EmptyDataError:
            print(f"Error: {csv_file} is empty or corrupted.")
        except pd.errors.ParserError as e:
            print(f"Error: Failed to parse {csv_file}: {str(e)}")
        except Exception as e:
            print(f"Error processing {csv_file}: {str(e)}")
    else:
        print(f"File {csv_file} not found in {data_dir}.")

print("All data import process completed.")
client.close()