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
  const [asset, setAsset] = useState<any>(null)

  useEffect(() => {
    fetchAsset()
  }, [])

  const fetchAsset = async () => {
    const { data } = await supabase
      .from('assets')
      .select('*')
      .eq('id', params.id)
      .single()

    setAsset(data)
  }

  if (!asset) {
    return (
      <div className="p-8">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6">

        {asset.image_url && (
          <img
            src={asset.image_url}
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