'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewAssetPage() {
  const router = useRouter()

  const [itemName, setItemName] = useState('')
  const [assetNumber, setAssetNumber] = useState('')
  const [specification, setSpecification] = useState('')
  const [location, setLocation] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  const saveAsset = async () => {
    const { error } = await supabase
      .from('assets')
      .insert([
        {
          item_name: itemName,
          asset_number: assetNumber,
          specification: specification,
          location: location,
          purchase_price: Number(purchasePrice)
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert('등록 완료')
    router.push('/assets')
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        비품 등록
      </h1>

      <div className="space-y-4">

        <input
          className="border p-3 w-full rounded"
          placeholder="비품명"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="관리번호"
          value={assetNumber}
          onChange={(e) => setAssetNumber(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="규격"
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="보관장소"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="구입금액"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />

        <button
          onClick={saveAsset}
          className="bg-black text-white px-5 py-3 rounded w-full"
        >
          등록하기
        </button>

      </div>
    </div>
  )
}