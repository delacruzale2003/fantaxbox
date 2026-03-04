'use client'

import { CheckCircle2 } from 'lucide-react'

export default function SuccessView() {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000 p-4 max-w-sm mx-auto">
      
      {/* Logo Superior */}
      <img 
        src="/logofantaxbox.png" 
        alt="Fanta x Xbox" 
        className="h-24 w-auto mb-10 object-contain drop-shadow-2xl"
      />

      {/* Contenedor de Mensaje Principal */}
      <div className="w-full bg-white/10 backdrop-blur-xl rounded-[3.5rem] p-10 shadow-2xl border border-white/20 mb-8 relative overflow-hidden group">
        
        {/* Círculo de Éxito */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
           <CheckCircle2 size={44} className="text-[#e53829]" strokeWidth={2.5} />
        </div>

        <div className="space-y-4">
          <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">
            ¡Felicidades!
          </h2>
          
          <div className="space-y-1">
            <p className="text-white text-xl font-bold leading-tight">
              Ya estás participando <br /> por grandes premios.
            </p>
           
          </div>
        </div>

        {/* Efecto de luz decorativo */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Botón de retorno o cierre */}
      <button 
        onClick={() => window.location.reload()}
        className="w-full py-5 bg-white text-[#e53829] rounded-full font-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-tight"
      >
        Finalizar
      </button>

  

    </div>
  )
}