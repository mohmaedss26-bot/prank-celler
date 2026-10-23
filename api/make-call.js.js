import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال رقم الهاتف والرسالة النصية' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioNumber) {
    return res.status(500).json({ 
      success: false, 
      error: 'إعدادات Twilio غير مكتملة في Vercel Environment Variables' 
    });
  }

  const client = twilio(accountSid, authToken);

  try {
    const call = await client.calls.create({
      twiml: `<Response><Say voice="alice" language="ar-SA">${message}</Say></Response>`,
      to: phoneNumber,
      from: twilioNumber,
    });

    return res.status(200).json({ success: true, callSid: call.sid });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}