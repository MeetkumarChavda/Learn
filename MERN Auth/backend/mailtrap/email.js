import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken)=>{
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from:sender,
            to : recipient,
            subject: "Verification Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async( email , name )=>{
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "a6832225-f537-4851-9558-7b3450beacac",
            template_variables: {
            "company_info_name": "MERN_Auth",
            "name": name,
            "company_info_address": "5060 A St, Opp babubhai chaiwala Alaska",
            "company_info_city": "Anchorage",
            "company_info_zip_code": "99503",
            "company_info_country": "United States"
            }
       });
       console.log("Welcome email sent successfully" , response)
    } catch (error) {
        console.error(`Error sending verification`, error);
		throw new Error(`Error sending verification email: ${error}`);
    }
}