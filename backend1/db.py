from flask_pymongo import PyMongo
from pymongo.errors import ConnectionFailure, DuplicateKeyError, OperationFailure
import os

# Initialize PyMongo instance (will be configured later with app)
mongo = PyMongo()

def init_db(app):
    """
    Initialize the MongoDB connection with the Flask app and set up necessary indexes.

    Args:
        app: Flask application instance
    """
    # Configure MongoDB URI from environment variable or default to localhost
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/insurance_db")
    
    try:
        # Initialize the MongoDB connection
        mongo.init_app(app)
        
        # Test the connection within the app context
        with app.app_context():
            # Ping the MongoDB server to verify connection
            mongo.db.command("ping")
            print("Connected to MongoDB (insurance_db) successfully!")
            
            # Check for and handle duplicate email entries before creating unique index
            pipeline = [
                {"$group": {"_id": "$email", "count": {"$sum": 1}, "ids": {"$push": "$_id"}}},
                {"$match": {"count": {"$gt": 1}}}
            ]
            
            duplicates = list(mongo.db.users.aggregate(pipeline))
            if duplicates:
                for doc in duplicates:
                    # Keep the first document, remove duplicates
                    for id_to_remove in doc["ids"][1:]:
                        mongo.db.users.delete_one({"_id": id_to_remove})
                    print(f"Removed {len(doc['ids']) - 1} duplicate(s) for email: {doc['_id']}")
                print("Duplicate emails have been cleaned up.")
            else:
                print("No duplicate emails found.")

            # Create unique index on users.email
            try:
                mongo.db.users.create_index([("email", 1)], unique=True)
                print("Created unique index on users.email")
            except DuplicateKeyError:
                print("Warning: Could not create unique index due to existing duplicate emails.")
                print("Please ensure duplicate emails are resolved manually or via a cleanup script.")
                raise  # Re-raise to fail initialization if duplicates persist
            except OperationFailure as e:
                if "index already exists" in str(e):
                    print("Unique index on users.email already exists.")
                elif "index not found" in str(e):
                    mongo.db.users.create_index([("email", 1)], unique=True)
                    print("Created unique index on users.email")
                else:
                    print(f"MongoDB operation failed: {e}")
                    raise

    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise  # Re-raise to stop the app if connection fails
    except Exception as e:
        print(f"Unexpected error during MongoDB initialization: {e}")
        raise  # Re-raise to stop the app if other errors occur

# Note: This file should be imported and init_db called in app.py