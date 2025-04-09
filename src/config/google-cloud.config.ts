const projectId = 'quickdocumentai';
const location = 'us'; // Format is 'us' or 'eu'
const processorId = '5277e73861e9a359'; // Create processor in Cloud Console

export const googleCloudConfig = {
  projectId,
  keyFilename: 'src/config/service-account.json',
  location,
  processorId,
};
