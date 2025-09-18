import pytest
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from api.main import app
from api.db.mongodb import get_db

client = TestClient(app)

# --- Test Health Check Endpoint ---

@pytest.mark.asyncio
@patch("api.main.get_db")
async def test_health_check_success(mock_get_db):
    """
    Test the /health endpoint when the database connection is successful.
    """
    # Mock the database session and the ping command
    mock_db_session = AsyncMock()
    mock_db_session.client.admin.command.return_value = {"ok": 1}
    mock_get_db.return_value = mock_db_session

    # Override the dependency
    app.dependency_overrides[get_db] = lambda: mock_db_session

    # Make the request
    response = client.get("/health")

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "DFIP API", "db": "connected"}

    # Clean up the override
    app.dependency_overrides = {}


@pytest.mark.asyncio
@patch("api.main.get_db")
async def test_health_check_failure(mock_get_db):
    """
    Test the /health endpoint when the database connection fails.
    """
    # Mock the database session and make the ping command raise an exception
    mock_db_session = AsyncMock()
    mock_db_session.client.admin.command.side_effect = Exception("Connection error")
    mock_get_db.return_value = mock_db_session

    # Override the dependency
    app.dependency_overrides[get_db] = lambda: mock_db_session

    # Make the request
    response = client.get("/health")

    # Assert the response
    assert response.status_code == 503
    assert response.json() == {"detail": "database connection failed"}

    # Clean up the override
    app.dependency_overrides = {}
