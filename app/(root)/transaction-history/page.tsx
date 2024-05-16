import HeaderBox from '@/components/HeaderBox'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const TransactionHistory = async ({ searchParams : { id, page}}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })

  if(!accounts) {
    return null
  }
  
  const accountsData = accounts?.data
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })
  return (
    <div className='transactions'>
        <div className='transactions-header'>
          <HeaderBox
            title="取引履歴"
            subtext="銀行の詳細と取引を確認できます。"
          />
        </div>

        <div className='space-y-6'>
          <div className='transaction-account'>
            <div className='flex flex-col gap-2'>
              <h2 className=''>
                {account?.data.name}
              </h2>
              <p className='text-14 text-blue-25'>
                {account?.data.officialName}
              </p>
              <p className='text-14 font-semibold tracking-[1.1px] text-white'>
                ●●●● ●●●● ●●●● {account?.data.mask}
              </p>
            </div> 
            
          </div>
        </div>
    </div>
  )
}

export default TransactionHistory