'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { seedContacts } from '@/utils/seed';
import { Loader } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function TestPage() {
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleSeedData = async () => {
        setLoading(true);
        await seedContacts(count);
        setLoading(false);
        toast.success(`Successfully seeded ${count} records!`, {
            duration: 3000,
            position: 'top-right',
            style: {
                backgroundColor: '#f0f4f8',
                color: '#333',
                border: '1px solid #ccc',
            },
            icon: '✅',
        });
        setCount(0);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <h1>Welcome to the Test Page</h1>
            <Input
                placeholder="Enter number records"
                className="w-64"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
            />
            <Button onClick={handleSeedData} disabled={loading} className="bg-blue-500 text-white hover:bg-blue-600 mt-2">
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Seeding...' : 'Seed Data'}
            </Button>
        </div>
    );
}
