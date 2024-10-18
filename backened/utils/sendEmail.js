const nodemailer = require('nodemailer');

const sendMail = async(subject,message,send_to,sent_from)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        port:465,
        secure:true,
        auth:{
            user:process.env.HOST_EMAIL,
            pass:process.env.HOST_PASSWORD
        },
        tls: {
            rejectUnauthorized: false,
          },
    })

    const options = {
        from :sent_from,
        to:send_to,
        replyTo:reply_to,
        subject:subject,
        html:message
    }
    
    transporter.sendMail(options,function(err,info){
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log(info)
        }
    })
}

module.exports = sendMail;