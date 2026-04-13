'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion";
import Image from 'next/image';
import { toast } from 'sonner';

export default function FindGymPage() {
    const [city, setCity] = useState('');
    const [budget, setBudget] = useState('');
    const [goal, setGoal] = useState('');
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const findGyms = async () => {
        setLoading(true);
        setGyms([]);

        try {
            const res = await fetch('/api/find-gym', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city, budget, goal })
            });

            const data = await res.json();
            setGyms(data.gyms || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openInMaps = (query: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <h1 className="text-3xl font-bold flex items-center gap-2">
                🏋️ AI Gym Finder
            </h1>

            {/* FORM */}
            <Card>
                <CardHeader>
                    <CardTitle>Find Your Gym</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Input
                        placeholder="City (e.g. Bangalore)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />

                    <Input
                        placeholder="Budget ₹ (optional)"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />

                    <Input
                        placeholder="Goal (fat loss, muscle gain)"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />

                    <Button className="w-full" onClick={findGyms}>
                        {loading ? 'Finding gyms...' : 'Find Gyms'}
                    </Button>

                </CardContent>
            </Card>

            {/* LOADING */}
            {loading && (
                <div className="text-center text-gray-500">
                    🤖 AI is finding best gyms for you...
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && gyms.length === 0 && (
                <div className="text-center text-gray-400">
                    No gyms yet. Try searching 👆
                </div>
            )}

            {/* RESULTS */}
            <div className="grid gap-6">

                {gyms.map((gym, i) => (
                    <Card
                        key={i}
                        className={`shadow-md ${i === 0 ? 'border-2 border-green-500' : ''
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {gym.name}

                                {i === 0 && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        ⭐ Best Match
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 text-sm">

                            {/* 📍 INFO */}
                            <div className="space-y-1">
                                <p>📍 {gym.location}</p>
                                <p>💰 {gym.price}</p>
                                <p>⏰ Best Time: {gym.bestTime}</p>
                                <p className="text-gray-600">💡 {gym.reason}</p>
                            </div>

                            {/* 🖼️ IMAGES */}
                            {/* {gym.image && (
                                <div className="flex gap-2 overflow-x-auto">
                                    <img
                                        src={gym.image}
                                        alt="gym"
                                        className="w-40 h-28 object-cover rounded"
                                    />
                                </div>
                            )} */}

                            {/* ⭐ REVIEWS */}
                            {gym.reviews?.length > 0 && (
                                <Accordion >
                                    <AccordionItem value="reviews">
                                        <AccordionTrigger>
                                            View Reviews
                                        </AccordionTrigger>

                                        <AccordionContent>
                                            {gym.reviews.map((review: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="border rounded p-2 mb-2"
                                                >
                                                    <p className="font-medium">
                                                        {review.user} ⭐ {review.rating}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}

                            {/* 🔘 ACTIONS */}
                            <div className="flex gap-2 pt-2 flex-wrap">

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        openInMaps(
                                            gym.mapsQuery ||
                                            `${gym.name} ${gym.location} ${city}`
                                        )
                                    }
                                >
                                    📍 Locate Me
                                </Button>

                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(gym.name);
                                        toast.success('Gym name copied to clipboard!');
                                    }}
                                >
                                    Copy Name
                                </Button>

                            </div>

                        </CardContent>
                    </Card>
                ))}

            </div>
        </div>
    );
}