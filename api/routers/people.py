from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from api.db.mongodb import get_db
from pydantic import BaseModel, Field

router = APIRouter()

class PersonSummary(BaseModel):
    """
    Summary information about a person based on their alerts
    """
    person_id: str = Field(..., description="Unique identifier for the person")
    alert_count: int = Field(..., description="Total number of alerts for this person")
    first_seen: datetime = Field(..., description="Date of first alert")
    last_seen: datetime = Field(..., description="Date of most recent alert")
    image_ids: List[str] = Field(..., description="List of all image IDs for this person")
    sample_image_id: Optional[str] = Field(None, description="One image ID to use as profile picture")

class PersonImage(BaseModel):
    """
    Image information for a specific person
    """
    image_id: str = Field(..., description="Image identifier")
    alert_time: datetime = Field(..., description="When this image was captured")
    camera_id: str = Field(..., description="Camera that captured the image")
    alert_level: str = Field(..., description="Alert level (alert, info, warning)")
    message: str = Field(..., description="Alert message")

@router.get("/people", response_model=List[PersonSummary])
async def list_people(db_session = Depends(get_db)):
    """
    Get all unique people from the alerts collection with their statistics
    """
    try:
        # Aggregate to get person statistics
        pipeline = [
            {
                "$group": {
                    "_id": "$person_id",
                    "alert_count": {"$sum": 1},
                    "first_seen": {"$min": "$time"},
                    "last_seen": {"$max": "$time"},
                    "image_ids": {"$push": "$image_id"},
                    "sample_image_id": {"$first": "$image_id"}
                }
            },
            {
                "$sort": {"last_seen": -1}  # Sort by most recent activity
            }
        ]
        
        results = await db_session.db.Event.aggregate(pipeline).to_list(length=None)
        
        people = []
        for result in results:
            # Filter out None/null image_ids
            valid_image_ids = [img_id for img_id in result["image_ids"] if img_id is not None]
            
            people.append(PersonSummary(
                person_id=result["_id"],
                alert_count=result["alert_count"],
                first_seen=result["first_seen"],
                last_seen=result["last_seen"],
                image_ids=valid_image_ids,
                sample_image_id=result["sample_image_id"] if result["sample_image_id"] else None
            ))
        
        return people
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving people: {str(e)}")

@router.get("/people/{person_id}/images", response_model=List[PersonImage])
async def get_person_images(person_id: str, db_session = Depends(get_db)):
    """
    Get all images for a specific person
    """
    try:
        # Find all alerts for this person
        alerts = await db_session.db.Event.find(
            {"person_id": person_id},
            sort=[("time", -1)]  # Most recent first
        ).to_list(length=None)
        
        if not alerts:
            raise HTTPException(status_code=404, detail=f"No alerts found for person {person_id}")
        
        images = []
        for alert in alerts:
            if alert.get("image_id"):  # Only include alerts with images
                images.append(PersonImage(
                    image_id=alert["image_id"],
                    alert_time=alert["time"],
                    camera_id=alert.get("camera_id", "unknown"),
                    alert_level=alert.get("level", "info"),
                    message=alert.get("message", "")
                ))
        
        return images
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving images for person: {str(e)}")

@router.get("/people/{person_id}")
async def get_person_details(person_id: str, db_session = Depends(get_db)):
    """
    Get detailed information about a specific person
    """
    try:
        # Get person summary
        pipeline = [
            {"$match": {"person_id": person_id}},
            {
                "$group": {
                    "_id": "$person_id",
                    "alert_count": {"$sum": 1},
                    "first_seen": {"$min": "$time"},
                    "last_seen": {"$max": "$time"},
                    "image_ids": {"$push": "$image_id"},
                    "sample_image_id": {"$first": "$image_id"},
                    "cameras": {"$addToSet": "$camera_id"},
                    "levels": {"$addToSet": "$level"}
                }
            }
        ]
        
        result = await db_session.db.Event.aggregate(pipeline).to_list(length=1)
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Person {person_id} not found")
        
        person_data = result[0]
        valid_image_ids = [img_id for img_id in person_data["image_ids"] if img_id is not None]
        
        return {
            "person_id": person_data["_id"],
            "alert_count": person_data["alert_count"],
            "first_seen": person_data["first_seen"],
            "last_seen": person_data["last_seen"],
            "image_ids": valid_image_ids,
            "sample_image_id": person_data["sample_image_id"] if person_data["sample_image_id"] else None,
            "cameras_detected": person_data["cameras"],
            "alert_levels": person_data["levels"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving person details: {str(e)}")