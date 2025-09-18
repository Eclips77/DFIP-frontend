from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from pydantic import BaseModel
from api.db.mongodb import get_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class CameraSummary(BaseModel):
    camera_id: str
    total_detections: int
    unique_people: int
    first_detection: Optional[str] = None
    last_detection: Optional[str] = None

class CameraPerson(BaseModel):
    person_id: str
    detection_count: int
    first_detection: Optional[str] = None
    last_detection: Optional[str] = None

@router.get("/cameras", response_model=List[CameraSummary])
async def get_cameras(db_session = Depends(get_db)):
    """Get list of all cameras with their detection statistics"""
    try:
        collection = db_session.db.Event
        
        pipeline = [
            {
                "$match": {
                    "camera_id": {"$exists": True, "$ne": None, "$ne": ""}
                }
            },
            {
                "$group": {
                    "_id": "$camera_id",
                    "total_detections": {"$sum": 1},
                    "unique_people": {"$addToSet": "$person_id"},
                    "first_detection": {"$min": "$alert_time"},
                    "last_detection": {"$max": "$alert_time"}
                }
            },
            {
                "$project": {
                    "camera_id": "$_id",
                    "total_detections": 1,
                    "unique_people": {"$size": "$unique_people"},
                    "first_detection": 1,
                    "last_detection": 1,
                    "_id": 0
                }
            },
            {
                "$sort": {"total_detections": -1}
            }
        ]
        
        results = await collection.aggregate(pipeline).to_list(length=None)
        
        cameras = []
        for result in results:
            cameras.append(CameraSummary(
                camera_id=result["camera_id"],
                total_detections=result["total_detections"],
                unique_people=result["unique_people"],
                first_detection=result.get("first_detection"),
                last_detection=result.get("last_detection")
            ))
        
        logger.info(f"Retrieved {len(cameras)} cameras")
        return cameras
        
    except Exception as e:
        logger.error(f"Error getting cameras: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve cameras: {str(e)}")

@router.get("/cameras/{camera_id}/people", response_model=List[CameraPerson])
async def get_people_by_camera(
    camera_id: str,
    limit: Optional[int] = Query(default=100, le=1000),
    db_session = Depends(get_db)
):
    """Get all people detected by a specific camera"""
    try:
        collection = db_session.db.Event
        
        pipeline = [
            {
                "$match": {
                    "camera_id": camera_id,
                    "person_id": {"$exists": True, "$ne": None, "$ne": ""}
                }
            },
            {
                "$group": {
                    "_id": "$person_id",
                    "detection_count": {"$sum": 1},
                    "first_detection": {"$min": "$alert_time"},
                    "last_detection": {"$max": "$alert_time"}
                }
            },
            {
                "$project": {
                    "person_id": "$_id",
                    "detection_count": 1,
                    "first_detection": 1,
                    "last_detection": 1,
                    "_id": 0
                }
            },
            {
                "$sort": {"detection_count": -1}
            },
            {
                "$limit": limit
            }
        ]
        
        results = await collection.aggregate(pipeline).to_list(length=None)
        
        people = []
        for result in results:
            people.append(CameraPerson(
                person_id=result["person_id"],
                detection_count=result["detection_count"],
                first_detection=result.get("first_detection"),
                last_detection=result.get("last_detection")
            ))
        
        logger.info(f"Retrieved {len(people)} people for camera {camera_id}")
        return people
        
    except Exception as e:
        logger.error(f"Error getting people for camera {camera_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve people for camera: {str(e)}")