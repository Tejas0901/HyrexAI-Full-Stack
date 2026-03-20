"""
Script to create test users for development/testing.
Run with: python -m app.scripts.seed_test_user
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.db.session import AsyncSessionLocal
from app.services.user_service import UserService
from app.schemas.user import CreateUser

TEST_USERS = [
    {
        "name": "Test User",
        "email": "test@hyrex.ai",
        "password": "Test@123456",
    },
    {
        "name": "Tejas Nigam",
        "email": "tejas@hyrex.ai",
        "password": "Hyrex@2026",
    },
]


async def create_user(user_service: UserService, user_data: dict):
    """Create a single test user if not exists."""
    email = user_data["email"]
    existing = await user_service.get_by_email(email)
    if existing:
        print(f"  ⏭  {email} — already exists (ID: {existing.id})")
        return existing

    user = await user_service.create(
        CreateUser(
            name=user_data["name"],
            email=user_data["email"],
            password=user_data["password"],
        )
    )
    print(f"  ✓  {email} — created (ID: {user.id})")
    return user


async def main():
    print("=" * 50)
    print("  Seeding test users for Hyrex AI")
    print("=" * 50)

    try:
        async with AsyncSessionLocal() as db:
            user_service = UserService(db)

            for data in TEST_USERS:
                await create_user(user_service, data)

            await db.commit()

        print("\n✓ Done! Login with any of these credentials:")
        print("-" * 50)
        for u in TEST_USERS:
            print(f"  Email:    {u['email']}")
            print(f"  Password: {u['password']}")
            print()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
