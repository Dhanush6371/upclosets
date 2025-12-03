from __future__ import annotations
import os
import asyncio
import random
import time
import logging
from typing import List, Dict, Any
from dotenv import load_dotenv
from datetime import datetime, timedelta
import re

from livekit import agents
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    WorkerOptions,
    RoomInputOptions,
    function_tool,
)
from livekit.plugins import google, noise_cancellation

# --- Local imports
from db import DatabaseDriver
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION

# --- Load environment variables
load_dotenv()

# --- Logger
log = logging.getLogger("realtime_upclosets_agent")
log.setLevel(logging.INFO)

# --- Database
db_driver = DatabaseDriver()


# ------------------------------------------------------------
# 📅 DATE CONVERSION UTILITIES
# ------------------------------------------------------------
def convert_relative_date_to_exact_date(date_str: str) -> str:
    if not date_str:
        return date_str
    date_lower = date_str.lower().strip()
    today = datetime.now()

    if date_lower in ["tomorrow", "tom"]:
        return (today + timedelta(days=1)).strftime("%Y-%m-%d")
    if date_lower in ["day after tomorrow", "day after", "day after tom"]:
        return (today + timedelta(days=2)).strftime("%Y-%m-%d")

    days_of_week = {
        'monday': 0, 'mon': 0,
        'tuesday': 1, 'tue': 1, 'tues': 1,
        'wednesday': 2, 'wed': 2,
        'thursday': 3, 'thu': 3, 'thur': 3, 'thurs': 3,
        'friday': 4, 'fri': 4,
        'saturday': 5, 'sat': 5,
        'sunday': 6, 'sun': 6
    }

    for day_name, day_num in days_of_week.items():
        if f"next {day_name}" in date_lower:
            days_ahead = day_num - today.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            return (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

    if date_lower in ["next week", "next wk"]:
        days_until_monday = (7 - today.weekday()) % 7 or 7
        return (today + timedelta(days=days_until_monday)).strftime("%Y-%m-%d")

    for day_name, day_num in days_of_week.items():
        if f"this {day_name}" in date_lower:
            days_ahead = day_num - today.weekday()
            if days_ahead < 0:
                days_ahead += 7
            return (today + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

    return date_str


# ------------------------------------------------------------
# 🧩 FUNCTION TOOLS
# ------------------------------------------------------------
current_agent = None
current_job_context = None


def schedule_consultation_tool_factory(agent_instance):
    @function_tool()
    async def schedule_consultation(
        closet_type: str = None,
        number_of_spaces: int = None,
        phone: str = None,
        name: str = None,
        address: str = None,
        zip_code: str = None,
        preferred_date: str = None,
        preferred_time: str = None,
    ):
        if agent_instance and agent_instance.consultation_scheduled:
            return "I'm sorry, but I can only schedule one consultation per call. Your previous appointment has already been confirmed."

        if agent_instance and agent_instance.caller_phone:
            if not phone or phone == "unknown":
                phone = agent_instance.caller_phone

        try:
            if not phone or phone == "unknown":
                phone = f"call_{int(time.time())}"

            if preferred_date:
                preferred_date = convert_relative_date_to_exact_date(preferred_date)

            result = db_driver.schedule_consultation(
                phone=phone,
                closet_type=closet_type,
                number_of_spaces=number_of_spaces,
                name=name,
                address=address,
                zip_code=zip_code,
                preferred_date=preferred_date,
                preferred_time=preferred_time,
            )

            if result:
                agent_instance.consultation_scheduled = True
                asyncio.create_task(agent_instance._terminate_call_after_delay())

            return (
                "✅ Consultation scheduled successfully! Your free consultation appointment "
                "has been confirmed and saved to our system. Lakshmi will contact you shortly "
                "to confirm the details. Thank you for choosing Up Closets of NOVA!"
            )
        except Exception as e:
            log.error(f"Consultation scheduling failed: {e}")
            return "Sorry, there was an error scheduling your consultation. Please try again."

    return schedule_consultation


# ------------------------------------------------------------
# 🧠 AGENT CLASS
# ------------------------------------------------------------
class UpClosetsAgent(Agent):
    def __init__(self, job_context=None):
        combined_instructions = f"{AGENT_INSTRUCTION}\n\n{SESSION_INSTRUCTION}"
        schedule_tool = schedule_consultation_tool_factory(self)
        super().__init__(instructions=combined_instructions, tools=[schedule_tool])
        self.current_session = None
        self.caller_phone = None
        self.consultation_scheduled = False
        self.termination_started = False
        self.job_context = job_context

        global current_agent
        current_agent = self

    # ------------------------------------------------------------
    # 🧩 REPLACED TERMINATION LOGIC (from RestaurantAgent)
    # ------------------------------------------------------------
    async def _terminate_call_after_delay(self):
        job_context = self.job_context
        try:
            log.info("🔧 Starting automatic call termination sequence...")
            await asyncio.sleep(5.0)
            self.termination_started = True

            if self.current_session:
                try:
                    await asyncio.wait_for(
                        self.current_session.generate_reply(
                            instructions="Say: Thank you for choosing Up Closets of NOVA! Goodbye!"
                        ),
                        timeout=4.0,
                    )
                    await asyncio.sleep(6.0)
                except Exception as e:
                    log.warning(f"⚠️ Could not send final goodbye: {e}")

                try:
                    if hasattr(self.current_session, "room") and self.current_session.room:
                        for pid, p in self.current_session.room.remote_participants.items():
                            try:
                                await p.disconnect()
                            except Exception:
                                pass
                except Exception:
                    pass

                try:
                    if hasattr(self.current_session, "room") and self.current_session.room:
                        await self.current_session.room.close()
                except Exception:
                    pass

                for method_name in [
                    "disconnect",
                    "stop",
                    "end",
                    "close",
                    "terminate",
                    "shutdown",
                ]:
                    if hasattr(self.current_session, method_name):
                        try:
                            await getattr(self.current_session, method_name)()
                            break
                        except Exception:
                            continue

                try:
                    if hasattr(self.current_session, "_room") and self.current_session._room:
                        await self.current_session._room.close()
                except Exception:
                    pass

                try:
                    if hasattr(self.current_session, "agent") and self.current_session.agent:
                        if hasattr(self.current_session.agent, "stop"):
                            await self.current_session.agent.stop()
                except Exception:
                    pass

                try:
                    if job_context and hasattr(job_context, "room") and job_context.room:
                        for pid, participant in job_context.room.remote_participants.items():
                            if pid.startswith("sip_"):
                                for m in ["disconnect", "remove", "kick"]:
                                    if hasattr(participant, m):
                                        try:
                                            await getattr(participant, m)()
                                        except Exception:
                                            pass
                except Exception:
                    pass

                try:
                    if job_context and hasattr(job_context, "room") and job_context.room:
                        for pid in job_context.room.remote_participants.keys():
                            if hasattr(job_context.room, "disconnect_participant"):
                                await job_context.room.disconnect_participant(pid)
                except Exception:
                    pass

                try:
                    if job_context and hasattr(job_context, "room") and job_context.room:
                        for pid in job_context.room.remote_participants.keys():
                            if hasattr(job_context.room, "remove_participant"):
                                await job_context.room.remove_participant(pid)
                except Exception:
                    pass

                try:
                    if job_context and hasattr(job_context, "room") and job_context.room:
                        room = job_context.room
                        if hasattr(room, "connection"):
                            conn = room.connection
                            if hasattr(conn, "close"):
                                await conn.close()
                        elif hasattr(room, "_connection"):
                            conn = room._connection
                            if hasattr(conn, "close"):
                                await conn.close()
                except Exception:
                    pass

                try:
                    if job_context and hasattr(job_context, "room") and job_context.room:
                        room = job_context.room
                        for pid, participant in room.remote_participants.items():
                            if pid.startswith("sip_"):
                                if hasattr(participant, "attributes") and participant.attributes:
                                    call_sid = participant.attributes.get("sip.twilio.callSid")
                                    if call_sid:
                                        log.info(f"🔧 Terminating Twilio call SID: {call_sid}")
                                        await self._terminate_twilio_call(call_sid)
                except Exception as e:
                    log.warning(f"⚠️ Twilio termination failed: {e}")

                try:
                    if hasattr(job_context, "disconnect"):
                        await job_context.disconnect()
                except Exception:
                    pass

                self.current_session = None
                log.info("✅ Call termination sequence completed successfully.")
        except Exception as e:
            log.error(f"⚠️ Error in _terminate_call_after_delay: {e}")

    async def _terminate_twilio_call(self, call_sid: str):
        import aiohttp

        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")

        if not account_sid or not auth_token:
            log.warning("⚠️ Twilio credentials missing.")
            return

        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Calls/{call_sid}.json"
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    auth=aiohttp.BasicAuth(account_sid, auth_token),
                    data={"Status": "completed"},
                ) as resp:
                    if resp.status == 200:
                        log.info(f"✅ Twilio call {call_sid} terminated.")
                    else:
                        body = await resp.text()
                        log.warning(f"⚠️ Twilio API failed: {resp.status} - {body}")
        except Exception as e:
            log.error(f"⚠️ Error terminating Twilio call: {e}")


# ------------------------------------------------------------
# 🚀 ENTRYPOINT
# ------------------------------------------------------------
async def entrypoint(ctx: JobContext):
    global current_job_context
    current_job_context = ctx

    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY in environment variables!")

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            voice="Aoede",
            api_key=google_api_key,
            temperature=0.2,
        ),
    )

    agent = UpClosetsAgent(job_context=ctx)
    await ctx.connect()

    caller_phone = None
    try:
        await asyncio.sleep(2.0)
        room = ctx.room
        if room:
            for pid, participant in room.remote_participants.items():
                if pid.startswith("sip_"):
                    phone = pid.replace("sip_", "")
                    if phone.startswith("+"):
                        caller_phone = phone
                        break
                if hasattr(participant, "attributes") and participant.attributes:
                    sip_phone = participant.attributes.get("sip.phoneNumber")
                    if sip_phone:
                        caller_phone = sip_phone
                        break
                if hasattr(participant, "metadata") and participant.metadata:
                    phone_metadata = participant.metadata.get("phoneNumber") or participant.metadata.get("from")
                    if phone_metadata:
                        caller_phone = phone_metadata
                        break
    except Exception:
        pass

    if caller_phone:
        agent.caller_phone = caller_phone
    else:
        agent.caller_phone = "extracted_failed"

    await session.start(
        room=ctx.room,
        agent=agent,
        room_input_options=RoomInputOptions(noise_cancellation=noise_cancellation.BVC()),
    )

    asyncio.create_task(agent.on_start(session))


# ------------------------------------------------------------
# 🏁 MAIN RUNNER
# ------------------------------------------------------------
if __name__ == "__main__":
    agents.cli.run_app(
        WorkerOptions(entrypoint_fnc=entrypoint, agent_name="upclosets_consultation_agent")
    )
