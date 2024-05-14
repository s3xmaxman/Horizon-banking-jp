'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import  CustomInput  from '@/components/CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'





const AuthForm = ({ type } : { type: string }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formSchema = authFormSchema(type); 


    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
  })
     
    // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    console.log(values)
    setIsLoading(false)
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
        ) : (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <CustomInput control={form.control} name='email' label="Email" placeholder='メールアドレスを入力してください' />
                        <CustomInput control={form.control} name='password' label="Password" placeholder='パスワードを入力してください' />
                        <Button  
                          type='submit'
                          className='form-btn'
                          disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                   <Loader2 className="animate-spin" /> &nbsp;
                                    ロード中...
                                </>
                            ) : type === 'sign-in' ? 'サインイン' : 'サインアップ'}
                        </Button>
                    </form>
                </Form>
                <footer className='flex justify-items-center gap-1'>
                    <p className='text-14 font-normal text-gray-600'>
                        {type === 'sign-in' ? 'アカウントをお持ちでないですか?' : 'すでにアカウントをお持ちですか?'}
                    </p>
                    <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                        {type === 'sign-in' ? 'サインアップ' : 'サインイン'}
                    </Link>
                </footer>   
            </>
        )}
    </section>
  )
}

export default AuthForm