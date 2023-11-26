'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import DownArrow from '@/public/icon-arrow.svg'
import BeatLoader from 'react-spinners/BounceLoader'

type MaybeAge = { years: number, months: number, days: number } | undefined

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

function DateInput({ callback }: { callback: (_age: MaybeAge) => Promise<void> }) {
  const names = ['day', 'month', 'year']
  const placeholders = ['DD', 'MM', 'YYYY']
  const maxLengths = [2, 2, 4]

  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dateSchema),
    reValidateMode: 'onSubmit'
  })

  async function submitHandler(data: any) {
    const date = new Date()
    date.setFullYear(data.year)
    date.setMonth(data.month - 1)
    date.setDate(data.day)
    const now = new Date()
    let years = now.getFullYear() - date.getFullYear()
    let months = now.getMonth() - date.getMonth()
    let days = now.getDate() - date.getDate()
    if (months < 0) {
      years -= 1
      months += 12
    }
    if (days < 0) {
      months -= 1
      // NOTE: This is a tricky way to get the number of days in the *previous* month.
      const prevMonthNumDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
      days = now.getDate() + prevMonthNumDays - date.getDate()
    }
    setLoading(true)
    await callback({ years, months, days })
    setLoading(false)
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
      callback(undefined)
    }
  }, [errors, callback])

  return (
    <form className={`flex flex-col items-center gap-y-16 lg:items-start lg:gap-y-12`} onSubmit={handleSubmit(submitHandler)}>
      <div className={`flex flex-row gap-x-4 lg:gap-x-8`}>
        {names.map((name, index) => (
          <div className={`flex flex-col w-full gap-y-2 lg:gap-y-4`}
               key={index}>
            <label className={`uppercase text-[12px] leading-[12px] ${(errors[name]?.message || dateError()) ? 'text-lightred' : 'text-smokeygray'} tracking-[0.27em] font-semibold lg:text-[14px]`}
                   htmlFor={name}>
              {name}
            </label>
            <input className={`border ${(errors[name]?.message || dateError()) ? 'border-lightred' : 'border-lightgray'} w-full rounded-lg text-offblack text-[20px] font-bold px-4 py-3 focus:border-purple focus:outline-none lg:text-[32px] lg:w-40`}
                   id={name} type='text' maxLength={maxLengths[index]} placeholder={placeholders[index]}
                   {...register(name, {
                     //onBlur: () => trigger()
                   })}
            />
            {errors[name]?.message &&
              <span className={`text-lightred text-[8px] leading-[8px] tracking-tight italic lg:text-[14px] lg:leading-[14px]`}>
                {(errors[name]?.message ?? '').toString()}
              </span>
            }
            {name === 'day' && dateError() &&
              <span className={`text-lightred text-[8px] leading-[8px] tracking-tight italic lg:text-[14px] lg:leading-[14px]`}>
                {(dateError() ?? '').toString()}
              </span>
            }
          </div>
        ))}
      </div>
      <div className={`relative w-full border-b border-lightgray`}>
        <button className={`absolute top-0 right-[50%] transform translate-x-1/2 -translate-y-1/2 w-16 h-16 p-5 flex justify-center items-center rounded-full transition-colors bg-purple text-white lg:w-24 lg:h-24 lg:p-6 lg:right-0 lg:translate-x-0 lg:transition-colors lg:hover:bg-offblack ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label='Calculate age'
                type='submit'
                disabled={loading}
        >
          {loading ?
            <div>
              <div className={`lg:hidden`}>
                <BeatLoader color='white' size={32} />
              </div>
              <div className={`hidden lg:block`}>
                <BeatLoader color='white' size={48} />
              </div>
            </div> :
            <DownArrow className={`stroke-[2.5px] lg:stroke-[2px]`} />
          }
        </button>
      </div>
    </form>
  )
}

function NumberDisplay({ number, label }: { number: number, label: string }) {
  return (
    <div className={`flex flex-row text-offblack text-[55px] leading-[110%] font-extrabold italic tracking-[-0.03em] lg:text-[104px]`}>
      <span className={`text-purple mr-2.5 lg:mr-3.5`}>
        {number === -1 ? '- -' : number}
      </span>
      {label}
    </div>
  )
}

function AgeDisplay({ years=-1, months=-1, days=-1 }: { years: number, months: number, days: number }) {
  return (
    <div className={`flex flex-col gap-y-0.5`}>
      <NumberDisplay number={years} label='years' />
      <NumberDisplay number={months} label='months' />
      <NumberDisplay number={days} label='days' />
    </div>
  )
}

export default function Home() {
  const [years, setYears] = useState(-1)
  const [months, setMonths] = useState(-1)
  const [days, setDays] = useState(-1)

  async function updateOne({ setter, value, duration }: { setter: (value: number) => void, value: number, duration: number }) {
    let delay = duration / value
    let endDelay = delay * 2
    let delayMultiplier = Math.pow(endDelay / delay, 1 / value)
    for (let i = 0; i <= value; i++) {
      setter(i)
      await new Promise(r => setTimeout(r, delay))
      delay *= delayMultiplier
    }
  }

  async function updateAge(age: MaybeAge) {
    if (!age) {
      setYears(-1)
      setMonths(-1)
      setDays(-1)
      return
    }
    const { years, months, days } = age
    const yearsPromise = updateOne({ setter: setYears, value: years, duration: 1500 })
    const monthsPromise = updateOne({ setter: setMonths, value: months, duration: 2000 })
    const daysPromise = updateOne({ setter: setDays, value: days, duration: 2500 })
    await Promise.all([yearsPromise, monthsPromise, daysPromise])
  }

  return (
    <div className={`flex flex-col items-center min-h-screen min-w-fit lg:justify-center`}>
      <div className={`flex flex-col justify-center items-center py-[88px] px-4 lg:py-32`}>
        <div className={`flex flex-col gap-y-16 w-[343px] bg-white rounded-t-3xl rounded-bl-3xl rounded-br-[100px] px-6 py-12 lg:w-[840px] lg:p-14 lg:rounded-br-[200px] lg:gap-y-12`}>
          <DateInput callback={updateAge} />
          <AgeDisplay years={years} months={months} days={days} />
        </div>
      </div>
    </div>
  )
}
