'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AIButton from './AIButton';

const ContactForm = () => {

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        company: '',
        services: '', // Assuming a dropdown or similar selection
        budget: '',   // Assuming a dropdown or similar selection
        projectDescription: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        phone: Yup.string().required('Required'),
        company: Yup.string(), // Optional
        services: Yup.string().required('Required'),
        budget: Yup.string().required('Required'),
        projectDescription: Yup.string()
    });

    const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
    
            const result = await response.json();
            console.log(result.message); // For debugging
    
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setSubmitting(false);
        }
    };
    

    return (
        <div className="bg-white shadow-2xl p-8 rounded-lg"> {/* Background color and padding */}
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                  <Form>   

                  {/* Name */}
                  <div className="mb-4">
                      <label htmlFor="name" className="block text-primary-700 text-sm font-bold mb-2">Meno a priezvisko:</label>
                      <Field type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight   
focus:outline-none focus:shadow-outline" />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  </div>   


                  {/* Email */}
                  <div className="mb-4">
                      <label htmlFor="email" className="block text-primary-700 text-sm font-bold mb-2">Email:</label>
                      <Field type="email" id="email" name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight   
focus:outline-none focus:shadow-outline" />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1"   
/>
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                      <label htmlFor="phone" className="block text-primary-700 text-sm font-bold mb-2">Telefónne číslo:</label>
                      <Field type="tel" id="phone" name="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none   
focus:shadow-outline" />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-xs   
mt-1" />
                  </div>

                  {/* Company (Optional) */}
                  <div className="mb-4">
                      <label htmlFor="company" className="block text-primary-700 text-sm font-bold mb-2">Firma (Nepovinný)</label>
                      <Field type="text" id="company" name="company" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  </div>

                  {/* Services */}
                  <div className="mb-4">   

                      <label htmlFor="services" className="block text-primary-700 text-sm font-bold mb-2">O aké služby máte záujem?</label>
                      {/* Replace this with your actual dropdown or selection component */}
                      <Field as="select" id="services" name="services" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none   
focus:shadow-outline">
                          <option   
value="">Vyberte si zo zoznamu</option>
                          {/* Add your service options here */}
                      </Field>
                      <ErrorMessage name="services" component="div" className="text-red-500 text-xs mt-1" />
                  </div>


                  {/* Project Description */}
                  <div className="mb-4">
                      <label htmlFor="projectDescription" className="block text-primary-700 text-sm font-bold mb-2">Stručne opíšte projekt (Nepovinný)</label>
                      <Field as="textarea" id="projectDescription" name="projectDescription" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" />
                      <ErrorMessage   
name="projectDescription" component="div" className="text-red-500 text-xs mt-1" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="bg-primary-700 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded   
focus:outline-none focus:shadow-outline">
                      Poslať správu
                  </button>

                  
              </Form>   

                )}
            </Formik>
        </div>
    );
};

export default ContactForm;
