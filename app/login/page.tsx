'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function LoginPage() {
  const router = useRouter()

  const [departments, setDepartments] = useState<any[]>([])
  const [departmentCode, setDepartmentCode] = useState('')
  const [password, setPassword] = useState('')

 useEffect(() => {
  console.log(
    'URL=',
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )

  console.log(
    'KEY=',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  loadDepartments()
}, [])

  async function loadDepartments() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')

    console.log('data:', data)
    console.log('error:', error)

    if (error) {
      alert(error.message)
      return
    }

    setDepartments(data || [])
  }

  async function login() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('code', departmentCode)
      .eq('password', password)
      .single()

    if (error || !data) {
      alert('비밀번호가 올바르지 않습니다.')
      return
    }

    localStorage.setItem('department', data.code)
    localStorage.setItem('departmentName', data.name)
    localStorage.setItem('userId', data.user_id || '')

    router.push('/assets')
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        비품관리 로그인
      </h1>

      <select
        className="border p-3 w-full rounded mb-4"
        value={departmentCode}
        onChange={(e) =>
          setDepartmentCode(e.target.value)
        }
      >
        <option value="">
          부서 선택
        </option>

        {departments.map((dept) => (
          <option
            key={dept.id}
            value={dept.code}
          >
            {dept.name}
          </option>
        ))}
      </select>

      <input
        type="password"
        className="border p-3 w-full rounded mb-4"
        placeholder="비밀번호"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={login}
        className="bg-black text-white px-5 py-3 rounded w-full"
      >
        로그인
      </button>
    </div>
  )
}