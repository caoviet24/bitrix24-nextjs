


const bitrixConfig = {
    domain: process.env.NEXT_PUBLIC_BITRIX_DOMAIN || 'https://caoviet.bitrix24.vn',
    clientId: process.env.NEXT_PUBLIC_BITRIX_CLIENT_ID || '',
    clientSecret: process.env.NEXT_PUBLIC_BITRIX_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_BITRIX_REDIRECT_URI || '',
    accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN || '',
    refreshToken: process.env.NEXT_PUBLIC_REFRESH_TOKEN || '',
}

export default bitrixConfig;