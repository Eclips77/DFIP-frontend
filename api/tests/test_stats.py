import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import MagicMock, AsyncMock

@pytest.mark.asyncio
async def test_get_stats_with_mock_db(monkeypatch):
    """
    Test the /api/v1/stats endpoint with a mocked database.
    """
    monkeypatch.setenv("MONGO_URI", "mongodb://localhost:27017")
    monkeypatch.setenv("MONGO_DB", "testdb")

    # Import the app and dependencies here, after env vars are set
    from api.main import app
    from api.db.mongodb import get_db

    # Mock database dependency
    async def override_get_db():
        mock_db_session = MagicMock()
        total_alerts_result = [{"count": 150}]
        alerts_24h_result = [{"count": 25}]
        distinct_people_result = [{"count": 8}]
        active_cameras_result = [{"count": 4}]
        total_alerts_mock = AsyncMock(return_value=total_alerts_result)
        alerts_24h_mock = AsyncMock(return_value=alerts_24h_result)
        distinct_people_mock = AsyncMock(return_value=distinct_people_result)
        active_cameras_mock = AsyncMock(return_value=active_cameras_result)
        mock_alerts_collection = MagicMock()
        mock_alerts_collection.aggregate.side_effect = [
            MagicMock(to_list=total_alerts_mock),
            MagicMock(to_list=alerts_24h_mock),
            MagicMock(to_list=distinct_people_mock),
            MagicMock(to_list=active_cameras_mock),
        ]
        mock_db_session.alerts_collection = mock_alerts_collection
        return mock_db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/stats")

    assert response.status_code == 200

    data = response.json()
    assert data["total_alerts"] == 150
    assert data["alerts_24h"] == 25
    assert data["distinct_people"] == 8
    assert data["active_cameras"] == 4
