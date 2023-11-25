'use client'

import { useState } from 'react'
import DownArrow from '@/public/icon-arrow.svg'

function DateInput() {
  const names = ['day', 'month', 'year']
  const placeholders = ['DD', 'MM', 'YYYY']
  const maxLengths = [2, 2, 4]

  function compute(formData: FormData) {
    console.log(formData)
  }

  return (
    <form className={`flex flex-col items-center gap-y-[62px]`}
          action={compute}>
      <div className={`flex flex-row gap-x-4`}>
        {names.map((name, index) => (
          <div className={`flex flex-col w-full`}
               key={index}>
            <label className={`uppercase text-[12px] leading-[12px] text-smokeygray tracking-[0.27em] font-semibold mb-2`}
                   htmlFor={name}>
              {name}
            </label>
            <input className={`border h-[52px] w-full rounded-lg text-[20px] font-bold p-4`}
                   name={name} id={name} type='text' maxLength={maxLengths[index]} placeholder={placeholders[index]} />
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

function NumberDisplay({ number, label }: { number: number | undefined, label: string }) {
  return (
    <div className={`flex flex-row text-[54px] leading-[55px] font-extrabold italic tracking-tight`}>
      <span className={`text-purple mr-2.5`}>
        {number ?? '- -'}
      </span>
      {label}
    </div>
  )
}

function AgeDisplay({ years=undefined, months=undefined, days=undefined }: { years: number | undefined, months: number | undefined, days: number | undefined }) {
  return (
    <div className={`flex flex-col gap-y-1.5`}>
      <NumberDisplay number={years} label='years' />
      <NumberDisplay number={months} label='months' />
      <NumberDisplay number={days} label='days' />
    </div>
  )
}

export default function Home() {
  const [years, setYears] = useState(undefined)
  const [months, setMonths] = useState(undefined)
  const [days, setDays] = useState(undefined)
  return (
    <div className={`flex flex-col bg-offwhite items-center min-h-screen`}>
      <div className={`flex flex-col justify-center items-center py-24`}>
        <div className={`flex flex-col gap-y-[66px] w-[344px] bg-white rounded-t-3xl rounded-bl-3xl rounded-br-[100px] px-[26px] pt-[54px] pb-12`}>
          <DateInput />
          <AgeDisplay years={years} months={months} days={days} />
        </div>
      </div>
    </div>
  )
}
