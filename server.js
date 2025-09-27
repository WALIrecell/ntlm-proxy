const express = require('express');
const morgan = require('morgan');
const httpntlm = require('httpntlm');

const app = express();
const port = process.env.PORT || 3000;
const nestoEndpoint = 'https://lscae.inaamrewards.com:7038/SSLINAAMUAE/ODataV4/Company(\'INAAM\')/InaamAPIProcess(1)/NAV.BlackbeltAPI';
const ntlmUsername = process.env.NTLM_USERNAME || 'Bbelt'; // Use env var for prod
const ntlmPassword = process.env.NTLM_PASSWORD || 'B@#nesto';

app.use(morgan('dev'));
app.use(express.json());

app.post('/nesto', (req, res) => {
  const payload = req.body; // { voucher_code, amount, shenc }

  const options = {
    url: nestoEndpoint,
    username: ntlmUsername,
    password: ntlmPassword,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  httpntlm.post(options, (err, ntlmRes) => {
    if (err) {
      console.error('NTLM Error:', err);
      return res.status(500).send('Proxy error');
    }
    res.status(ntlmRes.statusCode).send(ntlmRes.body);
  });
});

app.listen(port, () => console.log(`NTLM Proxy running on port ${port}`));
