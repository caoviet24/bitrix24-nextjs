"use server"

import fs from "node:fs";
import path from 'path';
import bitrixConfig from '@/configs/bitrixConfig';

export async function writeToEnv({
    field,
    value
}: {
    field: string;
    value: string;
}) {
    const envPath = path.join(process.cwd(), '.env');
    let env = '';
  
    if (fs.existsSync(envPath)) {
      env = fs.readFileSync(envPath, 'utf-8');
      if (env.includes(`NEXT_PUBLIC_${field}=`)) {
        env = env.replace(new RegExp(`NEXT_PUBLIC_${field}=.*`), `NEXT_PUBLIC_${field}=${value}`);
      } else {
        env += `\nNEXT_PUBLIC_${field}=${value}`;
      }
    } else {
      env = `NEXT_PUBLIC_${field}=${value}`;
    }
  
    fs.writeFileSync(envPath, env);
    
    // Also update runtime config
    if (field === 'ACCESS_TOKEN') {
        bitrixConfig.accessToken = value;
    } else if (field === 'REFRESH_TOKEN') {
        bitrixConfig.refreshToken = value;
    }
}