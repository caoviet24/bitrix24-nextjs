'use client';

import React, { useEffect, useLayoutEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { writeToEnv } from '@/utils/writeToEnv';
import { useQuery } from '@tanstack/react-query';
import bitrixConfig from '@/configs/bitrixConfig';
import { authService } from '../services/auth-service';

function CallBackContent() {
    const searchParams = useSearchParams();
    const [couter, setCouter] = useState(5);
    const [hasFetched, setHasFetched] = useState(false);
    const router = useRouter();

    const { data, isLoading, error, isSuccess, isError } = useQuery({
        queryKey: ['callback', searchParams.get('code')],
        queryFn: () =>
            authService.OAuthCallback({
                code: searchParams.get('code') || '',
                client_id: bitrixConfig.clientId,
                client_secret: bitrixConfig.clientSecret,
            }),
        enabled: !!searchParams.get('code') && !!bitrixConfig.clientId && !!bitrixConfig.clientSecret && !hasFetched,
    });

    useLayoutEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (isSuccess) {
            timer = setTimeout(() => {
                setCouter((prevCouter) => prevCouter - 1);
            }, 1000);
        }

        if (couter === 1) {
            router.push('/');
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [couter, isSuccess, router]);

    useEffect(() => {
        if (isSuccess && data) {
            setHasFetched(true);
            (async () => {
                await writeToEnv({
                    field: 'ACCESS_TOKEN',
                    value: data.access_token,
                });
                await writeToEnv({
                    field: 'REFRESH_TOKEN',
                    value: data.refresh_token,
                });
            })();
        }
    }, [data, isSuccess]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý xác thực</h2>
                    <p className="text-gray-600">Vui lòng chờ trong khi chúng tôi hoàn tất kết nối Bitrix24 của bạn...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi xác thực</h1>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-green-600 mb-4">Xác thực thành công</h1>

                <p className="text-gray-600 mb-6">
                    Tài khoản Bitrix24 của bạn đã được kết nối thành công với ứng dụng.
                </p>

                {couter > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Tự động chuyển trang sau:</p>
                        <div className="text-2xl font-bold text-blue-600">{couter}</div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${((5 - couter) / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Quay lại trang chủ
                </button>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang tải...</h2>
                <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
        </div>
    );
}

export default function CallBackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CallBackContent />
        </Suspense>
    );
}
