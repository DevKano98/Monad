from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.websocket import connection_manager

router = APIRouter()


@router.websocket("/ws/feed")
async def feed_socket(websocket: WebSocket) -> None:
    await connection_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
