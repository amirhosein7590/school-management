const { default: axios } = require("axios");

export default async function sendSms({
  patternKey,
  phoneNumber,
  param1 = "",
  param2 = "",
  param3 = "",
}) {
  if (patternKey) {
    try {
      const urlBase = "https://api.sms-webservice.com/api/V3/SendTokenSingle";
      const url = `${urlBase}?ApiKey=${process.env.smsApiKey}&TemplateKey=${patternKey}&Destination=${phoneNumber}&p1=${param1}&p2=${param2}&p3=${param3}`;
      const headers = {
        "Content-Type": "text/plain",
      };

      const res = await axios.get(url, { headers });
      const data = await res.data;
      return { ...data, success: true };
    } catch (error) {
      return { ...error, success: false };
    }
  } else {
    // for messages that have not any specific pattern
  }
}
