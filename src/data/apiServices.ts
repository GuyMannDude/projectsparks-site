import { ApiService } from '@/types/api';

export const apiServices: ApiService[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payments API key validator',
    logo: '💳',
    endpoint: 'https://api.stripe.com/v1/charges',
    method: 'GET',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk_test_...' }
    ]
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    description: 'Geocoding API key tester',
    logo: '🗺️',
    endpoint: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'GET',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'AIza...' },
      { name: 'address', label: 'Address (optional)', type: 'text', required: false, placeholder: '1600 Amphitheatre Parkway' }
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter (X)',
    description: 'Bearer token validator',
    logo: '🐦',
    endpoint: 'https://api.twitter.com/2/tweets/counts/recent',
    method: 'GET',
    fields: [
      { name: 'bearerToken', label: 'Bearer Token', type: 'password', required: true, placeholder: 'AAAAAAAAAA...' }
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Graph API access token tester',
    logo: '📘',
    endpoint: 'https://graph.facebook.com/v13.0/me',
    method: 'GET',
    fields: [
      { name: 'accessToken', label: 'Access Token', type: 'password', required: true, placeholder: 'EAABwz...' }
    ]
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Access key / secret key validator via STS',
    logo: '☁️',
    endpoint: 'https://sts.amazonaws.com',
    method: 'GET',
    fields: [
      { name: 'accessKey', label: 'Access Key', type: 'text', required: true, placeholder: 'AKIA...' },
      { name: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'wJalrXUt...' }
    ]
  }
];