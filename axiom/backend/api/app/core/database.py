from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    __abstract__ = True


engine: AsyncEngine | None = None
async_session_maker: async_sessionmaker[AsyncSession] | None = None


def get_engine() -> AsyncEngine:
    global engine
    if engine is None:
        database_url = settings.database_url
        connect_args: dict[str, object] = {}
        if "sslmode=require" in database_url:
            database_url = database_url.replace("?sslmode=require", "").replace("&sslmode=require", "")
            connect_args["ssl"] = True
        engine = create_async_engine(
            database_url,
            pool_pre_ping=True,
            echo=settings.debug,
            connect_args=connect_args,
        )
    return engine


def get_session_maker() -> async_sessionmaker[AsyncSession]:
    global async_session_maker
    if async_session_maker is None:
        async_session_maker = async_sessionmaker(get_engine(), class_=AsyncSession, expire_on_commit=False)
    return async_session_maker


async def init_db() -> None:
    from app.models import crash_map, fingerprint, fix, incident, reputation  # noqa: F401

    async with get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    if engine is not None:
        await engine.dispose()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with get_session_maker()() as session:
        yield session
