const NodeCache = require("node-cache");
const axios = require("axios");
require('dotenv').config();

class IpService {
    constructor() {
      this.cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
      this.vendors = [        
        {
          name: 'ipstack',
          url: 'http://api.ipstack.com/',
          apiKey: process.env.ipstack_API_KEY,
          rateLimit: process.env.ipstack_RATE_LIMIT || 15,
          remainingRequests: process.env.ipstack_RATE_LIMIT || 15,
          resetTime: 0,
        },
        {
          name: 'ipregistry',
          url: 'https://api.ipregistry.co/',
          apiKey: process.env.ipregistry_API_KEY,
          rateLimit: process.env.ipregistry_RATE_LIMIT || 15,
          remainingRequests: process.env.ipregistry_RATE_LIMIT || 15,
          resetTime: 0,
        },
      ];
    }
  
    async getCountryByIp(ip) {
      const cachedResult = this.cache.get(ip);
      if (cachedResult) {
        return cachedResult;
      }
      
      let vendorIndex = this.getAvailableVendorIndex();
      let vendor = this.vendors[vendorIndex];
      let response = null;  
      
      try {
        console.log(`${vendor.url}${ip}?access_key=${vendor.apiKey}`);
        if (vendor.name=="ipstack"){
          response = await axios.get(`${vendor.url}${ip}?access_key=${vendor.apiKey}`);
        }
        else{
        response = await axios.get(`${vendor.url}${ip}?key=${vendor.apiKey}`);}
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 403) {
          vendor.remainingRequests = 0;
          vendor.resetTime = error.response.headers['x-ratelimit-reset'];
          vendorIndex = this.getAvailableVendorIndex();
          vendor = this.vendors[vendorIndex];
          if (vendor.name=="ipstack"){
            response = await axios.get(`${vendor.url}${ip}?access_key=${vendor.apiKey}`);
          }
          else{
          response = await axios.get(`${vendor.url}${ip}?key=${vendor.apiKey}`);}
        } else {
          console.log(response);
          throw new Error('IP lookup failed');
        }
      }
  
      vendor.remainingRequests -= 1;
  
      if (vendor.remainingRequests === 0) {
        vendor.resetTime = Date.now() + (parseInt(vendor.rateLimit, 10) * 60 * 60 * 1000);
      }
  
      if (response.data.country_name || response.data.location.country.name) {
        const country = response.data.country_name || response.data.location.country.name;
        this.cache.set(ip, country);
        return country;
      } else {
        console.log(response.data);
        throw new Error('IP lookup failed');
      }
    }
  
    getAvailableVendorIndex() {
      let availableVendors = this.vendors.filter((vendor) => {
        return vendor.remainingRequests > 0 && vendor.resetTime <= Date.now();
      });
  
      if (availableVendors.length > 0) {
        return this.vendors.indexOf(availableVendors[0]);
      } else {
        throw new Error('Rate limit exceeded for all the vendors');
      }
    }
  }
  
  module.exports = IpService;
  