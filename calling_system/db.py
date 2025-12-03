# Import OS module for environment variable access
import os

# Load environment variables from a .env file
from dotenv import load_dotenv

# MongoDB client and error classes
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Typing helper for optional return values
from typing import Optional, List, Dict, Any
import logging

# Import datetime for timestamps
from datetime import datetime

# ---------- Load .env file and initialize MongoDB URI ----------

# Load environment variables from the .env file into the environment
load_dotenv()

# Retrieve MongoDB URI from environment variables
MONGO_URI = os.getenv("MONGO_URI")

# ---------- MongoDB Connection Setup ----------

try:
    # Initialize MongoDB client with the URI
    if not MONGO_URI:
        raise ValueError("MONGO_URI environment variable not set.")
    
    # Disable MongoDB logs by setting logging level
    import logging
    logging.getLogger("pymongo").setLevel(logging.WARNING)
    logging.getLogger("pymongo.connection").setLevel(logging.WARNING)
    logging.getLogger("pymongo.pool").setLevel(logging.WARNING)
    logging.getLogger("pymongo.serverSelection").setLevel(logging.WARNING)
    
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

    # Access the 'upclosets' database
    db = client["test"]

    # Access the 'consultations' collection within the 'upclosets' database
    consultations_collection = db["consultations"]

except (PyMongoError, ValueError) as e:
    # Re-raise, but also log for visibility
    logging.getLogger("realtime_upclosets_agent").error(f"Mongo init failed: {e}")
    raise

# ---------- Consultation Database Driver Class ----------

class DatabaseDriver:
    def __init__(self):
        # Initialize the collection reference to use in other methods
        self.collection = consultations_collection
        self.log = logging.getLogger("realtime_upclosets_agent")

    # Create a new consultation appointment in the MongoDB collection
    def schedule_consultation(self, phone: str, closet_type: str = None, number_of_spaces: int = None, name: str = None, address: str = None, zip_code: str = None, preferred_date: str = None, preferred_time: str = None, caller_phone: str = None) -> Optional[dict]:
        self.log.info(f"Database: Received phone parameter: {phone}")
        self.log.info(f"Database: Phone parameter type: {type(phone)}")
        self.log.info(f"Database: Phone parameter is None: {phone is None}")
        self.log.info(f"Database: Phone parameter == 'unknown': {phone == 'unknown'}")
        
        # NEVER allow "unknown" phone numbers - always use a fallback
        if not phone or phone == "unknown":
            import time
            phone = f"call_{int(time.time())}"
            self.log.info(f"Database: Replaced 'unknown' with fallback phone: {phone}")
        
        self.log.info(f"Database: Final phone number for consultation: {phone}")
        
        consultation = {
            "phone": phone,
            "closet_type": closet_type,
            "number_of_spaces": number_of_spaces,
            "status": "scheduled",
            "created_at": datetime.now().isoformat(),
            "consultation_type": "phone_only",  # Indicates this is a phone-only consultation booking
            "confirmation_status": "confirmed"  # Indicates customer confirmed details before saving
        }
        
        # Add optional fields if provided
        if name:
            consultation["name"] = name
        if address:
            consultation["address"] = address
        if zip_code:
            consultation["zip_code"] = zip_code
        if preferred_date:
            consultation["preferred_date"] = preferred_date
        if preferred_time:
            consultation["preferred_time"] = preferred_time
        
        # Add caller phone number if available
        if caller_phone:
            consultation["caller_phone"] = caller_phone
            consultation["phone_source"] = "extracted_from_call"
        else:
            consultation["phone_source"] = "provided_by_customer"
        
        try:
            self.log.info(f"Database: Inserting consultation with phone: {consultation.get('phone')}")
            self.log.info(f"Database: Full consultation document: {consultation}")
            # Insert the consultation document into the MongoDB collection
            result = self.collection.insert_one(consultation)
            self.log.info(f"Database: Insert result: {result.inserted_id}")
            return consultation
        except PyMongoError as e:
            self.log.error(f"Database: Insert failed: {e}")
            return None

    # Create a pending consultation record (before confirmation)
    def create_pending_consultation(self, phone: str, closet_type: str = None, number_of_spaces: int = None, name: str = None, address: str = None, zip_code: str = None, preferred_date: str = None, preferred_time: str = None, caller_phone: str = None) -> Optional[str]:
        """Create a pending consultation record and return its ID for later confirmation"""
        self.log.info(f"Database: Creating pending consultation for phone: {phone}")
        
        # NEVER allow "unknown" phone numbers - always use a fallback
        if not phone or phone == "unknown":
            import time
            phone = f"call_{int(time.time())}"
            self.log.info(f"Database: Replaced 'unknown' with fallback phone: {phone}")
        
        consultation = {
            "phone": phone,
            "closet_type": closet_type,
            "number_of_spaces": number_of_spaces,
            "status": "pending_confirmation",
            "created_at": datetime.now().isoformat(),
            "consultation_type": "phone_only",
            "confirmation_status": "pending"
        }
        
        # Add optional fields if provided
        if name:
            consultation["name"] = name
        if address:
            consultation["address"] = address
        if zip_code:
            consultation["zip_code"] = zip_code
        if preferred_date:
            consultation["preferred_date"] = preferred_date
        if preferred_time:
            consultation["preferred_time"] = preferred_time
        
        # Add caller phone number if available
        if caller_phone:
            consultation["caller_phone"] = caller_phone
            consultation["phone_source"] = "extracted_from_call"
        else:
            consultation["phone_source"] = "provided_by_customer"
        
        try:
            result = self.collection.insert_one(consultation)
            self.log.info(f"Database: Created pending consultation with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except PyMongoError as e:
            self.log.error(f"Database: Failed to create pending consultation: {e}")
            return None

    # Confirm a pending consultation
    def confirm_consultation(self, consultation_id: str) -> bool:
        """Confirm a pending consultation by updating its status"""
        try:
            from bson import ObjectId
            result = self.collection.update_one(
                {"_id": ObjectId(consultation_id)},
                {
                    "$set": {
                        "status": "scheduled",
                        "confirmation_status": "confirmed",
                        "confirmed_at": datetime.now().isoformat()
                    }
                }
            )
            if result.modified_count > 0:
                self.log.info(f"Database: Successfully confirmed consultation {consultation_id}")
                return True
            else:
                self.log.warning(f"Database: No consultation found with ID {consultation_id}")
                return False
        except PyMongoError as e:
            self.log.error(f"Database: Failed to confirm consultation {consultation_id}: {e}")
            return False

    # Retrieve a consultation document by phone number
    def get_consultation_by_phone(self, phone: str) -> Optional[dict]:
        try:
            # Search for a consultation with the matching phone number, get the most recent one
            consultation = self.collection.find_one({"phone": phone}, sort=[("_id", -1)])
            return consultation
        except PyMongoError:
            return None
