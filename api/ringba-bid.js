const fetch = require('node-fetch');

const RTB_ID = 'd8a7015c1f584b16ae07af058c06ed8a';
const RINGBA_API_URL = `https://rtb.ringba.com/v1/production/${RTB_ID}.json`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { CID, zipcode } = req.body || {};
  if (!CID || !zipcode) {
    return res.status(400).json({ message: 'CID and zipcode are required parameters.' });
  }

  const ringbaPayload = {
    CID: CID,
    exposeCallerid: 'yes',
    zipcode: zipcode,
    subid: 'yes'
  };

  try {
    const response = await fetch(RINGBA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ringbaPayload)
    });

    const json = await response.json();
    return res.status(200).json(json);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to contact external Ringba API.', error: error.message });
  }
};
