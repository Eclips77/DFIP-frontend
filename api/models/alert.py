from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Union
from api.models.common import PyObjectId

class AlertSchema(BaseModel):
    """
    Pydantic model for the 'alerts' collection documents.
    This model is used for validation and serialization.
    """
    id: PyObjectId = Field(alias="_id")
    person_id: Union[str, int] = Field(...)
    time: datetime = Field(alias="Processing_time")  # Use Processing_time from MongoDB
    level: Literal["high", "medium", "low", "alert multiple", "info", "warning", "alert"] = Field(...)
    image_id: Union[str, int] = Field(...)
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
                "person_id": 1001,
                "time": "2025-09-16T14:17:22.494Z",
                "level": "high",
                "image_id": 2001,
                "camera_id": "CAM001",
                "message": "Person detected at main entrance",
            }
        }
