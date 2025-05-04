from flask import current_app as app
from pymongo.errors import PyMongoError

class CustomerProminenceService:
    @staticmethod
    def get_prominence(email):
        """
        Fetch the latest prominence score and category for a user.
        """
        try:
            profile = app.mongo.db.customerProfiles.find_one(
                {"email": email},
                sort=[("calculatedAt", -1)]
            )
            if not profile:
                return None, None
            return profile.get("prominenceScore"), profile.get("customerCategory")
        except PyMongoError as e:
            app.logger.error(f"Database error fetching prominence for {email}: {str(e)}")
            return None, None

class PolicyRecommenderService:
    @staticmethod
    def recommend_policies(user_id, customer_category, limit=5):
        """
        Recommend policies for a user based on their prominence category.
        """
        try:
            query = {"userId": str(user_id), "status": "pending"}
            if customer_category == "Premium":
                # Premium: Recommend high coverage, high premium, or exclusive policies
                query["coverage"] = {"$gte": 1000000}
            elif customer_category == "Valuable":
                # Valuable: Recommend mid-range policies
                query["coverage"] = {"$gte": 500000, "$lt": 1000000}
            else:
                # Standard: Recommend essential/basic policies
                query["coverage"] = {"$lt": 500000}

            policies = list(app.mongo.db.policies.find(query).sort("coverage", -1).limit(limit))
            return policies
        except PyMongoError as e:
            app.logger.error(f"Database error recommending policies for user {user_id}: {str(e)}")
            return []