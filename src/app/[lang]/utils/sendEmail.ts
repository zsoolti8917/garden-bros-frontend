
import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { name, email, phone, company, services, budget, projectDescription } = req.body;

        // Configure the transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use another email service
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password
            }
        });

        // Email options
        const mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL, // The recipient's email address
            subject: `Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Company: ${company}
                Services: ${services}
                Budget: ${budget}
                Project Description: ${projectDescription}
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
