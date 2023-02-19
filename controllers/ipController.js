const IpService = require('../services/ipService');
const ipService = new IpService();

const getCountryByIp = async (req, res) => {
  const ip = req.query.ip;
  try {
    const country = await ipService.getCountryByIp(ip);
    res.status(200).send({ country });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getCountryByIp,
};
