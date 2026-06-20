from web3 import Web3

from app.core.config import settings


class MonadClient:
    def __init__(self) -> None:
        self.web3 = Web3(Web3.HTTPProvider(settings.monad_rpc_url))

    def checksum(self, address: str) -> str:
        return self.web3.to_checksum_address(address)
