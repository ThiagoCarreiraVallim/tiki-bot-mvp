const express = require('express');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/webhook', (req, res) => {
  const TOKEN = process.env.VERIFY_TOKEN || "tikibot";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if(mode && token) {
    if(mode === "subscribe" && token === TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', async (req, res) => {
  if(req.body.object) {
    const validator = req.body?.entry[0]?.changes[0]?.value;
    if(validator.messages && validator.messages[0]) {
      console.log(req.body.entry[0].changes[0].value.messages);
      const message = req.body.entry[0].changes[0].value.messages[0];
      const display_phone_number = req.body.entry[0].changes[0].value.metadata.display_phone_number;
      const waId = req.body.entry[0].changes[0].value.contacts[0].wa_id;
      console.log("Aooooooooooooooooooooooooooooba", display_phone_number);
      console.log("Aooooooooooooooooooooooooooooba22222222222", waId);
      const { text: { body } } = message;
      try {
        
        await axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v17.0/183595931493219/messages",
          data: {
            messaging_product: "whatsapp",
            to: waId,
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                  text: "Aceitas ?"
                },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "1",
                                title: "Sim"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "2",
                                title: "Claro"
                            }
                        }
                    ]
                }
            }
          },
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer EAAYAbgueDHsBOZCWLnhuYFAaPzltdlVGC1uM9PXsLThZATAznNL4kKuya3SBBQFFF9dyUoOFMfSWnBJQneQKZAJ5hiWZAYqbi9M8R7q0ZAjlVGpLZANX3GaDLsiIlXYkKRgZAw4B66VTNnZBSXSOdxS2VIj6nwHXwynMSmvus4XQ8ZCtgUoMEuSifyNwVotZAOMZADNHk66wwsTNYLVcz0JbIB8KxEZD",
          },
        });
        res.sendStatus(200);
      } catch (error) {
        // console.log(error.response);
        res.sendStatus(500);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log('Server listening on port 3000');
});