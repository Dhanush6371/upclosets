# import json
# from http.server import BaseHTTPRequestHandler, HTTPServer
# from pymongo import MongoClient
# from langchain_google_genai import ChatGoogleGenerativeAI

# # ------------------------
# # CONFIG
# # ------------------------
# GOOGLE_API_KEY = "AIzaSyAey9XaAnsJG0FqSATTsQmGUEQepP5o-1Y"
# MONGO_URI = "mongodb+srv://Dhanush6371:Dhanush2002@cluster0.jgcdt.mongodb.net/?retryWrites=true&w=majority"

# client = MongoClient(MONGO_URI)
# db = client["test"]

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.0-flash",
#     google_api_key=GOOGLE_API_KEY,
#     temperature=0.1
# )

# class MyServer(BaseHTTPRequestHandler):
#     def send_cors_headers(self):
#         self.send_header("Access-Control-Allow-Origin", "*")
#         self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
#         self.send_header("Access-Control-Allow-Headers", "Content-Type")

#     # ---------- FIX: Allow preflight ----------
#     def do_OPTIONS(self):
#         self.send_response(200)
#         self.send_cors_headers()
#         self.end_headers()

#     # ---------- POST endpoint ----------
#     def do_POST(self):
#         if self.path == "/ask":
#             self.send_response(200)
#             self.send_cors_headers()
#             self.send_header("Content-type", "application/json")
#             self.end_headers()

#             # Read input
#             length = int(self.headers.get("Content-Length"))
#             body = json.loads(self.rfile.read(length))
#             question = body.get("question", "")

#             # STEP 1: create Mongo filter
#             prompt = f"""
#             Convert this question into a MongoDB filter JSON.
#             Only return JSON.
#             Question: "{question}"
#             """
#             filter_json = llm.invoke(prompt).content.strip()

#             try:
#                 mongo_filter = eval(filter_json)
#             except:
#                 mongo_filter = {}

#             # STEP 2: Query Mongo
#             collections = ["orders", "consultations"]
#             all_docs = []
#             for col in collections:
#                 docs = list(db[col].find(mongo_filter, {"_id": 0}).limit(10))
#                 all_docs.extend(docs)

#             # STEP 3: Generate final answer
#             ans_prompt = f"""
#             User question: {question}
#             Matching records: {all_docs}
#             Answer clearly.
#             If nothing found, say: No matching data found.
#             """
#             answer = llm.invoke(ans_prompt).content

#             # send response
#             response = {"answer": answer}
#             self.wfile.write(json.dumps(response).encode())

# # ------------------------
# # START SERVER
# # ------------------------
# if __name__ == "__main__":
#     print("🚀 AI Chatbot Server running on http://localhost:8000")
#     httpd = HTTPServer(("localhost", 8000), MyServer)
#     httpd.serve_forever()
# ---------------------------------------------------------------------------------------------
# import json
# import re
# from http.server import BaseHTTPRequestHandler, HTTPServer
# from pymongo import MongoClient
# from langchain_google_genai import ChatGoogleGenerativeAI

# # --------------------------
# # CONFIG
# # --------------------------
# GOOGLE_API_KEY = "AIzaSyAey9XaAnsJG0FqSATTsQmGUEQepP5o-1Y"
# MONGO_URI = "mongodb+srv://Dhanush6371:Dhanush2002@cluster0.jgcdt.mongodb.net/?retryWrites=true&w=majority"

# client = MongoClient(MONGO_URI)
# db = client["test"]

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.0-flash",
#     google_api_key=GOOGLE_API_KEY,
#     temperature=0.1
# )


# # ----------------------------------------
# # 1️⃣ Auto Extract Order ID (Fixes all formats)
# # ----------------------------------------
# def extract_order_id(question: str):
#     match = re.findall(r'\d+', question)
#     if not match:
#         return None
#     num = match[0].zfill(3)
#     return f"ORD-{num}"


# # ----------------------------------------
# # 2️⃣ Detect if question is "how many / count"
# # ----------------------------------------
# def is_count_question(q):
#     q = q.lower()
#     return any(word in q for word in ["how many", "count", "number of"])


# # ----------------------------------------------------
# # 3️⃣ Field Mapping (LLM → REAL MongoDB field names)
# # ----------------------------------------------------
# ORDERS_FIELD_MAP = {
#     "order_id": "orderId",
#     "customer_name": "customerName",
#     "name": "customerName",
#     "status": "progressStage",
#     "stage": "progressStage",
# }

# CONSULT_FIELD_MAP = {
#     "name": "name",
#     "status": "status",
#     "phone": "phone",
# }


# # ----------------------------------------------------
# # 4️⃣ Normalize Filter Keys to Real Mongo Fields
# # ----------------------------------------------------
# def normalize_filter(filter_dict, collection_type):
#     new_filter = {}
#     mapping = ORDERS_FIELD_MAP if collection_type == "orders" else CONSULT_FIELD_MAP

#     for key, value in filter_dict.items():
#         k = key.lower().replace(" ", "_")
#         real_key = mapping.get(k, key)
#         new_filter[real_key] = value

#     return new_filter


# class MyServer(BaseHTTPRequestHandler):

#     def send_cors_headers(self):
#         self.send_header("Access-Control-Allow-Origin", "*")
#         self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
#         self.send_header("Access-Control-Allow-Headers", "Content-Type")

#     def do_OPTIONS(self):
#         self.send_response(200)
#         self.send_cors_headers()
#         self.end_headers()

#     # ===============================================
#     #                MAIN API
#     # ===============================================
#     def do_POST(self):
#         if self.path == "/ask":

#             self.send_response(200)
#             self.send_cors_headers()
#             self.send_header("Content-type", "application/json")
#             self.end_headers()

#             length = int(self.headers.get("Content-Length"))
#             body = json.loads(self.rfile.read(length))
#             question = body.get("question", "")

#             # ------------------------------------------------
#             # 1️⃣ AUTO ORDER-ID DETECTION
#             # ------------------------------------------------
#             order_id = extract_order_id(question)
#             mongo_filter_orders = {}
#             mongo_filter_consults = {}

#             if order_id:
#                 mongo_filter_orders = {"orderId": order_id}

#             else:
#                 # ------------------------------------------------
#                 # 2️⃣ ASK LLM TO GENERATE FILTER
#                 # ------------------------------------------------
#                 prompt = f"""
#                 Convert the question into a MongoDB filter JSON.

#                 RULES:
#                 - If user mentions orders like ord14, order 14 → return {{"order_id": "ORD-014"}}
#                 - If it's a customer name → return {{"customer_name": "<name>"}}
#                 - For consultations → return {{"name": "<name>"}}
#                 - Phone lookup → return {{"phone": "<number>"}}
#                 - Respond ONLY with pure JSON.

#                 Question: "{question}"
#                 """

#                 try:
#                     filter_json = llm.invoke(prompt).content.strip()
#                     llm_filter = json.loads(filter_json)
#                 except:
#                     llm_filter = {}

#                 mongo_filter_orders = normalize_filter(llm_filter, "orders")
#                 mongo_filter_consults = normalize_filter(llm_filter, "consult")

#             # ------------------------------------------------
#             # 3️⃣ COUNTING QUESTIONS (FIXED — NO FILTERS)
#             # ------------------------------------------------
#             if is_count_question(question):

#                 q_lower = question.lower()

#                 # ----- COUNT CONSULTATIONS -----
#                 if "consult" in q_lower or "appointment" in q_lower:
#                     count_consults = db["consultations"].count_documents({})
#                     answer = f"There are {count_consults} consultations."
#                     self.wfile.write(json.dumps({"answer": answer}).encode())
#                     return

#                 # ----- COUNT ORDERS -----
#                 if "order" in q_lower:
#                     count_orders = db["orders"].count_documents({})
#                     answer = f"There are {count_orders} orders."
#                     self.wfile.write(json.dumps({"answer": answer}).encode())
#                     return

#                 # ----- COUNT EVERYTHING -----
#                 count_orders = db["orders"].count_documents({})
#                 count_consults = db["consultations"].count_documents({})
#                 total = count_orders + count_consults

#                 answer = f"There are {total} total records."
#                 self.wfile.write(json.dumps({"answer": answer}).encode())
#                 return

#             # ------------------------------------------------
#             # 4️⃣ RUN MONGO QUERIES (NON-COUNT QUESTIONS)
#             # ------------------------------------------------
#             all_docs = []

#             orders = list(db["orders"].find(mongo_filter_orders, {"_id": 0}).limit(10))
#             all_docs.extend(orders)

#             consultations = list(db["consultations"].find(mongo_filter_consults, {"_id": 0}).limit(10))
#             all_docs.extend(consultations)

#             # ------------------------------------------------
#             # 5️⃣ FINAL AI ANSWER GENERATION
#             # ------------------------------------------------
#             ans_prompt = f"""
#             User question: {question}
#             Matching records: {all_docs}

#             RULES:
#             - If it's an order → explain progressStage, designCompleted, productionPercentage, finishingCompleted, dispatchCompleted.
#             - If it's a consultation → explain name, status, preferred_date, preferred_time.
#             - If nothing found → reply EXACTLY: "No matching data found."
#             - Fix spelling mistakes.
#             - Short, clean answer.
#             """

#             answer = llm.invoke(ans_prompt).content

#             self.wfile.write(json.dumps({"answer": answer}).encode())


# # ------------------------
# # START SERVER
# # ------------------------
# if __name__ == "__main__":
#     print("🚀 AI Chatbot Server running at http://localhost:8000")
#     httpd = HTTPServer(("localhost", 8000), MyServer)
#     httpd.serve_forever()




# --------------------------------------------------------------------------------------------

import json
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from pymongo import MongoClient
from langchain_google_genai import ChatGoogleGenerativeAI


# --------------------------
# CONFIG
# --------------------------
GOOGLE_API_KEY = "AIzaSyAey9XaAnsJG0FqSATTsQmGUEQepP5o-1Y"
MONGO_URI = "mongodb+srv://Dhanush6371:Dhanush2002@cluster0.jgcdt.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["test"]

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.1
)

# --------------------------
# SIMPLE FAST CACHE
# --------------------------
CACHE = {}
CACHE_LIMIT = 25


def cache_get(question):
    q = question.strip().lower()
    return CACHE.get(q)


def cache_set(question, answer):
    q = question.strip().lower()

    if len(CACHE) >= CACHE_LIMIT:
        CACHE.pop(next(iter(CACHE)))  # remove oldest

    CACHE[q] = answer


# ----------------------------------------
# ORDER-ID EXTRACTION (0 cost, 100% accuracy)
# ----------------------------------------
def extract_order_id(question: str):
    match = re.findall(r'\d+', question)
    if not match:
        return None
    num = match[0].zfill(3)
    return f"ORD-{num}"


# ----------------------------------------
# DETECT COUNTING QUESTIONS
# ----------------------------------------
def is_count_question(q):
    q = q.lower()
    return any(word in q for word in ["how many", "count", "number of"])


# ----------------------------------------
# DECIDE IF QUESTION IS ABOUT ORDERS OR CONSULTATIONS
# ----------------------------------------
def detect_category(q):
    q = q.lower()

    order_keywords = ["ord", "order", "dispatch", "production", "design", "finish"]
    consult_keywords = ["consult", "appointment", "schedule", "phone", "meeting"]

    if any(k in q for k in order_keywords):
        return "orders"
    if any(k in q for k in consult_keywords):
        return "consultations"

    return "both"  # fallback if unclear


class MyServer(BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    # ===============================================
    #                MAIN API
    # ===============================================
    def do_POST(self):
        if self.path == "/ask":

            self.send_response(200)
            self.send_cors_headers()
            self.send_header("Content-type", "application/json")
            self.end_headers()

            length = int(self.headers.get("Content-Length"))
            body = json.loads(self.rfile.read(length))
            question = body.get("question", "").strip()

            # ------------------------------------------------
            # 0️⃣ CHECK CACHE (FAST)
            # ------------------------------------------------
            cached = cache_get(question)
            if cached:
                self.wfile.write(json.dumps({"answer": cached}).encode())
                return

            # ------------------------------------------------
            # 1️⃣ CATEGORY DETECTION (FAST)
            # ------------------------------------------------
            category = detect_category(question)

            # ------------------------------------------------
            # 2️⃣ AUTO ORDER-ID DETECTION (FAST)
            # ------------------------------------------------
            order_id = extract_order_id(question)
            mongo_filter_orders = {}
            mongo_filter_consults = {}

            if order_id:
                mongo_filter_orders = {"orderId": order_id}

            # ------------------------------------------------
            # 3️⃣ COUNTING QUESTIONS (SUPER FAST, NO LLM)
            # ------------------------------------------------
            if is_count_question(question):

                if "consult" in question.lower():
                    count = db["consultations"].count_documents({})
                    answer = f"There are {count} consultations."
                    cache_set(question, answer)
                    self.wfile.write(json.dumps({"answer": answer}).encode())
                    return

                if "order" in question.lower():
                    count = db["orders"].count_documents({})
                    answer = f"There are {count} orders."
                    cache_set(question, answer)
                    self.wfile.write(json.dumps({"answer": answer}).encode())
                    return

                # total
                total = db["orders"].count_documents({}) + db["consultations"].count_documents({})
                answer = f"There are {total} total records."
                cache_set(question, answer)
                self.wfile.write(json.dumps({"answer": answer}).encode())
                return

            # ------------------------------------------------
            # 4️⃣ LLM FILTER ONLY WHEN NEEDED (SAVES COST)
            # ------------------------------------------------
            if not mongo_filter_orders:
                prompt = f"""
                Convert this question into a MongoDB filter JSON.

                RULES:
                - If order id → output: {{"order_id": "ORD-014"}}
                - If customer name → {{"customer_name": "<name>"}}
                - If consultation → {{"name": "<name>"}}
                - If phone → {{"phone": "<number>"}}
                - ONLY return pure JSON.

                Question: "{question}"
                """

                try:
                    filter_json = llm.invoke(prompt).content.strip()
                    llm_filter = json.loads(filter_json)
                except:
                    llm_filter = {}

                # Map to real fields
                if "order_id" in llm_filter:
                    mongo_filter_orders = {"orderId": llm_filter["order_id"]}

                if "customer_name" in llm_filter:
                    mongo_filter_orders = {"customerName": llm_filter["customer_name"]}

                if "name" in llm_filter:
                    mongo_filter_consults = {"name": llm_filter["name"]}

                if "phone" in llm_filter:
                    mongo_filter_consults = {"phone": llm_filter["phone"]}

            # ------------------------------------------------
            # 5️⃣ RUN MONGO QUERY (MUCH FASTER NOW)
            # ------------------------------------------------
            all_docs = []

            if category in ["orders", "both"]:
                orders = list(db["orders"].find(mongo_filter_orders, {"_id": 0}).limit(10))
                all_docs.extend(orders)

            if category in ["consultations", "both"]:
                consults = list(db["consultations"].find(mongo_filter_consults, {"_id": 0}).limit(10))
                all_docs.extend(consults)

            # ------------------------------------------------
            # 6️⃣ FINAL LLM ANSWER (ONLY WHEN NEEDED)
            # ------------------------------------------------
            ans_prompt = f"""
            User question: {question}
            Matching records: {all_docs}

            RULES:
            - If order → summarize progressStage, production, finishing, dispatch.
            - If consultation → summarize status, date, time.
            - If none → reply EXACTLY: "No matching data found."
            - Fix spelling errors.
            - Give a short answer.
            """

            answer = llm.invoke(ans_prompt).content

            cache_set(question, answer)
            self.wfile.write(json.dumps({"answer": answer}).encode())


# ------------------------
# START SERVER
# ------------------------
if __name__ == "__main__":
    print("🚀 Super-Optimized AI Server running at http://localhost:8000")
    httpd = HTTPServer(("localhost", 8000), MyServer)
    httpd.serve_forever()


