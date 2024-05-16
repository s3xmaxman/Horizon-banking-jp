import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const Transfer= async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })
  
  if(!accounts) {
    return null
  }

  const accountsData = accounts?.data
  return (
    <section className='payment-transfer'>
      <HeaderBox
        title="支払い振替"
        subtext="支払い振替に関する詳細やメモがあればご記入ください" 
      />
      <section className='size-full pt-5'>
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer