import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'sex', lastName: 'maxman', email: 's3xmaxman@gmail.com' }
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="口座や取引に効率的にアクセスし、管理することができます。"
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250}
          />    
        </header>
      </div>
      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={{}, {}} 
      />
    </section>
  )
}

export default Home