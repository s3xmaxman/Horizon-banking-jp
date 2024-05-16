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
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'



const AuthForm = ({ type } : { type: string }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  

  const formSchema = authFormSchema(type); 


 
  const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
  })
     

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      
      if(type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password
        }
        const newUser = await signUp(userData)

        setUser(newUser)
      }

      if(type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password
        })

        if(response) router.push('/')
      }
      
    } catch (error) {
        
    } finally {
      setIsLoading(false)
    }

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
                  {user ? 'Link Account' : type === 'sign-in' ? 'サインイン' : 'サインアップ'}
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
                <PlaidLink user={user} variant='primary' />
            </div>
        ) : (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        {type === 'sign-up' && ( 
                            <>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='firstName' label="名" placeholder='名を入力してください' />
                                    <CustomInput control={form.control} name='lastName' label="姓" placeholder='姓を入力してください' />
                                </div>
                                <CustomInput control={form.control} name='address1' label="住所" placeholder='住所を入力してください' />
                                <CustomInput control={form.control} name='city' label="市区町村" placeholder='お住まいの市区町村を入力してください' />
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='state' label="都道府県" placeholder='例: 東京都' />
                                    <CustomInput control={form.control} name='postalCode' label="郵便番号" placeholder='例: 123-4567' />
                                </div>
                                <div className="flex gap-4">
                                    <CustomInput control={form.control} name='dateOfBirth' label="生年月日" placeholder='YYYY-MM-DD' />
                                    <CustomInput control={form.control} name='ssn' label="社会保障番号" placeholder='例: 1234' />
                                </div>
                            </>
                        )}
            
                        <CustomInput control={form.control} name='email' label="メールアドレス" placeholder='メールアドレスを入力してください' />
                        <CustomInput control={form.control} name='password' label="パスワード" placeholder='パスワードを入力してください' /> 
                        
                        <div className='flex flex-col gap-1'>
                            <Button  
                              type='submit'
                              className='form-btn'
                              disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                                          ロード中...
                                    </>
                                ) : type === 'sign-in' ? 'サインイン' : 'サインアップ'}
                            </Button>
                        </div>
                    </form>
                </Form>

                <footer className='flex justify-center gap-1'>
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