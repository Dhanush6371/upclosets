#!/usr/bin/env python3
"""
Environment Variables Checker for Up Closets Agent
Run this script to verify all required environment variables are set.
"""

import os
from dotenv import load_dotenv

def check_environment():
    """Check if all required environment variables are set"""
    print("Checking Up Closets Agent Environment Variables...")
    print("=" * 60)
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Required environment variables
    required_vars = {
        "LIVEKIT_API_KEY": "LiveKit API key for real-time communication",
        "LIVEKIT_SECRET_KEY": "LiveKit secret key for authentication", 
        "TWIML_USERNAME": "Twilio TwiML username for SIP trunk",
        "TWIML_PASSWORD": "Twilio TwiML password for SIP trunk",
        "GOOGLE_API_KEY": "Google API key for Gemini AI model",
        "MONGO_URI": "MongoDB connection string for database"
    }
    
    # Optional environment variables
    optional_vars = {
        "TWILIO_ACCOUNT_SID": "Twilio account SID (for call termination)",
        "TWILIO_AUTH_TOKEN": "Twilio auth token (for call termination)",
        "INBOUND_ALLOWED_NUMBERS": "Comma-separated list of allowed phone numbers"
    }
    
    # Check required variables
    missing_required = []
    print("Required Environment Variables:")
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive values
            masked_value = value[:8] + "..." if len(value) > 8 else "***"
            print(f"  [OK] {var}: {masked_value}")
        else:
            print(f"  [MISSING] {var}: MISSING")
            missing_required.append(var)
    
    print("\nOptional Environment Variables:")
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if value:
            masked_value = value[:8] + "..." if len(value) > 8 else "***"
            print(f"  [OK] {var}: {masked_value}")
        else:
            print(f"  [OPTIONAL] {var}: Not set (optional)")
    
    print("\n" + "=" * 60)
    
    if missing_required:
        print("❌ CRITICAL ISSUES FOUND:")
        print("Missing required environment variables:")
        for var in missing_required:
            print(f"  - {var}")
        print("\n💡 SOLUTION:")
        print("Create a .env file in the project root with all required variables.")
        print("See TROUBLESHOOTING_GUIDE.md for the complete .env template.")
        return False
    else:
        print("✅ All required environment variables are set!")
        print("\n🚀 Next steps:")
        print("1. Run: python inbound_trunk.py")
        print("2. Run: python dispatch_rule.py") 
        print("3. Run: python agent.py console")
        return True

def test_database_connection():
    """Test MongoDB connection"""
    print("\n🔍 Testing MongoDB Connection...")
    try:
        from db import DatabaseDriver
        db = DatabaseDriver()
        print("✅ MongoDB connection successful!")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False

def test_agent_imports():
    """Test if agent can be imported without errors"""
    print("\n🔍 Testing Agent Imports...")
    try:
        from agent import UpClosetsAgent
        print("✅ Agent imports successful!")
        return True
    except Exception as e:
        print(f"❌ Agent import failed: {e}")
        return False

if __name__ == "__main__":
    print("Up Closets Agent - Environment Checker")
    print("=" * 60)
    
    # Check environment variables
    env_ok = check_environment()
    
    if env_ok:
        # Test database connection
        db_ok = test_database_connection()
        
        # Test agent imports
        import_ok = test_agent_imports()
        
        if db_ok and import_ok:
            print("\n🎉 All checks passed! The agent should be ready to run.")
        else:
            print("\n⚠️ Some components have issues. Check the errors above.")
    else:
        print("\n❌ Environment setup incomplete. Fix the missing variables first.")
