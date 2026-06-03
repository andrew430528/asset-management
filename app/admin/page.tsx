'use client'

export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        관리자 페이지
      </h1>

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="부서명"
      />

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="부서코드"
      />

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="아이디"
      />

      <input
        className="border p-3 w-full rounded mb-3"
        placeholder="초기 비밀번호"
      />

      <button
        className="bg-black text-white px-5 py-3 rounded"
      >
        부서 생성
      </button>
    </div>
  )
}