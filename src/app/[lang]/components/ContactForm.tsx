'use client';

import { FormEvent, useState } from 'react';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';

type SubmissionStatus = 'idle' | 'success' | 'error';

const ContactForm = () => {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setFeedback('');

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('error');
      setFeedback('Konfigurácia formulára nie je kompletná. Kontaktujte prosím administrátora.');
      setIsSubmitting(false);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFeedback('Ďakujeme! Vaša správa bola úspešne odoslaná.');
        form.reset();
      } else {
        setStatus('error');
        setFeedback(data.message || 'Odoslanie zlyhalo. Skúste to prosím znova.');
      }
    } catch (error) {
      console.error('Web3Forms submission failed:', error);
      setStatus('error');
      setFeedback('Pri odosielaní nastala neočakávaná chyba. Skúste to neskôr.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl p-8 rounded-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-primary-700 text-sm font-bold mb-2">
            Meno a priezvisko:
          </label>
          <input
            type="text"
            id="name"
            name="Meno a priezvisko"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-primary-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="Email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-primary-700 text-sm font-bold mb-2">
            Telefónne číslo:
          </label>
          <input
            type="tel"
            id="phone"
            name="Telefónne číslo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-primary-700 text-sm font-bold mb-2">
            Firma (nepovinné):
          </label>
          <input
            type="text"
            id="company"
            name="Firma"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label htmlFor="services" className="block text-primary-700 text-sm font-bold mb-2">
            O aké služby máte záujem?
          </label>
          <input
            type="text"
            id="services"
            name="Služby"
            placeholder="Napíšte, o čo máte záujem"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-primary-700 text-sm font-bold mb-2">
            Stručne opíšte projekt (nepovinné):
          </label>
          <textarea
            id="message"
            name="Správa"
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-700 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Odosielam…' : 'Poslať správu'}
        </button>

        {feedback && (
          <p
            className={`text-sm pt-2 ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
