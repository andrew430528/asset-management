'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] =
    useState('')

  const [newPassword, setNewPassword] =
    useState('')

  const [confirmPassword, setConfirmPassword] =
    useState('')

  async function changePassword() {
    const department =
      localStorage.getItem('department')

    if (!department) {
      alert('로그인이 필요합니다.')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }

    const { data } = await supabase
      .from('departments')
      .select('*')
      .eq('code', department)
      .eq('password', currentPassword)
      .single()

    if (!data) {
      alert('현재 비밀번호가 틀렸습니다.')
      return
    }

    const { error } = await supabase
      .from('departments')
      .update({
        password: newPassword
      })
      .eq('code', department)

    if (error) {
      alert(error.message)
      return
    }

    alert('비밀번호가 변경되었습니다.')
  }

  return (
    <div className="max-w-md mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        비밀번호 변경
      </h1>

      <input
        type="password"
        className="border p-3 w-full rounded mb-4"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) =>
          setCurrentPassword(e.target.value)
        }
      />

      <input
        type="password"
        className="border p-3 w-full rounded mb-4"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
      />

      <input
        type="password"
        className="border p-3 w-full rounded mb-4"
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
      />

      <button
        onClick={changePassword}
        className="bg-black text-white px-5 py-3 rounded w-full"
      >
        비밀번호 변경
      </button>

    </div>
  )
}