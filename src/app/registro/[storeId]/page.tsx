'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, AlertCircle } from 'lucide-react'

// Sub-componentes
import StoreHeader from './components/StoreHeader'
import RegisterForm from './components/RegisterForm'
import SuccessView from './components/SuccessView'

export default function RegisterStorePage() {
  const params = useParams()
  const storeId = params?.storeId as string

  // Estados de Negocio
  const [storeName, setStoreName] = useState('')
  const [campaignId, setCampaignId] = useState('')
  const [validStore, setValidStore] = useState<boolean | null>(null)
  
  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [wonPrize, setWonPrize] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!storeId) return
    
    const fetchStore = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('name, campaign_id, is_active')
        .eq('id', storeId)
        .single()

      if (error || !data || !data.is_active) {
        setValidStore(false)
        return
      }

      setStoreName(data.name)
      setCampaignId(data.campaign_id)
      setValidStore(true)
    }

    fetchStore()
  }, [storeId])

  // Pantalla de carga (Apple/Fanta style)
  if (validStore === null) return (
    <div className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex items-center justify-center">
      <Loader2 className="animate-spin text-white/50" size={40} />
    </div>
  )
  
  // Tienda no válida
  if (validStore === false) return (
    <div className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex flex-col items-center justify-center p-6 text-white text-center">
      <AlertCircle size={64} className="mb-4 opacity-50" />
      <h1 className="text-2xl font-bold uppercase tracking-tighter">Enlace no válido</h1>
      <p className="opacity-80">Esta tienda no existe o la campaña ha finalizado.</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#f89824] to-[#e53829] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-white/30">
      <div className="w-full max-w-md bg-transparent rounded-[3rem] p-4 sm:p-10 animate-in fade-in zoom-in duration-500">
        
        {!success ? (
          <div key="register-form">
            <StoreHeader />
            
            <RegisterForm 
              storeId={storeId}
              campaignId={campaignId}
              setLoading={setLoading}
              loading={loading}
              setSuccess={setSuccess}
              setWonPrize={setWonPrize}
              setError={setError}
              error={error}
            />
          </div>
        ) : (
          /* Aquí pasamos el storeName obtenido de la DB al SuccessView */
          <div key="success-view">
            <SuccessView 
              storeName={storeName} 
              wonPrize={wonPrize} 
            />
          </div>
        )}

      </div>
    </main>
  )
}