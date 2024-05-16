import Link from 'next/link'
import React from 'react'

const RecentTransactions = ({ accounts, transactions=[], appwriteItemId, page=1 }: RecentTransactionsProps) => {
  return (
    <section className='recent-transactions'>
        <header className='flex items-center'>
            <h2 className='recent-transactions-label'>
                最近の取引
            </h2>
            <Link
               href={`/transaction-history/?id=${appwriteItemId}`}
               className='view-btn'
            >
            </Link>
        </header>
    </section>
  )
}

export default RecentTransactions