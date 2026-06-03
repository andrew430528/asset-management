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
    </div>
  )
}