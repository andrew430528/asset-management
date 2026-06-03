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
const [assetType, setAssetType] = useState('')
const [department1, setDepartment1] = useState(
  typeof window !== 'undefined'
    ? localStorage.getItem('department') || ''
    : ''
)
const [department2, setDepartment2] = useState('00')
const [serialNumber, setSerialNumber] = useState('')
const [specification, setSpecification] = useState('')
const [location, setLocation] = useState('')
const [purchasePrice, setPurchasePrice] = useState('')
const [notes, setNotes] = useState('')
const [purchaseDate, setPurchaseDate] = useState('')
const [imageFile, setImageFile] = useState<File | null>(null)

const saveAsset = async () => {
if (
!itemName ||
!assetType ||
!department1 ||
!serialNumber
) {
alert('필수 항목을 입력하세요.')
return
}


const generatedNumber =
  `${assetType}-${department1}-${department2}-${serialNumber}`

let imageUrl = ''

if (imageFile) {
  const ext = imageFile.name.split('.').pop()

  const fileName =
    `asset-${Date.now()}.${ext}`

  const {
    data: uploadData,
    error: uploadError
  } = await supabase.storage
    .from('assets')
    .upload(fileName, imageFile)

  console.log('uploadData:', uploadData)
  console.log('uploadError:', uploadError)

  if (uploadError) {
    alert(uploadError.message)
    return
  }

  const { data } =
    supabase.storage
      .from('assets')
      .getPublicUrl(fileName)

  imageUrl = data.publicUrl
}

const { error } = await supabase
  .from('assets')
  .insert([
    {
      item_name: itemName,
      asset_number: generatedNumber,
      department1: department1,
      specification,
      location,
      purchase_price: Number(purchasePrice),
      purchase_date: purchaseDate,
notes: notes,
image_url: imageUrl
    }
  ])

if (error) {
  alert(error.message)
  return
}

alert('등록 완료')
router.push('/assets')


}

return ( <div className="p-8 max-w-xl mx-auto"> <h1 className="text-3xl font-bold mb-6">
비품 등록 </h1>


  <div className="space-y-4">

    <input
      className="border p-3 w-full rounded"
      placeholder="비품명"
      value={itemName}
      onChange={(e) =>
        setItemName(e.target.value)
      }
    />

    <div>
      <label className="block mb-2 font-semibold">
        비품 사진
      </label>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImageFile(e.target.files[0])
          }
        }}
      />
    </div>

    <div className="border-2 border-amber-400 bg-amber-50 rounded-lg p-4">
      <div className="text-sm text-gray-600 mb-1">
        생성될 관리번호
      </div>

      <div className="font-bold text-lg">
  {(assetType || '**') +
    '-' +
    (department1 || '**') +
    '-' +
    (department2 || '**') +
    '-' +
    (serialNumber || '****')}
</div>
    </div>

    <select
      className="border p-3 w-full rounded"
      value={assetType}
      onChange={(e) =>
        setAssetType(e.target.value)
      }
    >
      <option value="">자산구분 선택</option>

      <option value="A1">(A1) 사무기기</option>
      <option value="A2">(A2) 사무가구</option>
      <option value="A3">(A3) 생활용품</option>
      <option value="A4">(A4) 기타 일반비품</option>

      <option value="B1">(B1) 전산장비</option>
      <option value="B2">(B2) 가전제품</option>
      <option value="B3">(B3) 멀티미디어/네트워크</option>
      <option value="B4">(B4) 디스플레이</option>
      <option value="B5">(B5) 기타 전자비품</option>

      <option value="C1">(C1) 믹서</option>
      <option value="C2">(C2) 마이크</option>
      <option value="C3">(C3) 스피커</option>
      <option value="C4">(C4) 앰프</option>
      <option value="C5">(C5) 녹음기</option>
      <option value="C6">(C6) 아웃보드</option>
      <option value="C7">(C7) 악기</option>
      <option value="C8">(C8) 기타 음향비품</option>

      <option value="D1">(D1) 촬영장비</option>
      <option value="D2">(D2) 편집장비</option>
      <option value="D3">(D3) 기타 영상비품</option>

      <option value="E1">(E1) 일반공구</option>
      <option value="E2">(E2) 전동공구</option>
      <option value="E3">(E3) 에어공구</option>
      <option value="E4">(E4) 엔진공구</option>
      <option value="E5">(E5) 측정공구</option>
      <option value="E6">(E6) 건설기계</option>
      <option value="E7">(E7) 기타 건설비품</option>
    </select>

   <div className="border p-3 rounded bg-gray-100">
  부서 :
  {' '}
  {typeof window !== 'undefined'
    ? localStorage.getItem(
        'departmentName'
      )
    : ''}
</div>
      <option value="">부서 선택</option>

      <option value="01">(01)총무부</option>
      <option value="02">(02)행정서무부</option>
      <option value="03">(03)내무부</option>
      <option value="04">(04)기획부</option>
      <option value="05">(05)재정부</option>
      <option value="06">(06)교육부</option>
      <option value="07">(07)신학부</option>
      <option value="08">(08)외교정책선교부</option>
      <option value="09">(09)전도부</option>
      <option value="10">(10)문화부</option>
      <option value="11">(11)출판부</option>
      <option value="12">(12)정보통신부</option>
      <option value="13">(13)찬양부</option>
      <option value="14">(14)섭외부</option>
      <option value="15">(15)국내선교부</option>
      <option value="16">(16)홍보부</option>
      <option value="17">(17)법무부</option>
      <option value="18">(18)감사부</option>
      <option value="19">(19)건설부</option>
      <option value="20">(20)체육부</option>
      <option value="21">(21)사업부</option>
      <option value="22">(22)보건후생복지부</option>
      <option value="23">(23)봉사교통부</option>
      <option value="24">(24)신문고부</option>
      <option value="29">(29)국제부</option>
    </select>

    <input
      className="border p-3 w-full rounded"
      placeholder="부서코드2"
      value={department2}
      onChange={(e) =>
        setDepartment2(e.target.value)
      }
    />

    <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
      <div className="font-bold mb-1">
        부서코드2 안내
      </div>

      <div>일반 행정비품은 00 사용</div>

      <div>
        문화부 과별 비품은 과코드 사용
        (01, 02, 03 ...)
      </div>

      <div>
        선교센터 및 산하기관은
        기관코드 사용
      </div>

      <div>
        자문,장년,부녀,청년,학생,유년은 
        내무부 선택 후 부서코드 기입
      </div>


    </div>

    <input
      className="border p-3 w-full rounded"
      placeholder="일련번호 (예: 0012)"
      value={serialNumber}
      onChange={(e) =>
        setSerialNumber(e.target.value)
      }
    />

    <input
      className="border p-3 w-full rounded"
      placeholder="규격"
      value={specification}
      onChange={(e) =>
        setSpecification(e.target.value)
      }
    />

    <input
      className="border p-3 w-full rounded"
      placeholder="보관장소"
      value={location}
      onChange={(e) =>
        setLocation(e.target.value)
      }
    />

    <input
      className="border p-3 w-full rounded"
      placeholder="구입금액"
      value={purchasePrice}
      onChange={(e) =>
        setPurchasePrice(e.target.value)
      }
    />
<label className="block mb-2 font-semibold">
  구입일
</label>

<input
  type="date"
  className="border p-3 w-full rounded"
  value={purchaseDate}
  onChange={(e) =>
    setPurchaseDate(e.target.value)
  }
/>

<label className="block mb-2 font-semibold">
  특이사항
</label>

<textarea
  className="border p-3 w-full rounded"
  rows={5}
  placeholder="수리이력, 보관주의사항, 담당자 메모 등을 입력하세요"
  value={notes}
  onChange={(e) =>
    setNotes(e.target.value)
  }
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
