
import React, { useMemo, useState } from 'react';

interface PSEModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  courseTitle: string;
  paymentUrl: string;
  returnUrl: string;
}

const PSEModal: React.FC<PSEModalProps> = ({ isOpen, onClose, amount, courseTitle, paymentUrl, returnUrl }) => {
  const [fullName, setFullName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const paymentLink = useMemo(() => {
    const params = new URLSearchParams({
      amount: amount.toString(),
      reference: courseTitle,
      return_url: returnUrl,
      full_name: fullName,
      document_id: documentId,
      email
    });
    return `${paymentUrl}?${params.toString()}`;
  }, [amount, courseTitle, documentId, email, fullName, paymentUrl, returnUrl]);

  const isReadyToPay = Boolean(fullName && documentId && email);

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

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Nombre completo</label>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nombre y apellido"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Cédula / Documento</label>
                <input
                  value={documentId}
                  onChange={(event) => setDocumentId(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Número de documento"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">Correo electrónico</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="nombre@correo.com"
                  type="email"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              Serás redirigido a la pasarela PSE para completar el pago. Al finalizar, regresarás a la plataforma para habilitar tu certificado.
            </div>

            <a
              href={paymentLink}
              className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg inline-flex items-center justify-center ${isReadyToPay ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
              aria-disabled={!isReadyToPay}
              onClick={(event) => {
                if (!isReadyToPay) {
                  event.preventDefault();
                }
              }}
            >
              Ir a PSE y pagar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSEModal;
