import { Ticket } from 'lucide-react'

export default function SuccessView({ wonPrize, storeName }: any) {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 p-4 max-w-sm mx-auto">
      
      {/* Logo Superior */}
      <img 
        src="/logofantaxbox.png" 
        alt="Fanta x Xbox" 
        className="h-20 w-auto mb-8 object-contain drop-shadow-lg"
      />

      <div className="w-full bg-transparent rounded-[3rem] mb-6 relative overflow-hidden">
        {wonPrize ? (
          <>
            {/* Imagen del Premio */}
            {wonPrize.image_url && (
              <div className="relative mb-6 group">
                <img 
                  src={wonPrize.image_url} 
                  className="w-full h-full sm:h-full object-contain mx-auto " 
                  alt={wonPrize.name}
                />
              </div>
            )}
            
            {/* Nombre del Premio */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tighter mb-6">
              {wonPrize.name}
            </h2>

            {/* Instrucciones */}
            <div className="space-y-1">
              <p className="text-white text-md font-normal">
                Acércate al promotor y reclama tu premio
              </p>
              <p className="text-white-500 text-[10px] uppercase tracking-widest">
                Imágenes referenciales*
              </p>
            </div>
          </>
        ) : (
          /* Estado sin premios físicos */
          <div className="py-12 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <Ticket size={48} className="mx-auto text-zinc-700 mb-4 opacity-50" />
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-tight leading-tight px-8">
              Registro exitoso, pero los premios físicos se han agotado en este punto.
            </p>
          </div>
        )}
      </div>

      {/* Nombre de la Tienda (Footer) */}
      <div className="mt-4">
        <p className="text-[#f9c433] font-black uppercase tracking-[0.3em] text-[11px]">
          {storeName || "Punto de venta"}
        </p>
      </div>

    </div>
  )
}