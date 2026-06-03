'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AssetDetailPage() {
  const params = useParams()
  const router = useRouter()

  const [asset, setAsset] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAsset()
  }, [])

  async function loadAsset() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setAsset(data)
    setLoading(false)
  }

  async function updateAsset() {
    const { error } = await supabase
      .from('assets')
      .update({
        item_name: asset.item_name,
        specification: asset.specification,
        location: asset.location,
        purchase_price: asset.purchase_price
      })
      .eq('id', params.id)

    if (error) {
      alert(error.message)
      return
    }

    alert('수정 완료')
    setEditMode(false)
  }

  async function deleteAsset() {
    const ok = confirm('정말 삭제하시겠습니까?')

    if (!ok) return

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', params.id)

    if (error) {
      alert(error.message)
      return
    }

    alert('삭제 완료')
    router.push('/assets')
  }

  if (loading) {
    return (
      <div className="p-8">
        불러오는 중...
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="p-8">
        비품을 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
  onClick={() => router.push('/assets')}
  className="mb-6 bg-gray-600 text-white px-5 py-3 rounded"
>
  ← 비품 목록으로
</button>
      <div className="bg-white rounded-xl shadow p-6">

        {asset.image_url && (
          <img
            src={asset.image_url}
            alt="비품"
            className="w-full rounded mb-6"
          />
        )}

        <div className="mb-6">
          {editMode ? (
            <input
              className="border p-3 w-full rounded text-2xl font-bold"
              value={asset.item_name || ''}
              onChange={(e) =>
                setAsset({
                  ...asset,
                  item_name: e.target.value
                })
              }
            />
          ) : (
            <h1 className="text-3xl font-bold">
              {asset.item_name}
            </h1>
          )}
        </div>

        <div className="space-y-4">

          <div>
            <strong>관리번호 :</strong>{' '}
            {asset.asset_number}
          </div>

          <div>
            <strong>규격 :</strong>{' '}

            {editMode ? (
              <input
                className="border p-2 rounded"
                value={asset.specification || ''}
                onChange={(e) =>
                  setAsset({
                    ...asset,
                    specification: e.target.value
                  })
                }
              />
            ) : (
              asset.specification
            )}
          </div>

          <div>
            <strong>보관장소 :</strong>{' '}

            {editMode ? (
              <input
                className="border p-2 rounded"
                value={asset.location || ''}
                onChange={(e) =>
                  setAsset({
                    ...asset,
                    location: e.target.value
                  })
                }
              />
            ) : (
              asset.location
            )}
          </div>

          <div>
            <strong>구입금액 :</strong>{' '}

            {editMode ? (
              <input
                className="border p-2 rounded"
                value={asset.purchase_price || ''}
                onChange={(e) =>
                  setAsset({
                    ...asset,
                    purchase_price: e.target.value
                  })
                }
              />
            ) : (
              `${asset.purchase_price?.toLocaleString()}원`
            )}
          </div>

          <div>
            <strong>등록일 :</strong>{' '}
            {asset.created_at}
          </div>

        </div>

        <div className="flex gap-3 mt-8">

          {editMode ? (
            <button
              onClick={updateAsset}
              className="bg-blue-600 text-white px-5 py-3 rounded"
            >
              저장
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-green-600 text-white px-5 py-3 rounded"
            >
              수정
            </button>
          )}

          <button
            onClick={deleteAsset}
            className="bg-red-600 text-white px-5 py-3 rounded"
          >
            삭제
          </button>

        </div>

      </div>
    </div>
  )
}