import { LCDClient } from '@terra-money/terra.js'
import { contractAddress } from './address'

export const nft_info = async (wallet, token_id) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAddress(wallet), {"nft_info": {"token_id": token_id.toString()}})
}
