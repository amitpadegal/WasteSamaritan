from db.db import get_supabase_client
from datetime import datetime, date


supabase = get_supabase_client()

def insert_user(user_id, full_name, last_name, address_line1, city, state, pincode):
    result = supabase.table("users").insert({
        "id": user_id,
        "full_name": full_name,
        "last_name": last_name,
        "address_line1": address_line1,
        "city": city,
        "state": state,
        "pincode": pincode
    }).execute()
    return result

def insert_collector(collector_id, first_name):
    result = supabase.table("collector").insert({
        "id": collector_id,
        "first_name": first_name,
    }).execute()
    return result

def assign_pincode_to_collector(pincode, collector_id):
    result = supabase.table("pincode_assignments").insert({
        "pincode": pincode,
        "collector_id": collector_id
    }).execute()
    return result

def insert_trash_upload(user_id: str, rating_1: float, rating_2: float, rating_3: float):
    try:
        response = supabase.table("trash_uploads").insert({
            "user_id": user_id,
            "date": date.today().isoformat(),  # or pass custom date if needed
            "rating_wet": rating_1,
            "rating_recyclable": rating_2,
            "rating_nonrecyclable": rating_3
        }).execute()
        return response
    except Exception as e:
        raise Exception(f"Error inserting trash upload: {str(e)}")

def get_assigned_trash_for_collector(collector_id: str):
    print(collector_id)
    response = (
        supabase
        .from_("trash_uploads")
        .select("""
            user_id,
            date,
            collected_at,
            rating_wet,
            rating_recyclable,
            rating_nonrecyclable,
            users (
                full_name,
                address_line1,
                city,
                state,
                pincode
            )
        """)
        .eq("status", "assigned")
        .eq("trash_allocated", collector_id)
        .execute()
    )   
    print(response)
    output = []
    for i, entry in enumerate(response.data):
        user = entry["users"]

        # Average rating
        rating = round(
            (entry["rating_wet"] + entry["rating_recyclable"] + entry["rating_nonrecyclable"]) / 3, 2
        )

        # Waste type: type with highest rating
        waste_type = max(
            ("Wet", entry["rating_wet"]),
            ("Recyclable", entry["rating_recyclable"]),
            ("Non-Recyclable", entry["rating_nonrecyclable"]),
            key=lambda x: x[1]
        )[0]

        # Compose output
        output.append({
            "id": str(i + 1),
            "name": user["full_name"],
            "address": f'{user["address_line1"]}, {user["city"]}, {user["state"]} - {user["pincode"]}',
            "rating": rating,
            "lastCollection": entry["collected_at"].split("T")[0] if entry["collected_at"] else None,
            "wasteType": waste_type
        })
    print(output)
    return output

def update_trash_upload_status(user_id: str, date: date):
    current_time = datetime.now().isoformat()

    response = (
        supabase
        .from_("trash_uploads")
        .update({
            "status": "completed",
            "collected_at": current_time
        })
        .eq("user_id", user_id)
        .eq("date", date.isoformat())
        .execute()
    )
    return response

def get_average_ratings_per_pincode():
    response = (
        supabase.rpc(
            "avg_ratings_by_pincode"  # We'll create this SQL function next
        ).execute()
    )
    return response

def get_collector_daily_report():
    response = supabase.rpc("collector_daily_report").execute()
    return response

def get_daily_dashboard_metrics():
    response = supabase.rpc("daily_dashboard_metrics").execute()
    return response.data
