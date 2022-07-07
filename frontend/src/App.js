import './App.css'

import { useState, useMemo } from 'react'
import {
  useWallet,
  WalletStatus,
  useConnectedWallet,
  useLCDClient,
} from '@terra-money/wallet-provider'
import { Cw721MetadataOnchainClient } from 'terra-clients'
import { ConnectWallet } from './components/ConnectWallet'
import {
  Alert, AlertTitle, Button, Collapse, Divider,
  Grid, IconButton, Paper, TextField, Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import { contractAddress } from './contract/address'

function App() {

  const lcdClient = useLCDClient()

  const [updating, setUpdating] = useState(false)
  const [token_id, setTokenId] = useState('')
  const [owner_address, setAddress] = useState('')
  const [nft_name, setNFTName] = useState('')
  const [image_url, setImageURL] = useState('')
  const [nft_metadata, setNFTMetadata] = useState(null)
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()
  const nftClient = useMemo(() => {
    if (!connectedWallet) {
      return;
    }
    return new Cw721MetadataOnchainClient(
      lcdClient,
      connectedWallet,
      contractAddress(connectedWallet)
    );
  }, [lcdClient, connectedWallet]);

  const onClickMint = async () => {
    setNFTMetadata(null)
    setUpdating(true)
    setError('')
    setOpen(false)
    try {
      await nftClient.mint({
        extension: {
          name: nft_name,
          image: image_url,
        },
        owner: owner_address,
        tokenId: token_id,
      })
    } catch(e) {
      if (e.message.includes('token_id already claimed')) {
        setError('Token ID Already Claimed.')
      } else if (e.message.includes('addr_validate errored')) {
        setError('Owner Address Not Valid.')
      } else {
        setError(e.message)
      }
      setOpen(true)
      setUpdating(false)
      return
    }

    const nft_data = await nftClient.nftInfo({
      tokenId: token_id
    })
    setNFTMetadata(nft_data)
    setOpen(true)
    setUpdating(false)
  }

  return (

    <Grid container
      direction='column'
      display='flex'
      alignItems='center'
      justify='center'
      p={4}
    >

      <Paper style={{
        border: '1px solid grey',
        height: 'min-content',
        width: '80%',
        padding: '20px'
      }}>

        <Typography
          variant='h4'
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontWeight: '800'
          }}
          padding='5px'
          paddingBottom='10px'
        >
          Mint Your Own NFT!
        </Typography>
        <br />

        <div style={{ padding: '5px' }}>
          <TextField
            fullWidth
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
            label='ID'
            value={token_id}
            onChange={(e) => setTokenId(e.target.value)}
            size='small'
          />
        </div>

        <div style={{ padding: '5px' }}>
          <TextField
            fullWidth
            label='Name'
            value={nft_name}
            onChange={(e) => setNFTName(e.target.value)}
            size='small'
          />
        </div>

        <div style={{ padding: '5px' }}>
          <TextField
            fullWidth
            label='Owner Address'
            value={owner_address}
            onChange={(e) => setAddress(e.target.value)}
            size='small'
          />
        </div>

        <div style={{ padding: '5px' }}>
          <TextField
            fullWidth
            label='URL'
            value={image_url}
            onChange={(e) => setImageURL(e.target.value)}
            size='small'
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px'
        }}>
          <Button
            disabled={status === WalletStatus.WALLET_NOT_CONNECTED}
            onClick={onClickMint}
            variant='contained'
            fontSize='small'>
            Mint NFT
          </Button>
  
        </div>
        {updating === true && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
          }}>
            <CircularProgress />
          </div>
        )}
        {error !== '' && (
          <span>
            <Divider />
            <br/>
            <Collapse in={open}>
              <Alert
                severity='error'
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <AlertTitle>Error</AlertTitle>
                <strong>{error}</strong>
              </Alert>
            </Collapse>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography
                variant='h1'
                style={{
                  color: 'black',
                  fontWeight: '200',
                  fontSize: '160px' 
                }}
                padding='5px'>
                :(
              </Typography>
            </div>
          </span>
        )}
        {nft_metadata !== null && (
          <span>
            <Divider />
            <br />

            <Collapse in={open}>
              <Alert
                severity='success'
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                <AlertTitle>Success</AlertTitle>
                <strong>NFT Successfully Created!</strong>
              </Alert>
            </Collapse>

            <br />
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography
                variant='h6'
                style={{ color: 'black', fontWeight: '800' }}
                padding='5px'>
                NFT: {nft_metadata.extension.name}
              </Typography>
            </div>
            <br />
            <br />
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img
                style={{ width: '40%' }}
                alt='NFT'
                src={nft_metadata.extension.image}
                padding='5px' />
            </div>
          </span>
        )}
        <ConnectWallet />
      </Paper>
    </Grid>
  )
}

export default App
