import React, { useCallback, useEffect, useState } from 'react'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { createLinkToken } from '@/lib/actions/user.actions'

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const [token, setToken] = useState('')
  const router = useRouter()

  useEffect(() => {
   const getLinkToken = async () => {
       const data = await createLinkToken(user)

       setToken(data?.link_token)
   }

   getLinkToken()
  }, [user])
  
  const onSuccess = useCallback<PlaidLinkOnSuccess>(async(public_token: string) => {
      
  }, [user])

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config);


  return (
    <>
    {variant === "primary" ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className='plaidlink-primary'
        >
            銀行口座を接続する
        </Button> 
    ) : variant === "ghost" ? (
        <Button
        >
            銀行口座を接続する
        </Button> 
    ): (
        <Button>
            銀行口座を接続する
        </Button>
    )}
    </>
  )
}

export default PlaidLink