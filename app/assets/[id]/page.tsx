'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AssetDetailPage() {
  const params = useParams()
  console.log('params', params)

  const [asset, setAsset] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadAsset() {
      try {
        if (!params?.id) return

        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('id', params.id)
          .single()

        console.log('id:', params.id)
        console.log('data:', data)
        console.log('error:', error)

        if (error) {
          setErrorMessage(error.message)
          return
        }

        setAsset(data)
      } catch (err: any) {
        console.error(err)
        setErrorMessage(err.message || '알 수 없는 오류')
      } finally {
        setLoading(false)
      }
    }

    loadAsset()
  }, [params])

  if (loading) {
    return (
      <div className="p-8">
        불러오는 중...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="p-8">
        <div className="text-red-600 font-bold">
          오류 발생
        </div>
        <div className="mt-2">
          {errorMessage}
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="p-8">
        비품 정보를 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">

        {asset.image_url && (
          <img
            src={asset.image_url}
            alt="비품 이미지"
            className="w-full rounded mb-6"
          />
        )}

        <h1 className="text-3xl font-bold mb-6">
          {asset.item_name}
        </h1>

        <div className="space-y-3">

          <div>
            <strong>관리번호:</strong>{' '}
            {asset.asset_number}
          </div>

          <div>
            <strong>규격:</strong>{' '}
            {asset.specification}
          </div>

          <div>
            <strong>보관장소:</strong>{' '}
            {asset.location}
          </div>

          <div>
            <strong>가격:</strong>{' '}
            {asset.purchase_price?.toLocaleString()}원
          </div>

          <div>
            <strong>등록일:</strong>{' '}
            {asset.created_at}
          </div>

        </div>
      </div>
    </div>
  )
}