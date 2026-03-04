import nodemailer from 'nodemailer';


const sendEmail = async (email , subject, text,html) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });
    
        const mailOptions = {
            Form: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
            html: html
        };

        await transporter.sendMail(mailOptions);

        console.log('Email sent successfully');
    }
    catch(err){
        console.error('Error sending email:', err);
    }
}

export default sendEmail;