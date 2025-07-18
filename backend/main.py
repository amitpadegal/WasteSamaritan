from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.db_methods import *
from datetime import date
from pydantic import BaseModel

class Collector(BaseModel):
    id: str
    first_name: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class UserData(BaseModel):
    id: str
    name: str  # This corresponds to firstname in backend
    last_name: str
    address_line1: str
    city: str
    state: str
    pincode: str

@app.post("/add_user")
async def add_user(
    id: str = Query(..., description="User ID"),
    name: str = Query(..., description="First name"),  # Changed from full_name to name
    last_name: str = Query(..., description="Last name"),
    address_line1: str = Query(..., description="Address line 1"),
    city: str = Query(..., description="City"),
    state: str = Query(..., description="State"),
    pincode: str = Query(..., description="PIN code")
):
    result = insert_user(id, name, last_name, address_line1, city, state, pincode)
    return result

@app.post("/add_collector")
async def add_collector(collector: Collector):
    result = insert_collector(collector.id, collector.first_name)
    return result

@app.post("/trash_upload")
async def upload_trash(user_id: str, rating_1: float, rating_2: float, rating_3: float):
    result = insert_trash_upload(user_id, rating_1, rating_2, rating_3)
    return result

@app.get("/get_trash_for_collector/{collector_id}")
async def get_trash_for_collector(collector_id: str):
    result = get_assigned_trash_for_collector(collector_id)
    return result

@app.post("/update_status")
async def update_status(user_id: str, date: date):
    result = update_trash_upload_status(user_id, date)
    return result

@app.get("/average_ratings_per_pincode")
async def average_ratings_per_pincode():
    result = get_average_ratings_per_pincode()
    return result

@app.get("/collectors_report")
async def collectors_report():
    result = get_collector_daily_report()
    return result

@app.get("/overall_report")
async def overall_report():
    avg_ratings = get_average_ratings_per_pincode().data
    daily_report = get_collector_daily_report().data
    result = get_daily_dashboard_metrics()  # already .data

    # 🟩 Transform avg_ratings into sampleRatings format
    sample_ratings = [
        {
            "area": r["pincode"],
            "recycled": r["avg_rating_recyclable"],
            "unrecycled": r["avg_rating_nonrecyclable"],
            "wet": r["avg_rating_wet"],
        }
        for r in avg_ratings
    ]

    # 🟦 Transform daily_report into sampleCollectors format
    sample_collectors = [
        {
            "name": f"{c['first_name']}",
            "allocated": c["assigned_count"],
            "collected": c["collected_count"]
        }
        for c in daily_report
    ]

    # 🟨 Rename result to match sampleInsights format
    sample_insights = {
        "totalHouses": result["total_collected_today"],
        "avgRating": result["avg_citizen_rating"],
        "topCollectors": result["top_performer"],  # Already a list of names
        "lowestArea": result["lowest_rating_pincode"]
    }

    return {
        "average_ratings": sample_ratings,
        "daily_report": sample_collectors,
        "overall_metrics": sample_insights
    }