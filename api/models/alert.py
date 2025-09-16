from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal
from api.models.common import PyObjectId

class AlertSchema(BaseModel):
    """
    Pydantic model for the 'alerts' collection documents.
    This model is used for validation and serialization.
    """
    id: PyObjectId = Field(alias="_id", default=None)
    person_id: str = Field(...)
    time: datetime = Field(...)
    level: Literal["alert", "info", "warning"] = Field(...)
    image_id: str = Field(...)
    camera_id: str = Field(...)
    message: str = Field(...)

    class Config:
        """
        Pydantic model configuration.
        - `populate_by_name`: Allows initializing the model with field names (e.g., `_id`)
          even if the model uses an alias (`id`).
        - `arbitrary_types_allowed`: Necessary to allow custom types like `PyObjectId`.
        """
        populate_by_name = True
        arbitrary_types_allowed = True
        json_schema_extra = {
            "example": {
                "id": "68c971856e8881dad7769617",
                "person_id": "67862bc752f285bb212702bd25e737c7e011a3cf7f096b5c17ff3d48c6c6ac4e",
                "time": "2025-09-16T14:17:22.494Z",
                "level": "alert",
                "image_id": "5af89eae-1785-52a9-8414-07f66bc6d7a1",
                "camera_id": "123",
                "message": "Person detected by camera 123.",
            }
        }
