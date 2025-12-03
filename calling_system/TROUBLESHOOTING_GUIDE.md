# Up Closets Agent Connection Troubleshooting Guide

## Issue: Agent Not Connected to Phone When Called

### Root Cause Found ✅
**CRITICAL FIX APPLIED**: Agent name mismatch between dispatch rule and agent runner
- Dispatch rule was looking for: `"inbound_agent"`
- Agent was running as: `"upclosets_consultation_agent"`
- **FIXED**: Updated dispatch rule to use correct agent name

### Complete Setup Checklist

#### 1. Environment Variables (.env file)
Create a `.env` file in the project root with these variables:
```bash
# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_SECRET_KEY=your_livekit_secret

# Twilio Configuration  
TWIML_USERNAME=your_twiml_username
TWIML_PASSWORD=your_twiml_password
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# AI Services
GOOGLE_API_KEY=your_google_api_key

# Database
MONGO_URI=your_mongodb_connection_string

# Optional: Restrict calls to specific numbers
INBOUND_ALLOWED_NUMBERS=+1234567890,+0987654321
```

#### 2. Setup Steps (Run in Order)
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create SIP inbound trunk (run once)
python inbound_trunk.py

# 3. Create dispatch rule (run once) 
python dispatch_rule.py

# 4. Start the agent
python agent.py console
```

#### 3. Verification Steps

**Check Agent Name Match:**
- Dispatch rule agent name: `"upclosets_consultation_agent"` ✅
- Agent runner name: `"upclosets_consultation_agent"` ✅

**Check Environment Variables:**
```bash
# Test if .env file exists and has required variables
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('GOOGLE_API_KEY:', bool(os.getenv('GOOGLE_API_KEY'))); print('MONGO_URI:', bool(os.getenv('MONGO_URI')))"
```

**Check Agent Startup:**
- Look for log message: `"🚀 Starting Up Closets consultation agent (realtime mode)"`
- Look for log message: `"🔧 UpClosetsAgent initialized with job context"`

**Check SIP Trunk Status:**
- Verify trunk was created successfully in LiveKit dashboard
- Check for any error messages during trunk creation

**Check Dispatch Rule:**
- Verify dispatch rule was created successfully
- Check for any conflicts with existing rules

#### 4. Common Issues and Solutions

**Issue: "Missing GOOGLE_API_KEY"**
- Solution: Add `GOOGLE_API_KEY=your_key` to .env file

**Issue: "MONGO_URI environment variable not set"**
- Solution: Add `MONGO_URI=your_mongodb_uri` to .env file

**Issue: "Conflicting SIP Dispatch Rules"**
- Solution: Delete existing conflicting rules in LiveKit dashboard, then re-run `python dispatch_rule.py`

**Issue: "Conflicting inbound SIP Trunks"**
- Solution: Delete existing conflicting trunks in LiveKit dashboard, then re-run `python inbound_trunk.py`

**Issue: Agent starts but calls don't connect**
- Check agent name match (FIXED ✅)
- Verify SIP trunk is active
- Verify dispatch rule is active
- Check LiveKit dashboard for call logs

#### 5. Testing the Connection

**Test Call Flow:**
1. Make a test call to your configured phone number
2. Check agent logs for:
   - `"🚀 Starting Up Closets consultation agent (realtime mode)"`
   - `"📞 Extracted phone number from participant ID: +1234567890"`
   - `"🎤 Generating natural greeting..."`

**Expected Agent Response:**
- Should hear: "Hi! Thank you for calling Up Closets of NOVA. This is Sarah — how can I help you today?"

#### 6. Debugging Commands

**Check if agent is running:**
```bash
ps aux | grep "python agent.py"
```

**Check LiveKit connection:**
```bash
# Test LiveKit API connection
python -c "
from livekit import api
from dotenv import load_dotenv
import os
load_dotenv()
api_key = os.getenv('LIVEKIT_API_KEY')
secret = os.getenv('LIVEKIT_SECRET_KEY')
print('LiveKit API Key:', bool(api_key))
print('LiveKit Secret:', bool(secret))
"
```

**Test MongoDB connection:**
```bash
python -c "
from db import DatabaseDriver
try:
    db = DatabaseDriver()
    print('MongoDB connection: SUCCESS')
except Exception as e:
    print('MongoDB connection: FAILED -', e)
"
```

#### 7. Log Analysis

**Key Log Messages to Look For:**
- ✅ `"🚀 Starting Up Closets consultation agent (realtime mode)"` - Agent started
- ✅ `"🔧 UpClosetsAgent initialized with job context"` - Agent initialized
- ✅ `"📞 Extracted phone number from participant ID: +1234567890"` - Phone extraction working
- ✅ `"🎤 Generating natural greeting..."` - Greeting generation
- ❌ `"Missing GOOGLE_API_KEY"` - API key issue
- ❌ `"MONGO_URI environment variable not set"` - Database issue
- ❌ `"Conflicting SIP Dispatch Rules"` - Dispatch rule conflict

#### 8. Next Steps After Fix

1. **Re-run dispatch rule setup:**
   ```bash
   python dispatch_rule.py
   ```

2. **Restart the agent:**
   ```bash
   python agent.py console
   ```

3. **Test with a phone call**

4. **Monitor logs for successful connection**

The critical agent name mismatch has been fixed. The system should now properly route incoming calls to the agent.


