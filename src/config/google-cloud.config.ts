const projectId = 'quickdocumentai';
const location = 'us'; // Format is 'us' or 'eu'
const processorId = 'c750913e30f183a6'; // Create processor in Cloud Console

export const googleCloudConfig = {
  projectId,
  keyFilename: 'src/config/service-account.json',
  location,
  processorId,
};
