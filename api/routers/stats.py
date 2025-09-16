from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import List
from api.db.mongodb import db, get_db

router = APIRouter()

class StatsSchema(BaseModel):
    """
    Pydantic model for the aggregated stats response.
    """
    total_alerts: int = Field(..., description="Total number of alerts in the database.")
    alerts_24h: int = Field(..., description="Number of alerts in the last 24 hours.")
    distinct_people: int = Field(..., description="Count of unique person_id values.")
    active_cameras: int = Field(..., description="Count of unique camera_id values.")

@router.get("/stats", response_model=StatsSchema)
async def get_stats(db_session = Depends(get_db)):
    """
    Retrieve aggregated statistics for the dashboard KPI cards.
    This endpoint uses MongoDB's aggregation framework for efficiency.
    """
    try:
        # Define the time window for the last 24 hours
        twenty_four_hours_ago = datetime.utcnow() - timedelta(days=1)

        # Define aggregation pipelines
        total_alerts_pipeline = [{"$count": "count"}]
        alerts_24h_pipeline = [{"$match": {"time": {"$gte": twenty_four_hours_ago}}}, {"$count": "count"}]
        distinct_people_pipeline = [{"$group": {"_id": "$person_id"}}, {"$count": "count"}]
        active_cameras_pipeline = [{"$group": {"_id": "$camera_id"}}, {"$count": "count"}]

        # Execute pipelines in parallel
        total_alerts_task = db_session.alerts_collection.aggregate(total_alerts_pipeline).to_list(length=1)
        alerts_24h_task = db_session.alerts_collection.aggregate(alerts_24h_pipeline).to_list(length=1)
        distinct_people_task = db_session.alerts_collection.aggregate(distinct_people_pipeline).to_list(length=1)
        active_cameras_task = db_session.alerts_collection.aggregate(active_cameras_pipeline).to_list(length=1)

        # Await all results
        results = await db.client.gather(
            total_alerts_task, alerts_24h_task, distinct_people_task, active_cameras_task
        )

        total_alerts_res, alerts_24h_res, distinct_people_res, active_cameras_res = results

        # Extract counts, defaulting to 0 if no documents are found
        total_alerts = total_alerts_res[0]["count"] if total_alerts_res else 0
        alerts_24h = alerts_24h_res[0]["count"] if alerts_24h_res else 0
        distinct_people = distinct_people_res[0]["count"] if distinct_people_res else 0
        active_cameras = active_cameras_res[0]["count"] if active_cameras_res else 0

        return {
            "total_alerts": total_alerts,
            "alerts_24h": alerts_24h,
            "distinct_people": distinct_people,
            "active_cameras": active_cameras,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching stats: {e}")

class TimeSeriesDataPoint(BaseModel):
    """
    Pydantic model for a single data point in a time-series.
    """
    time_bucket: datetime = Field(alias="_id")
    count: int

@router.get("/stats/over-time", response_model=List[TimeSeriesDataPoint])
async def get_stats_over_time(
    days: int = Query(7, ge=1, le=90, description="Number of past days to aggregate over."),
    db_session=Depends(get_db)
):
    """
    Retrieve time-series data for alerts, bucketed automatically.
    """
    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # This pipeline groups alerts into a maximum of 100 buckets over the specified time range.
        pipeline = [
            {"$match": {"time": {"$gte": start_date}}},
            {
                "$bucketAuto": {
                    "groupBy": "$time",
                    "buckets": 100,
                    "output": {
                        "count": {"$sum": 1}
                    }
                }
            },
            {"$sort": {"_id": 1}}
        ]

        results = await db_session.alerts_collection.aggregate(pipeline).to_list(length=None)
        # The result from $bucketAuto gives _id as an object {min:..., max:...}. We'll take the min.
        return [{"_id": item["_id"]["min"], "count": item["count"]} for item in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching time-series data: {e}")
