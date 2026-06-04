'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [csvFile, setCsvFile] =
  useState<File | null>(null)

  async function createDepartment() {
    if (!name || !code || !userId || !password) {
      alert('모든 항목을 입력하세요.')
      return
    }

    const { error } = await supabase
      .from('departments')
      .insert([
        {
          name,
          code,
          user_id: userId,
          password
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('부서 생성 완료')

    setName('')
    setCode('')
    setUserId('')
    setPassword('')
  }
async function uploadCsv() {
  if (!csvFile) {
    alert('CSV 파일을 선택하세요.')
    return
  }

  const text = await csvFile.text()

  const rows = text
    .split('\n')
    .map(row => row.trim())
    .filter(Boolean)

  const headers = rows[0]
    .split(',')
    .map(h => h.trim())

  const assets = rows
  .slice(1)
  .map(row => {
    const values = row.split(',')

    const item: any = {}

    headers.forEach((header, index) => {
      let value = values[index]?.trim() || ''

      // created_at은 무시
      if (header === 'created_at') {
        return
      }

      // 날짜 처리
      if (header === 'acquisition_date') {
        if (
          !value ||
          value === '0' ||
          value === '000' ||
          value === '0000'
        ) {
          item[header] = null
          return
        }

        value = value.replace(/\./g, '-')

        // YYYY-MM-DD 형식 아니면 null
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {
          console.log(
            '잘못된 날짜:',
            value
          )

          item[header] = null
          return
        }

        item[header] = value
        return
      }

      // 숫자 처리
      if (
        header === 'purchase_price' ||
        header === 'quantity'
      ) {
        item[header] =
          value === ''
            ? null
            : Number(value)

        return
      }

      // 일반 문자 처리
      item[header] =
        value === ''
          ? null
          : value
    })

    return item
  })

  console.log(
    'FIRST ASSET=',
    JSON.stringify(
      assets[0],
      null,
      2
    )
  )

  const { error } = await supabase
    .from('assets')
    .insert([assets[0]])

  console.log('ASSETS=', assets)
  console.log('ERROR=', error)

  if (error) {
    alert(
      JSON.stringify(
        error,
        null,
        2
      )
    )
    return
  }

  alert(
    `${assets.length}건 등록 완료`
  )
}

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        관리자 페이지
      </h1>

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="부서명"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="부서코드"
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
      />

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="아이디"
        value={userId}
        onChange={(e) =>
          setUserId(e.target.value)
        }
      />

      <input
        type="password"
        className="border p-3 w-full rounded mb-3"
        placeholder="초기 비밀번호"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
  onClick={() => {
    alert('버튼 클릭됨')
    createDepartment()
  }}
  className="bg-black text-white px-5 py-3 rounded w-full"
>
  부서 생성
</button>
<hr className="my-8" />

<h2 className="text-xl font-bold mb-3">
  CSV 업로드
</h2>

<input
  type="file"
  accept=".csv"
  onChange={(e) =>
    setCsvFile(
      e.target.files?.[0] || null
    )
  }
  className="mb-3 block"
/>

<button
  onClick={uploadCsv}
  className="bg-blue-600 text-white px-5 py-3 rounded w-full"
>
  CSV 업로드
</button>
    </div>
  )
}