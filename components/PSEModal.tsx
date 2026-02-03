
import React, { useState } from 'react';

interface PSEModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  courseTitle: string;
  onSuccess: () => void;
}

const PSEModal: React.FC<PSEModalProps> = ({ isOpen, onClose, amount, courseTitle, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2500);
  };

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
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Concepto</p>
                <p className="font-bold text-gray-800">{courseTitle}</p>
                <div className="flex justify-between mt-4 border-t pt-2">
                  <span className="text-gray-600">Total a pagar:</span>
                  <span className="font-black text-blue-700">${amount.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Selecciona tu Banco</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Bancolombia</option>
                    <option>Banco de Bogotá</option>
                    <option>Davivienda</option>
                    <option>Nequi</option>
                    <option>Daviplata</option>
                    <option>BBVA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Correo registrado en PSE</label>
                  <input type="email" placeholder="ejemplo@correo.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
              >
                Continuar con el pago
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10">
              {loading ? (
                <div className="space-y-6">
                  <div className="inline-block w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-gray-700">Redirigiendo a tu sucursal bancaria...</p>
                  <p className="text-xs text-gray-400">Por favor, no cierres esta ventana.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto text-3xl">
                    <i className="fas fa-university"></i>
                  </div>
                  <h3 className="text-xl font-bold">Autorización de Pago</h3>
                  <p className="text-gray-600 text-sm">Al hacer clic, simularemos la aprobación de tu banco.</p>
                  <button 
                    onClick={handlePay}
                    className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl hover:bg-blue-800"
                  >
                    Simular Aprobación Bancaria
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-6">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
              <p className="text-gray-600">Tu inscripción a <strong>{courseTitle}</strong> se ha procesado correctamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PSEModal;
