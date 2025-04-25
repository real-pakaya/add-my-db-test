const axios = require('axios');
const qs = require('querystring');
const cheerio = require('cheerio');

// Function to get buffer data (content)
const getBuffer = async (url, options = {}) => {
  try {
    const res = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
      ...options,
    });
    return res.data;
  } catch (e) {
    console.log('Error fetching buffer:', e);
    throw e;
  }
};

// Function to format bytes into a readable format
const formatBytes = (x) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let bytes = x;
  let i;

  for (i = 0; bytes >= 1024 && i < units.length - 1; i++) {
    bytes /= 1024;
  }

  return bytes.toFixed(2) + ' ' + units[i];
};

// Function to get the file size
async function getSize(url) {
  try {
    const buffer = await getBuffer(url);
    return formatBytes(Buffer.byteLength(buffer));
  } catch (error) {
    console.log('Error getting file size:', error);
    return 'Error';
  }
}

// Generic function to scrape download info from the provided URL
const getDownloadData = async (link, format) => {
  const data = {
    url: link,
    format,
    lang: 'en',
  };

  try {
    // POST request to get token
    const response = await axios.post(
      'https://s64.notube.net/recover_weight.php',
      qs.stringify(data)
    );

    // GET request to retrieve the download page using the token
    const downloadPage = await axios.get(
      'https://notube.net/en/download?token=' + response.data.token
    );
    
    // Parse the page content
    const $ = cheerio.load(downloadPage.data);
    
    // Get the required details from the page
    const title = $('#breadcrumbs-section h2').text();
    const downloadLink = $('#breadcrumbs-section #downloadButton').attr('href');
    
    // Get file size
    const size = await getSize(downloadLink);

    return {
      title,
      download: downloadLink,
      size,
    };
  } catch (error) {
    console.error('Error fetching download data:', error);
    throw error;
  }
};

// Function to get MP4 video
const ytmp4 = async (link) => {
  return await getDownloadData(link, 'mp4');
};

// Function to get HD MP4 video
const ytmp4hd = async (link) => {
  return await getDownloadData(link, 'mp4hd');
};

// Function to get MP3 audio
const ytmp3 = async (link) => {
  return await getDownloadData(link, 'mp3');
};

module.exports = { ytmp3, ytmp4, ytmp4hd };
