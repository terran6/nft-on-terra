import './App.css'

import { useState } from 'react'
import {
  useWallet,
  WalletStatus,
  useConnectedWallet,
} from '@terra-money/wallet-provider'
import * as execute from './contract/execute'
import * as query from './contract/query'
import { ConnectWallet } from './components/ConnectWallet'
import {
  Alert, AlertTitle, Button, Collapse, Divider,
  Grid, IconButton, Paper, TextField, Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'

function App() {

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

  const onClickMint = async () => {
    setNFTMetadata(null)
    setUpdating(true)
    setError('')
    setOpen(false)
    const response = await execute.mint(
      connectedWallet,
      token_id,
      owner_address,
      nft_name,
      image_url
    )
    if (response.code !== 0) {
      const error_message = response.raw_log
      switch (true) {
        case error_message.indexOf('token_id already claimed') !== -1:
          setError('Token ID Already Claimed.')
          break
        case error_message.indexOf('addr_validate errored') !== -1:
          setError('Owner Address Not Valid.')
          break
        default:
          setError(`${response.raw_log}.`)
      }
      setOpen(true)
      setUpdating(false)
      return
    }

    const nft_data = await query.nft_info(
      connectedWallet,
      token_id
    )
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
                style={{ maxWidth: '200px' }}
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
