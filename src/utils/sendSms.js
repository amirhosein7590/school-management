const { default: axios } = require("axios");

export default async function sendSms({
  patternKey,
  phoneNumber,
  param1 = "",
  param2 = "",
  param3 = "",
  text = "",
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
    try {
      const url = "http://api.sms-webservice.com/api/V3/SendBulk";
      const bodyReq = {
        ApiKey: process.env.smsApiKey,
        Text: text,
        Sender: process.env.sender,
        Recipients: [
          {
            Destination: phoneNumber,
            UserTraceId: 0,
          },
        ],
      };
      const headers = {
        "Content-Type": "application/json",
      };

      console.log(bodyReq);

      const res = await axios.post(url, bodyReq, { headers });
      const data = await res.data;
      console.log(data);
      return { ...data, success: true };
    } catch (error) {
      console.log(error);
      return { ...error, success: false };
    }
  }
}
