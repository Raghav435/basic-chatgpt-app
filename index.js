const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const port = 3080;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: "org-hkYpSk723NpWDAXX12axtMIh",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function callApi() {}

callApi();

// create a simple api that calls the function above

app.post("/", async (req, res) => {
  const { message, currentModel } = req.body;
  const response = await openai.createCompletion({
    model: `${currentModel}`,//"text-davinci-003",
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  // console.log(response.data.data);
  res.json({
    models: response.data.data,
  });
});

app.listen(port, () => {
  console.log(`app listening at http:// localhost:${port}`);
});
