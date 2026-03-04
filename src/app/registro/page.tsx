'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertCircle } from 'lucide-react'

// Sub-componentes
import StoreHeader from './components/StoreHeader'
import RegisterForm from './components/RegisterForm'
import SuccessView from './components/SuccessView'

export default function RegisterPage() {
  // Obtenemos el nombre de la campaña desde el .env
  const CAMPAIGN_NAME = process.env.NEXT_PUBLIC_CAMPAIGN || 'x'

  const [campaignId, setCampaignId] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const initCampaign = async () => {
      // Buscamos el ID de la campaña por su nombre y verificamos que esté activa
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, is_active')
        .eq('name', CAMPAIGN_NAME)
        .single()

      if (error || !data || !data.is_active) {
        console.error("Campaña no encontrada o inactiva");
        setIsValid(false)
        return
      }

      setCampaignId(data.id)
      setIsValid(true)
    }

    initCampaign()
  }, [CAMPAIGN_NAME])

  // Pantalla de carga (Fanta style)
  if (isValid === null) return (
    <div className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/50" size={40} />
    </div>
  )
  
  // Campaña no disponible
  if (isValid === false) return (
    <div className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex flex-col items-center justify-center p-6 text-white text-center">
      <AlertCircle size={64} className="mb-4 opacity-50" />
      <h1 className="text-2xl font-black uppercase tracking-tighter">Registro no disponible</h1>
      <p className="opacity-80">La campaña ha finalizado o el enlace es incorrecto.</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-white/30">
      <div className="w-full max-w-md bg-transparent rounded-[3rem] p-4 sm:p-10 animate-in fade-in zoom-in duration-500">
        
        {!success ? (
          <div key="register-form">
            <StoreHeader />
            <RegisterForm 
              campaignId={campaignId}
              setLoading={setLoading}
              loading={loading}
              setSuccess={setSuccess}
              setError={setError}
              error={error}
            />
          </div>
        ) : (
          <div key="success-view">
            <SuccessView />
          </div>
        )}

      </div>
    </main>
  )
}