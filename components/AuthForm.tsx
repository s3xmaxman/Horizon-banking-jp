'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
    username: z.string().min(2).max(50),
})


const AuthForm = ({ type } : { type: string }) => {
  const [user, setUser] = useState(null)

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
  })
     
      // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
  return (
    <section className='auth-form'>
        <header className='flex flex-col gap-5 md:gap-8'>
            <Link 
                href='/' 
                className='cursor-pointer flex items gap-1 px-4'
            >
                <Image
                    src='/icons/logo.svg'
                    width={34}
                    height={34}
                    alt='Horizon logo'
                    className='size-[24px] max-xl:size-14'
                />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
                    Horizon
                </h1>
            </Link>

            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                  {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                </h1>
                <p className='text-16 font-normal text-gray-600'>
                {user 
                  ? 'アカウントをリンクしてスタートしましょう'
                  : '詳細を入力してください'
                }
                </p>
            </div>
        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                {/* plaid link */}
            </div>
        ): (
            <>
            Form
            </>
        )}
    </section>
  )
}

export default AuthForm