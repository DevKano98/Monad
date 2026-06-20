import { Contract, JsonRpcProvider, Wallet } from "ethers";

export class MonadSDK {
  private provider: JsonRpcProvider;
  private signer?: Wallet;

  constructor(rpcUrl: string, privateKey?: string) {
    this.provider = new JsonRpcProvider(rpcUrl);
    this.signer = privateKey ? new Wallet(privateKey, this.provider) : undefined;
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  fingerprintRegistry(address: string, abi: unknown[]): Contract {
    return new Contract(address, abi, this.signer ?? this.provider);
  }

  reputationRegistry(address: string, abi: unknown[]): Contract {
    return new Contract(address, abi, this.signer ?? this.provider);
  }
}
