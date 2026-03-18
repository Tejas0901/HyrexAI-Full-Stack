"""
Script to create a test user for development/testing.
Run with: python -m app.scripts.seed_test_user
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.services.user_service import UserService
from app.schemas.user import CreateUser


async def create_test_user():
    """Create a test user for development."""
    async with AsyncSessionLocal() as db:
        user_service = UserService(db)
        
        # Check if test user already exists
        existing = await user_service.get_by_email("test@hyrex.ai")
        if existing:
            print(f"✓ Test user already exists:")
            print(f"  Email: test@hyrex.ai")
            print(f"  ID: {existing.id}")
            return existing
        
        # Create test user
        test_user = CreateUser(
            name="Test User",
            email="test@hyrex.ai",
            password="Test@123456",
        )
        
        user = await user_service.create(test_user)
        await db.commit()
        
        print("✓ Test user created successfully!")
        print(f"  ID: {user.id}")
        print(f"  Name: {user.name}")
        print(f"  Email: {user.email}")
        print(f"  Password: Test@123456")
        print(f"  Is Active: {user.is_active}")
        print(f"  Is Verified: {user.is_verified}")
        
        return user


async def main():
    print("=" * 50)
    print("Creating test user for Hyrex AI...")
    print("=" * 50)
    
    try:
        await create_test_user()
        print("\n✓ Done! You can now login with these credentials.")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
