from pymongo import MongoClient
from app.config.settings import settings

try:
    client = MongoClient(settings.MONGODB_URI)

    db = client[settings.DATABASE_NAME]

    client.admin.command("ping")

    print("✅ Successfully connected to MongoDB Atlas!")

except Exception as e:
    print("❌ MongoDB Connection Error:")
    print(e)

users_collection = db["users"]
proposals_collection = db["proposals"]
evaluations_collection = db["evaluations"]