'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react'

export default function RegisterForm({ storeId, campaignId, loading, setLoading, setSuccess, setWonPrize, error, setError }: any) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' })
  const [file, setFile] = useState<File | null>(null)

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image(); img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 800; let w = img.width, h = img.height
        if (w > h && w > MAX) { h *= MAX / w; w = MAX } else if (h > MAX) { w *= MAX / h; h = MAX }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
        canvas.toBlob(b => resolve(new File([b!], 'v.webp', { type: 'image/webp' })), 'image/webp', 0.6)
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data: prizes } = await supabase.from('prizes').select('*').eq('store_id', storeId).gt('stock', 0)
      let prize = null
      if (prizes?.length) {
        prize = prizes[Math.floor(Math.random() * prizes.length)]
        await supabase.from('prizes').update({ stock: prize.stock - 1 }).eq('id', prize.id)
      }

      const optimized = await compressImage(file!)
      const path = `${campaignId}/${storeId}/${Date.now()}.webp`
      await supabase.storage.from('vouchers').upload(path, optimized)
      const { data: url } = supabase.storage.from('vouchers').getPublicUrl(path)

      await supabase.from('registrations').insert({
        full_name: formData.fullName, 
        email: formData.email, 
        phone: formData.phone,
        dni: 'N/A', 
        voucher_url: url.publicUrl, 
        store_id: storeId, 
        campaign_id: campaignId, 
        prize_id: prize?.id || null
      })

      setWonPrize(prize); setSuccess(true)
    } catch (err) { setError('Error al procesar. Revisa tu conexión.') } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* TEXTO DE BIENVENIDA */}
      <div className="text-left ">
        <p className="text-white font-black text-xl leading-tight uppercase">
          Llena con tus datos y participa <br /> por fabulosos premios
        </p>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-white text-xs font-bold rounded-2xl text-center">{error}</div>}
      
      {/* NOMBRES */}
      <div className="space-y-1.5">
        <label className="text-[15px] font-black text-white ml-3 uppercase tracking-widest opacity-90">Nombres y Apellidos :</label>
        <input 
          type="text" required
          className="w-full px-6 py-4 rounded-full bg-white border-none outline-none text-black font-semibold shadow-inner focus:ring-4 focus:ring-black/10 transition-all"
          onChange={e => setFormData({...formData, fullName: e.target.value})}
        />
      </div>

      {/* CORREO */}
      <div className="space-y-1.5">
        <label className="text-[15px] font-black text-white ml-3 uppercase tracking-widest opacity-90">Correo :</label>
        <input 
          type="email" required
          className="w-full px-6 py-4 rounded-full bg-white border-none outline-none text-black font-semibold shadow-inner focus:ring-4 focus:ring-black/10 transition-all"
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
      </div>

      {/* TELÉFONO */}
      <div className="space-y-1.5">
        <label className="text-[15px] font-black text-white ml-3 uppercase tracking-widest opacity-90">Teléfono :</label>
        <input 
          type="tel" maxLength={9} required
          className="w-full px-6 py-4 rounded-full bg-white border-none outline-none text-black font-semibold shadow-inner focus:ring-4 focus:ring-black/10 transition-all"
          onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})}
        />
      </div>

      {/* SUBIR FOTO PILL STYLE */}
      <div className="space-y-1.5">
        <label className="text-[15px] font-black text-white ml-3 uppercase tracking-widest opacity-90">Subir foto de voucher :</label>
        <label className={`flex items-center justify-between w-full px-6 py-4 rounded-full cursor-pointer transition-all bg-white shadow-inner focus-within:ring-4 focus-within:ring-black/10 ${file ? 'text-[#e53829]' : 'text-black/40'}`}>
          <div className="flex items-center gap-3">
            {file ? <CheckCircle2 size={20} className="text-green-500" /> : <Camera size={20} className="opacity-50" />}
            <span className="text-sm font-bold truncate max-w-[200px]">
              {file ? file.name : 'Seleccionar archivo / Cámara'}
            </span>
          </div>
          {!file && <div className="bg-zinc-100 p-1.5 rounded-full"><ImageIcon size={14} className="text-zinc-400"/></div>}
          <input type="file" className="hidden" accept="image/*" capture="environment" onChange={e => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      {/* BOTÓN ENVIAR */}
      <div className="pt-4 justify-center flex">
        <button 
          type="submit" disabled={loading || !file}
          className="w-40 py-5 bg-[#2c4896] text-white rounded-full font-black text-2xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 uppercase tracking-tighter"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'ENVIAR'}
        </button>
      </div>

    </form>
  )
}