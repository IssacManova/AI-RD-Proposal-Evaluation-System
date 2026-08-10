"""
create_admin.py — Run this ONCE to create your admin account.

Usage:
    cd backend
    python create_admin.py

After running, log in at http://localhost:5174/login with the
email and password you enter below.
"""

import sys
import os

# ── Make sure backend packages are importable ──────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))

from passlib.context import CryptContext
from app.config.database import users_collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def main():
    print("=" * 50)
    print("   AI-RD Admin Account Creator")
    print("=" * 50)

    email    = input("\nEnter admin email    : ").strip().lower()
    password = input("Enter admin password : ").strip()

    if not email or not password:
        print("\n❌  Email and password cannot be empty.")
        sys.exit(1)

    # Check if account already exists
    existing = users_collection.find_one({"email": email})
    if existing:
        # Always update role to admin AND reset the password
        hashed_pw = pwd_context.hash(password)
        users_collection.update_one(
            {"email": email},
            {"$set": {"role": "admin", "password": hashed_pw}}
        )
        print(f"\n✅  Account '{email}' updated → role: admin, password reset.")
        print(f"\n👉  Login at http://localhost:5174/login")
        print("=" * 50)
        return

    # Create new admin user
    hashed_pw = pwd_context.hash(password)
    users_collection.insert_one({
        "name":     "Admin",
        "email":    email,
        "password": hashed_pw,
        "role":     "admin",
    })

    print(f"\n✅  Admin account created successfully!")
    print(f"    Email : {email}")
    print(f"    Role  : admin")
    print(f"\n👉  Login at http://localhost:5174/login")
    print("=" * 50)


if __name__ == "__main__":
    main()
