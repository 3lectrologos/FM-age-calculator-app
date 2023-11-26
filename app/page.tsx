'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import DownArrow from '@/public/icon-arrow.svg'

const dateSchema = z.object({
  day: z.string()
    .min(1, { message: 'This field is required' })
    .max(2)
    .regex(/^\d{1,2}$/, { message: 'Must be a valid day' })
    .transform(value => parseInt(value))
    .refine(value => value >= 1 && value <= 31, {
      message: 'Must be a valid day'
    }),
  month: z.string()
    .min(1, { message: 'This field is required' })
    .max(2)
    .regex(/^\d{1,2}$/, { message: 'Must be a valid month' })
    .transform(value => parseInt(value))
    .refine(value => value >= 1 && value <= 12, {
      message: 'Must be a valid month'
    }),
  year: z.string()
    .min(1, { message: 'This field is required' })
    .max(4)
    .regex(/^\d{1,4}$/, { message: 'Must be a valid year' })
    .transform(value => parseInt(value))
    .refine(value => value >= 1900, {
      message: 'Must be after 1900'
    })
    .refine(value => value <= (new Date()).getFullYear(), {
      message: 'Must be in the past'
    })
})
  .refine(data => {
    const date = new Date()
    date.setFullYear(data.year)
    date.setMonth(data.month - 1)
    date.setDate(data.day)
    return date.getFullYear() === data.year && date.getMonth() + 1 === data.month && date.getDate() === data.day
  }, {
    message: 'Must be a valid date',
    path: ['date']
  })

function DateInput({ callback }: { callback: (age: {years: string, months: string, days: string}) => void }) {
  const names = ['day', 'month', 'year']
  const placeholders = ['DD', 'MM', 'YYYY']
  const maxLengths = [2, 2, 4]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dateSchema),
    reValidateMode: 'onSubmit'
  })

  function submitHandler(data: any) {
    const date = new Date()
    date.setFullYear(data.year)
    date.setMonth(data.month - 1)
    date.setDate(data.day)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const years = now.getFullYear() - date.getFullYear()
    let months = now.getMonth() - date.getMonth()
    let days = now.getDate() - date.getDate()
    if (days < 0) {
      months -= 1
      // NOTE: This is a tricky way to get the number of days in the *previous* month.
      const prevMonthNumDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
      days = now.getDate() + prevMonthNumDays - date.getDate()
    }
    callback({ years: years.toString(), months: months.toString(), days: days.toString() })
  }

  function dateError() {
    if (!errors.day?.message && !errors.month?.message && !errors.year?.message && errors.date?.message) {
      return errors.date?.message.toString()
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      callback({years: '', months: '', days: ''})
    }
  }, [errors, callback])

  return (
    <form className={`flex flex-col items-center gap-y-[62px]`} onSubmit={handleSubmit(submitHandler)}>
      <div className={`flex flex-row gap-x-4`}>
        {names.map((name, index) => (
          <div className={`flex flex-col w-full`}
               key={index}>
            <label className={`uppercase text-[12px] leading-[12px] ${(errors[name]?.message || dateError()) ? 'text-lightred' : 'text-smokeygray'} tracking-[0.27em] font-semibold mb-2`}
                   htmlFor={name}>
              {name}
            </label>
            <input className={`border ${(errors[name]?.message || dateError()) ? 'border-lightred' : 'border-lightgray'} h-[52px] w-full rounded-lg text-[20px] font-bold p-4 focus:border-purple focus:outline-none`}
                   id={name} type='text' maxLength={maxLengths[index]} placeholder={placeholders[index]}
                   {...register(name, {
                     //onBlur: () => trigger()
                   })}
            />
            {errors[name]?.message &&
              <span className={`text-lightred text-[8px] leading-[9px] tracking-tight italic mt-2`}>
                {(errors[name]?.message ?? '').toString()}
              </span>
            }
            {name === 'day' && dateError() &&
              <span className={`text-lightred text-[8px] leading-[9px] tracking-tight italic mt-2`}>
                {(dateError() ?? '').toString()}
              </span>
            }
          </div>
        ))}
      </div>
      <div className={`relative w-full border-b border-lightgray/75`}>
        <button className={`absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex justify-center items-center rounded-full bg-purple text-white`}
                type='submit'>
          <DownArrow className={`w-[26px] stroke-[3px]`} />
        </button>
      </div>
    </form>
  )
}

function NumberDisplay({ number, label }: { number: string, label: string }) {
  return (
    <div className={`flex flex-row text-[54px] leading-[55px] font-extrabold italic tracking-tight`}>
      <span className={`text-purple mr-2.5`}>
        {number === '' ? '- -' : number}
      </span>
      {label}
    </div>
  )
}

function AgeDisplay({ years='', months='', days='' }: { years: string, months: string, days: string }) {
  return (
    <div className={`flex flex-col gap-y-1.5`}>
      <NumberDisplay number={years} label='years' />
      <NumberDisplay number={months} label='months' />
      <NumberDisplay number={days} label='days' />
    </div>
  )
}

export default function Home() {
  const [years, setYears] = useState('')
  const [months, setMonths] = useState('')
  const [days, setDays] = useState('')
  return (
    <div className={`flex flex-col bg-offwhite items-center min-h-screen`}>
      <div className={`flex flex-col justify-center items-center py-24`}>
        <div className={`flex flex-col gap-y-[66px] w-[344px] bg-white rounded-t-3xl rounded-bl-3xl rounded-br-[100px] px-[26px] pt-[54px] pb-12`}>
          <DateInput callback={({ years, months, days }) => {
            setYears(years)
            setMonths(months)
            setDays(days)
          }} />
          <AgeDisplay years={years} months={months} days={days} />
        </div>
      </div>
    </div>
  )
}
