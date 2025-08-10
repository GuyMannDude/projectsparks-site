import { ApiService } from '@/types/api';

export const extendedApiServices: ApiService[] = [
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Access token tester',
    logo: '📦',
    endpoint: 'https://api.dropboxapi.com/2/users/get_current_account',
    method: 'POST',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'sl.B...' }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Graph API token tester',
    logo: '📷',
    endpoint: 'https://graph.facebook.com/v13.0/me',
    method: 'GET',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'IGQVJYa...' }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Data API key validator',
    logo: '📺',
    endpoint: 'https://www.googleapis.com/youtube/v3/channels',
    method: 'GET',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'AIza...' },
      { name: 'channelId', label: 'Channel ID (optional)', type: 'text', required: false, placeholder: 'UC_x5XG1OV2P6uZZ5FSM9Ttw' }
    ]
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    description: 'OAuth token tester',
    logo: '🔵',
    endpoint: 'https://management.azure.com/subscriptions',
    method: 'GET',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'eyJ0eXA...' }
    ]
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Personal access token validator',
    logo: '🐙',
    endpoint: 'https://api.github.com/user',
    method: 'GET',
    fields: [
      { name: 'token', label: 'Personal Access Token', type: 'password', required: true, placeholder: 'ghp_...' }
    ]
  }
];