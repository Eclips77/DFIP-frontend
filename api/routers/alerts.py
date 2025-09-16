from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from api.models.alert import AlertSchema
from api.db.mongodb import db, get_db

router = APIRouter()

@router.get("/alerts", response_model=List[AlertSchema])
async def list_alerts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    start_time: Optional[datetime] = Query(None, description="Start of time range (ISO format)"),
    end_time: Optional[datetime] = Query(None, description="End of time range (ISO format)"),
    level: Optional[str] = Query(None, description="Filter by alert level (alert, info, warning)"),
    camera_id: Optional[str] = Query(None, description="Filter by camera ID"),
    person_id: Optional[str] = Query(None, description="Filter by person ID"),
    message_search: Optional[str] = Query(None, description="Text search in the message field"),
    db_session = Depends(get_db)
):
    """
    Retrieve a paginated and filtered list of alerts.
    """
    query = {}

    # Time range filter
    if start_time or end_time:
        query["time"] = {}
        if start_time:
            query["time"]["$gte"] = start_time
        if end_time:
            query["time"]["$lte"] = end_time

    # Field filters
    if level:
        query["level"] = level
    if camera_id:
        query["camera_id"] = camera_id
    if person_id:
        query["person_id"] = person_id

    # Text search filter
    if message_search:
        query["$text"] = {"$search": message_search}
        # Note: This requires a text index on the 'message' field.
        # Let's add that to the index creation logic.

    # Calculate skip and limit for pagination
    skip = (page - 1) * page_size

    cursor = db_session.alerts_collection.find(query).sort("time", -1).skip(skip).limit(page_size)
    alerts = await cursor.to_list(length=page_size)

    return alerts

@router.get("/alerts/{alert_id}", response_model=AlertSchema)
async def get_alert(alert_id: str, db_session = Depends(get_db)):
    """
    Retrieve a single alert by its ID.
    """
    if not ObjectId.is_valid(alert_id):
        raise HTTPException(status_code=400, detail=f"Invalid alert ID: {alert_id}")

    alert = await db_session.alerts_collection.find_one({"_id": ObjectId(alert_id)})

    if alert is None:
        raise HTTPException(status_code=404, detail=f"Alert with ID {alert_id} not found")

    return alert
