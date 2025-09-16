import io
from fastapi import APIRouter, HTTPException, Depends, Response
from fastapi.responses import StreamingResponse
from bson import ObjectId
from PIL import Image
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

from api.models.image import GridFSFileSchema
from api.db.mongodb import db, get_db
from api.core.config import settings

router = APIRouter()

THUMBNAIL_SIZE = (200, 200)
THUMBNAIL_BUCKET_NAME = "thumbnails"

@router.get("/images/by-image-id/{image_id}", response_model=GridFSFileSchema)
async def get_image_metadata_by_image_id(image_id: str, db_session = Depends(get_db)):
    """
    Retrieve GridFS file metadata using the custom `image_id` from the alert.
    """
    file_doc = await db_session.db[f"{settings.GRIDFS_BUCKET_NAME}.files"].find_one({"metadata.image_id": image_id})
    if file_doc is None:
        raise HTTPException(status_code=404, detail=f"Image with image_id '{image_id}' not found.")
    return file_doc

@router.get("/images/{file_id}/bytes")
async def stream_image_bytes(file_id: str, db_session = Depends(get_db)):
    """
    Stream the full-size image bytes directly from GridFS.
    """
    if not ObjectId.is_valid(file_id):
        raise HTTPException(status_code=400, detail="Invalid file ID.")

    gridfs_bucket = db_session.fs
    try:
        gridfs_stream = await gridfs_bucket.open_download_stream(ObjectId(file_id))
        # Determine content type based on filename extension
        content_type = "image/jpeg" # Default
        if gridfs_stream.filename and (gridfs_stream.filename.lower().endswith(".png")):
            content_type = "image/png"

        return StreamingResponse(gridfs_stream, media_type=content_type)
    except Exception: # Should be more specific, e.g., NoFile
        raise HTTPException(status_code=404, detail="Image file not found.")

@router.get("/images/{file_id}/thumb")
async def stream_image_thumbnail(file_id: str, db_session = Depends(get_db)):
    """
    Stream a cached thumbnail. If the thumbnail doesn't exist, it's created,
    cached in a separate GridFS bucket, and then streamed.
    """
    if not ObjectId.is_valid(file_id):
        raise HTTPException(status_code=400, detail="Invalid file ID.")

    thumb_bucket = AsyncIOMotorGridFSBucket(db_session.db, bucket_name=THUMBNAIL_BUCKET_NAME)

    # Check if thumbnail already exists
    existing_thumb = await thumb_bucket.find_one({"metadata.original_id": ObjectId(file_id)})
    if existing_thumb:
        thumb_stream = await thumb_bucket.open_download_stream(existing_thumb._id)
        return StreamingResponse(thumb_stream, media_type="image/jpeg")

    # If not, generate it
    original_image_stream = io.BytesIO()
    try:
        await db_session.fs.download_to_stream(ObjectId(file_id), original_image_stream)
        original_image_stream.seek(0)

        with Image.open(original_image_stream) as img:
            img.thumbnail(THUMBNAIL_SIZE)
            thumb_io = io.BytesIO()
            img.convert("RGB").save(thumb_io, "JPEG", quality=90)
            thumb_io.seek(0)

            # Cache the thumbnail in GridFS
            await thumb_bucket.upload_from_stream(
                f"thumb_{file_id}.jpg",
                thumb_io,
                metadata={"original_id": ObjectId(file_id), "contentType": "image/jpeg"}
            )

            # Rewind and stream it back
            thumb_io.seek(0)
            return StreamingResponse(thumb_io, media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not find or process original image. Error: {e}")
