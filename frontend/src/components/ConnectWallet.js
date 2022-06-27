import { useWallet, WalletStatus } from '@terra-money/wallet-provider'
import Button from '@mui/material/Button'

export const ConnectWallet = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet()

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px'
    }}>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <button
              key={`install-${connectType}`}
              onClick={() => install(connectType)}
              type="button"
            >
              Install {connectType}
            </button>
          ))}
          {availableConnectTypes.map((connectType) => (
            <button
              key={`connect-${connectType}`}
              onClick={() => connect(connectType)}
              type="button"
            >
              Connect {connectType}
            </button>
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <div style={{ 
          display:'flex', 
          justifyContent:'center', 
          alignItems:'center', 
          paddingTop: '20px' 
        }}>
          <Button
            style={{
              backgroundColor: "#B9B6B5",
              fontSize: "12px"
            }}
            onClick={() => disconnect()}
            variant='contained'
            fontSize='small'>
              Disconnect Wallet
          </Button>
        </div>
      )}
    </div>
  )
}
