'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AssetsPage() {
  const router = useRouter()

 const [assets, setAssets] = useState<any[]>([])
const [viewMode, setViewMode] = useState('card')
const [search, setSearch] = useState('')
const [departmentName, setDepartmentName] =
  useState('')

  useEffect(() => {
  const department =
    localStorage.getItem('department')

  const name =
    localStorage.getItem('departmentName')

  setDepartmentName(name || '')

  if (!department) {
    router.push('/login')
    return
  }

  fetchAssets()
}, [])

  async function fetchAssets() {
    const department =
      localStorage.getItem('department')

    let query = supabase
      .from('assets')
      .select('*')
      .order('created_at', {
        ascending: false
      })

    if (
      department &&
      department !== 'admin'
    ) {
      query = query.eq(
        'department1',
        department
      )
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      return
    }

    setAssets(data || [])
  }

  function logout() {
    localStorage.removeItem('department')
    localStorage.removeItem('departmentName')
    router.push('/login')
  }

  const filteredAssets = assets.filter(
    (asset) =>
      asset.item_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      asset.asset_number
        ?.toLowerCase()
        .includes(search.toLowerCase())
  )

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            비품 목록
          </h1>

          <div className="text-sm text-gray-500">
  {departmentName}
</div>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-3 rounded ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            카드형
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-3 rounded ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            목록형
          </button>
<Link
  href="/settings"
  className="bg-blue-600 text-white px-5 py-3 rounded"
>
  비밀번호 변경
</Link>
          <Link
            href="/assets/new"
            className="bg-black text-white px-5 py-3 rounded"
          >
            비품 등록
          </Link>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-3 rounded"
          >
            로그아웃
          </button>

        </div>

      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="비품명 또는 관리번호 검색"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded px-4 py-3"
        />
      </div>

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col"
            >
              <Link href={`/assets/${asset.id}`}>

                <div className="cursor-pointer">

                  <img
                    src={
                      asset.image_url ||
                      'https://placehold.co/400x300'
                    }
                    alt="비품"
                    className="w-full aspect-square object-cover rounded mb-4"
                  />

                  <div className="space-y-1">

                    <div className="text-lg font-bold">
                      {asset.item_name}
                    </div>

                    <div className="text-sm text-gray-600">
                      {asset.asset_number}
                    </div>

                    <div className="text-sm">
                      규격 :
                      {' '}
                      {asset.specification || '-'}
                    </div>

                    <div className="text-sm">
                      장소 :
                      {' '}
                      {asset.location || '-'}
                    </div>

                    <div className="text-sm">
                      가격 :
                      {' '}
                      {asset.purchase_price
                        ? asset.purchase_price.toLocaleString()
                        : '-'}
                      원
                    </div>

                  </div>

                </div>

              </Link>

              <div className="mt-4 flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://asset-management-ixvm.vercel.app/assets/${asset.id}`}
                  alt="QR"
                  className="w-24 h-24 border rounded"
                />
              </div>

            </div>
          ))}

        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow overflow-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">
                  사진
                </th>
                <th className="p-3 text-left">
                  비품명
                </th>
                <th className="p-3 text-left">
                  관리번호
                </th>
                <th className="p-3 text-left">
                  보관장소
                </th>
                <th className="p-3 text-left">
                  가격
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    <img
                      src={
                        asset.image_url ||
                        'https://placehold.co/80x80'
                      }
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="p-3">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="text-blue-600"
                    >
                      {asset.item_name}
                    </Link>
                  </td>

                  <td className="p-3">
                    {asset.asset_number}
                  </td>

                  <td className="p-3">
                    {asset.location}
                  </td>

                  <td className="p-3">
                    {asset.purchase_price?.toLocaleString()}원
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  )
}