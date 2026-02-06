
import React from 'react';

interface PSEModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  courseTitle: string;
  paymentId: string | null;
  onConfirm: () => void;
}

const PSEModal: React.FC<PSEModalProps> = ({ isOpen, onClose, amount, courseTitle, paymentId, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-[#002e5f] p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded p-1 w-10">
              <img src="https://www.pse.com.co/o/pse-home-theme/images/logo_pse_footer.png" alt="PSE" className="w-full" />
            </div>
            <span className="font-bold">Pago Seguro en Línea</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70"><i className="fas fa-times"></i></button>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Concepto</p>
              <p className="font-bold text-gray-800">{courseTitle}</p>
              <div className="flex justify-between mt-4 border-t pt-2">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-black text-blue-700">${amount.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              Simulación de pago PSE para pruebas. Usa el token fijo y confirma para generar tu certificado automáticamente.
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-2">
              <p className="font-bold">Payment ID: {paymentId ?? 'pendiente'}</p>
              <p className="font-bold">Token fijo: LANGFORD_PSE_TOKEN</p>
            </div>

            <button
              onClick={onConfirm}
              disabled={!paymentId}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg inline-flex items-center justify-center ${paymentId ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-200' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Confirmar pago (Mock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSEModal;
