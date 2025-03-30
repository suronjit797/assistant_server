import config from "../config";

export const bottomFooter = `
                    <table style="margin-top:20px">
                        <tr>
                            <td>
                                <h3 style="font-size:15px;font-family:Arial,sans-serif;margin:0px;">
                                    Sustainable Energy Development Authority (CMS) Malaysia</h3>
                            </td>
                        </tr>
                    </table>
                    <hr />
                    <p style="font-size:13px;font-family:Arial,sans-serif;padding:0px;">
                        Galeria PjH, Aras 9, Jalan P4W, Persiaran Perdana, Presint 4, 62100 Putrajaya, Malaysia.
                    </p>
`;

const emailFooter = `
                    <tr>
                        <td style="padding:30px; padding-top:0">
                            <table role="presentation"
                                style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                <tr>
                                    <td style="padding:0;width:25%; padding-right:20px" align="left">
                                        <img src="${config.FRONTEND_URL}/images/logo.png" alt="logo"
                                        style="max-width:180px">
                                    </td>
                                    <td style="padding:0;width:75%;">
                                        <table role="presentation"
                                            style="border-collapse:collapse;border:0;border-spacing:0;">
                                            <tr>
                                                <td>
                                                    <p
                                                        style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                        Administrator,</p>
                                                    <p
                                                        style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                        IVIS Cloud Monitoring System 
                                                    </p>                    
                                                    <p
                                                        style="font-size:16px;font-family:Arial,sans-serif;padding:0px;margin:0px;">
                                                        Customer Care Email : <a href="mailto:${config.CUSTOMER_CARE_EMAIL}">${config.CUSTOMER_CARE_EMAIL}</a></p>
                                                </td>

                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>      
                        </td>
                    </tr>
`;

export default emailFooter;
