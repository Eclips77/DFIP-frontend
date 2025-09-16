import json
import os
import sys

# Add the root of the project to the Python path
# This allows the script to import modules from the `api` package
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.openapi.utils import get_openapi
from api.main import app

def generate_openapi_spec():
    """
    Generates the OpenAPI JSON schema from the FastAPI application
    and saves it to the `api` directory.
    """
    print("Generating OpenAPI schema...")

    # The get_openapi function extracts the schema from the app
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )

    # Define the output path
    output_path = os.path.join("api", "openapi.json")

    # Write the schema to the file
    with open(output_path, "w") as f:
        json.dump(openapi_schema, f, indent=2)

    print(f"OpenAPI schema saved to {output_path}")

if __name__ == "__main__":
    # This block allows the script to be run directly
    generate_openapi_spec()
