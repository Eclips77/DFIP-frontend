from bson import ObjectId
from typing import Any

# The following is a Pydantic V2-compatible way to handle MongoDB ObjectIds.
# It ensures that strings are validated as ObjectIds and ObjectIds are serialized to strings.

class PyObjectId(ObjectId):
    """
    Custom Pydantic type for MongoDB's ObjectId.
    """
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v: Any, *args, **kwargs) -> ObjectId:
        """Validate that the input is a valid ObjectId."""
        if isinstance(v, ObjectId):
            return v
        if ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler) -> dict:
        """
        Return a Pydantic CoreSchema that defines how to handle this type.
        """
        from pydantic_core import core_schema

        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.is_instance_schema(ObjectId),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda instance: str(instance)
            ),
        )
