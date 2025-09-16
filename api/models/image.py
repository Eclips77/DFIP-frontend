from pydantic import BaseModel, Field
from datetime import datetime
from api.models.common import PyObjectId

class GridFSMetaDataSchema(BaseModel):
    """
    Pydantic model for the 'metadata' sub-document within a GridFS file document.
    """
    image_id: str = Field(...)
    event_ts: datetime = Field(..., alias="event_ts")

class GridFSFileSchema(BaseModel):
    """
    Pydantic model for the 'fs.files' collection documents.
    """
    id: PyObjectId = Field(alias="_id", default=None)
    metadata: GridFSMetaDataSchema = Field(...)
    chunk_size: int = Field(..., alias="chunkSize")
    length: int = Field(...)
    upload_date: datetime = Field(..., alias="uploadDate")
    filename: str = Field(...) # filename is a standard field in fs.files

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "id": "68c971cbd28b11b0e6450183",
                "metadata": {
                    "image_id": "642f8d06-d23f-5079-95fb-a04d88381959",
                    "event_ts": "2025-09-16T14:18:50.921Z",
                },
                "chunkSize": 261120,
                "length": 8789,
                "uploadDate": "2025-09-16T14:18:51.051Z",
                "filename": "image-642f8d06.jpg"
            }
        }
