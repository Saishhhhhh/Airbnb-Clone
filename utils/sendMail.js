const nodemailer = require("nodemailer");

const sendMail = async (toEmail, subject, text, html) => {

    try{
        const transporter = nodemailer.createTransport({
    
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            auth: {
                user : process.env.FROM_EMAIL,
                pass : process.env.FROM_EMAIL_PASSWORD
            }
        })
    
        const mailOptions = {
            from: '"Airbnb Home 🏠" <process.env.FROM_EMAIL>',
            to: toEmail,
            subject: subject,
            text: text,
            
            html: html,
          }
    
        const info = await transporter.sendMail(mailOptions);
    
        console.log("Message sent: ", info.messageId)
    
        return info;
    }catch(error){
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }    
};

module.exports = sendMail