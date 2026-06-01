'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    const list = data || []

    setAssets(list)

    const qrMap: Record<string, string> = {}

    for (const asset of list) {
      try {
        const qr = await QRCode.toDataURL(
          `${window.location.origin}/assets/${asset.id}`
        )

        qrMap[asset.id] = qr
      } catch (err) {
        console.error(err)
      }
    }

    setQrCodes(qrMap)
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        비품 목록
      </h1>

      <div className="mb-4">
        QR 개수 : {Object.keys(qrCodes).length}
      </div>

      <Link
        href="/assets/new"
        className="inline-block bg-black text-white px-5 py-3 rounded mb-6"
      >
        비품 등록
      </Link>

      <div className="grid gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-xl shadow p-4"
          >
            <Link href={`/assets/${asset.id}`}>
              <div className="cursor-pointer">
                <div className="flex gap-4">
                  <img
                    src={
                      asset.image_url ||
                      'https://placehold.co/200x200'
                    }
                    alt="비품"
                    className="w-28 h-28 object-cover rounded"
                  />

                  <div>
                    <div className="text-xl font-bold">
                      {asset.item_name}
                    </div>

                    <div>
                      관리번호 : {asset.asset_number}
                    </div>

                    <div>
                      규격 : {asset.specification}
                    </div>

                    <div>
                      보관장소 : {asset.location}
                    </div>

                    <div>
                      가격 :{' '}
                      {asset.purchase_price?.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="mt-4">
              {qrCodes[asset.id] ? (
                <img
                  src={qrCodes[asset.id]}
                  alt="QR Code"
                  className="w-32 h-32 border"
                />
              ) : (
                <div>QR 생성중...</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}