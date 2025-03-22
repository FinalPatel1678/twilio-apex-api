const axios = require("axios");

exports.handler = async function (context, event, callback) {
    // Extracting CallSid and From Number
    const callSid = event.CallSid;
    const fromNumber = event.From;

    console.log("Call SID:", callSid);
    console.log("Phone Number:", fromNumber);

    // Vapi Configuration
    const vapiPhoneNumberId = context.VAPI_PHONE_NUMBER_ID;
    const vapiAssistantId = context.VAPI_ASSISTANT_ID;
    const vapiApiKey = context.VAPI_API_KEY;

    if (!vapiApiKey) {
        console.error("VAPI_API_KEY is missing in environment variables.");
        return callback(new Error("VAPI_API_KEY is not set."));
    }

    // Vapi Call Data
    const requestData = {
        phoneNumberId: vapiPhoneNumberId,
        phoneCallProviderBypassEnabled: true,
        customer: {
            number: fromNumber,
        },
        assistantOverrides: {
            variableValues: {
                callSid: callSid,
            },
        },
        assistantId: vapiAssistantId,
    };

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${vapiApiKey}`,
    };

    try {
        const response = await axios.post(`https://api.vapi.ai/call`, requestData, { headers });

        // Extract TwiML from response
        let origTwiML = response.data?.phoneCallProviderDetails?.twiml;

        if (!origTwiML) {
            throw new Error("No TwiML received from Vapi.AI");
        }

        return callback(null, origTwiML);
    } catch (error) {
        console.error("Error connecting to Vapi.AI:", error);

        // Fallback TwiML in case of error
        let fallbackTwiML = `<Response><Say>Sorry, the virtual assistant is currently unavailable.</Say></Response>`;
        return callback(null, fallbackTwiML);
    }
};
