'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react'

export default function RegisterForm({ campaignId, loading, setLoading, setSuccess, error, setError }: any) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' })
  const [file, setFile] = useState<File | null>(null)

  // --- COMPRESIÓN AGRESIVA WEBP ---
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
    e.preventDefault(); 
    setLoading(true); 
    setError('')

    if (!file) {
      setError('Por favor, sube la foto de tu voucher.')
      setLoading(false)
      return
    }

    try {
      const optimized = await compressImage(file)
      const path = `${campaignId}/registros_generales/${Date.now()}.webp`
      
      const { error: uploadError } = await supabase.storage
        .from('vouchers')
        .upload(path, optimized)

      if (uploadError) throw new Error('Error al subir la imagen')
      
      const { data: urlData } = supabase.storage.from('vouchers').getPublicUrl(path)

      const { error: insertError } = await supabase.from('registrations').insert({
        full_name: formData.fullName, 
        email: formData.email, 
        phone: formData.phone,
        dni: 'N/A', 
        voucher_url: urlData.publicUrl, 
        campaign_id: campaignId,
        store_id: null,
        prize_id: null
      })

      if (insertError) throw insertError
      setSuccess(true)
    } catch (err: any) { 
      console.error(err)
      setError('Hubo un error al procesar tu registro. Inténtalo de nuevo.') 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">
      {/* TEXTO DE BIENVENIDA */}
      <div className="text-left mb-2 sm:mb-4">
        <p className="text-white font-black text-lg sm:text-lg leading-tight uppercase  ">
          Llena con tus datos y participa <br /> por fabulosos premios
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold rounded-2xl text-center border border-white/10">
          {error}
        </div>
      )}
      
      {/* NOMBRES */}
      <div className="space-y-1">
        <label className="text-[12px] sm:text-[14px] font-black text-white ml-4 uppercase tracking-widest opacity-90">Nombres y Apellidos :</label>
        <input 
          type="text" required
          className="w-full px-6 py-2 rounded-full bg-white border-none outline-none text-black font-bold shadow-xl focus:ring-4 focus:ring-[#2c4896]/30 transition-all text-sm sm:text-base"
          onChange={e => setFormData({...formData, fullName: e.target.value})}
        />
      </div>

      {/* CORREO */}
      <div className="space-y-1">
        <label className="text-[12px] sm:text-[14px] font-black text-white ml-4 uppercase tracking-widest opacity-90">Correo :</label>
        <input 
          type="email" required
          className="w-full px-6 py-2 rounded-full bg-white border-none outline-none text-black font-bold shadow-xl focus:ring-4 focus:ring-[#2c4896]/30 transition-all text-sm sm:text-base"
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
      </div>

      {/* TELÉFONO */}
      <div className="space-y-1">
        <label className="text-[12px] sm:text-[14px] font-black text-white ml-4 uppercase tracking-widest opacity-90">Teléfono :</label>
        <input 
          type="tel" maxLength={9} required
          className="w-full px-6 py-2 rounded-full bg-white border-none outline-none text-black font-bold shadow-xl focus:ring-4 focus:ring-[#2c4896]/30 transition-all text-sm sm:text-base"
          onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g,'')})}
        />
      </div>

      {/* SUBIR FOTO PILL STYLE */}
      <div className="space-y-1">
        <label className="text-[12px] sm:text-[14px] font-black text-white ml-4 uppercase tracking-widest opacity-90">Subir foto de voucher :</label>
        <label className={`flex items-center justify-between w-full px-6 py-2 sm:py-2.5 rounded-full cursor-pointer transition-all bg-white shadow-xl focus-within:ring-4 focus-within:ring-[#2c4896]/30 ${file ? 'text-green-600' : 'text-zinc-400'}`}>
          <div className="flex items-center gap-3">
            {file ? <CheckCircle2 size={18} className="sm:w-5 sm:h-5" /> : <Camera size={18} className="opacity-50 sm:w-5 sm:h-5" />}
            <span className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-[200px]">
              {file ? 'Voucher cargado' : 'Cámara / Archivo'}
            </span>
          </div>
          {!file && <div className="bg-zinc-100 p-1 rounded-full"><ImageIcon size={12} className="text-zinc-400 sm:w-3.5 sm:h-3.5"/></div>}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            capture="environment" 
            onChange={e => setFile(e.target.files?.[0] || null)} 
          />
        </label>
      </div>

      {/* BOTÓN ENVIAR */}
      <div className="pt-4 sm:pt-6 justify-center flex">
        <button 
          type="submit" 
          disabled={loading || !file}
          className="w-full sm:w-48 py-4 sm:py-5 bg-[#2c4896] text-white rounded-full font-black text-xl sm:text-2xl shadow-[0_10px_30px_rgba(44,72,150,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale uppercase tracking-tighter"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : 'ENVIAR'}
        </button>
      </div>

    </form>
  )
}