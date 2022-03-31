import './App.css'

import { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'

import * as execute from './contract/execute'
import * as query from './contract/query'
import { ConnectWallet } from './components/ConnectWallet'

function App() {
  const [updating, setUpdating] = useState(false)
  const [token_id, setTokenId] = useState('')
  const [owner_address, setAddress] = useState('')
  const [nft_name, setNFTName] = useState('')
  const [image_url, setImageURL] = useState('')
  const [nft_metadata, setNFTMetadata] = useState(null)

  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()

  const onClickMint = async () => {
    setUpdating(true)
    await execute.mint(connectedWallet, token_id, owner_address, nft_name, image_url)
    const nft_data = await query.nft_info(connectedWallet, token_id)
    setNFTMetadata(nft_data)
    setUpdating(false)
  }

  return (
    <div className='App'>
      <header className='App-header' style={{ backgroundColor: 'black', fontFamily: 'Gill Sans' }}>
        <h3 style={{ display: 'inline', color: 'orange' }}>
          Mint Your Own NFT!
        </h3>
        {updating && (
          <div>
            Minting NFT...
          </div>
        )}
        {status === WalletStatus.WALLET_CONNECTED && (
          <div style={{ display: 'inline' }}>
            <label style={{ color: 'lightblue', fontSize: '20px', width: '80px', display: 'inline-block', textAlign: 'left' }}>ID : </label>
            <input
              type='number'
              onChange={(e) => setTokenId(e.target.value)}
              value={token_id}
              style={{ backgroundColor: '#201E23' }}
            />
            <br/>
            <label style={{ color: 'lightblue', fontSize: '20px', width: '80px', display: 'inline-block', textAlign: 'left' }}>Owner : </label>
            <input
              type='text'
              onChange={(e) => setAddress(e.target.value)}
              value={owner_address}
              style={{ backgroundColor: '#201E23' }}
            />
            <br/>
            <label style={{ color: 'lightblue', fontSize: '20px', width: '80px', display: 'inline-block', textAlign: 'left' }}>Name : </label>
            <input
              type='text'
              onChange={(e) => setNFTName(e.target.value)}
              value={nft_name}
              style={{ backgroundColor: '#201E23' }}
            />
            <br/>
            <label style={{ color: 'lightblue', fontSize: '20px', width: '80px', display: 'inline-block', textAlign: 'left' }}>URL : </label>
            <input
              type='text'
              onChange={(e) => setImageURL(e.target.value)}
              value={image_url}
              style={{ backgroundColor: '#201E23' }}
            />
            <br/>
            <br/>
            <button 
              onClick={onClickMint} 
              type='button'
              style={{ backgroundColor: 'green', height: '40px', width: '100px', fontWeight: 'bold', fontFamily: 'Gill Sans'}}
            >
              {' '}
              Mint NFT{' '}
            </button>
            <br/>
            {nft_metadata !== null && (
              <p>
                <h4 style={{ color: 'lightgreen' }}>NFT Successfully Minted!</h4>
                <h5 style={{ color: 'gold' }}>NFT : {nft_metadata.extension.name}</h5>
                <img style={{ maxWidth: '200px' }} src={nft_metadata.extension.image}></img>
              </p>
            )}
          </div>
        )}
        <ConnectWallet />
      </header>
    </div>
  )
}

export default App
