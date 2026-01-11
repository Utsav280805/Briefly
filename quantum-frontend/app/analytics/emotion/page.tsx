"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { Brain, Download, TrendingUp, Smile, Frown, Meh, ArrowLeft, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useSearchParams } from "next/navigation";

const emotionColors = {
    happy: "#10b981",
    neutral: "#6b7280",
    concerned: "#f59e0b",
    frustrated: "#ef4444",
};

interface EmotionTimelinePoint {
    timestamp: string;
    emotion: string;
    intensity: number;
}

function EmotionAnalyticsContent() {
    const searchParams = useSearchParams();
    const platform = searchParams?.get("platform") || "google_meet";
    const meetingId = searchParams?.get("meetingId") || "";
    
    const [engagementScore, setEngagementScore] = useState<number>(7.5);
    const [emotionTimeline, setEmotionTimeline] = useState<EmotionTimelinePoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (meetingId) {
            fetchEmotionData();
        } else {
            // Use default mock data if no meeting ID
            setEmotionTimeline([
                { timestamp: "00:00", emotion: "neutral", intensity: 0.7 },
                { timestamp: "00:15", emotion: "happy", intensity: 0.8 },
                { timestamp: "00:30", emotion: "concerned", intensity: 0.6 },
            ]);
            setLoading(false);
        }
    }, [meetingId, platform]);

    const fetchEmotionData = async () => {
        try {
            setLoading(true);
            const result = await apiClient.getEmotions(platform, meetingId);
            
            if (result.success) {
                setEngagementScore(result.engagement_score || result.overall_score || 7.5);
                setEmotionTimeline(result.timeline || []);
            }
        } catch (error: any) {
            console.error("Failed to fetch emotion data:", error);
            toast.error("Failed to load emotion analysis. Using default data.");
            // Use default data on error
            setEmotionTimeline([
                { timestamp: "00:00", emotion: "neutral", intensity: 0.7 },
                { timestamp: "00:15", emotion: "happy", intensity: 0.8 },
                { timestamp: "00:30", emotion: "concerned", intensity: 0.6 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getEmotionBadgeColor = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case "happy":
                return "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20";
            case "neutral":
                return "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20";
            case "concerned":
                return "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20";
            case "frustrated":
                return "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-500/20";
        }
    };

    // Prepare data for charts
    const emotionDistribution = [
        { name: "Happy", value: 65, color: emotionColors.happy },
        { name: "Neutral", value: 25, color: emotionColors.neutral },
        { name: "Concerned", value: 8, color: emotionColors.concerned },
        { name: "Frustrated", value: 2, color: emotionColors.frustrated },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Quantum
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link href="/meetings/1" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Meetings
                            </Link>
                            <Link href="/bot-manager" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Bot Manager
                            </Link>
                            <Link href="/tasks" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Tasks
                            </Link>
                            <Link href="/calendar" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                                Calendar
                            </Link>
                            <Link href="/analytics/emotion" className="text-sm font-medium text-purple-600">
                                Analytics
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                SC
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <Link href={meetingId ? `/meetings/${meetingId}` : "/dashboard"}>
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>

                {/* Emotion Analysis Card - Matching Image Design */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl">Emotion Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin" />
                                <p>Loading emotion analysis...</p>
                            </div>
                        ) : (
                            <>
                                {/* Overall Meeting Sentiment Section */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Overall meeting sentiment
                                    </h3>
                                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                        {engagementScore.toFixed(1)}/10
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                                </div>

                                {/* Emotion Timeline Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Emotion Timeline
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {emotionTimeline.length > 0 ? (
                                            emotionTimeline.map((point, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-mono">{point.timestamp}</span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getEmotionBadgeColor(point.emotion)}`}
                                                    >
                                                        {point.emotion}
                                                    </Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-mono">00:00</span>
                                                    <Badge variant="outline" className="px-4 py-2 rounded-full text-sm font-medium bg-gray-500/10 text-gray-600 border-gray-500/20">
                                                        Neutral
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-mono">00:15</span>
                                                    <Badge variant="outline" className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/10 text-green-600 border-green-500/20">
                                                        Happy
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground font-mono">00:30</span>
                                                    <Badge variant="outline" className="px-4 py-2 rounded-full text-sm font-medium bg-orange-500/10 text-orange-600 border-orange-500/20">
                                                        Concerned
                                                    </Badge>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* View Full Analysis Button */}
                                <div className="pt-4 border-t">
                                    <Button 
                                        variant="outline" 
                                        className="w-full bg-muted hover:bg-muted/80 text-foreground"
                                        onClick={() => {
                                            // Scroll to detailed view below or navigate to detailed page
                                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                        }}
                                    >
                                        View Full Analysis
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Detailed Analytics Section (shown after clicking "View Full Analysis") */}
                {!loading && (
                    <div className="mt-8 space-y-6">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                                    <Smile className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{engagementScore.toFixed(1)}/10</div>
                                    <Progress value={engagementScore * 10} className="mt-2" />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Positive Moments</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {Math.round((emotionTimeline.filter(e => e.emotion === 'happy').length / Math.max(emotionTimeline.length, 1)) * 100)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Of meeting duration</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Engagement Level</CardTitle>
                                    <Smile className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {engagementScore >= 8 ? 'High' : engagementScore >= 6 ? 'Medium' : 'Low'}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Above average</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Concerns Detected</CardTitle>
                                    <Frown className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {emotionTimeline.filter(e => e.emotion === 'concerned' || e.emotion === 'frustrated').length}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Emotion Timeline Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Emotion Timeline</CardTitle>
                                    <CardDescription>How emotions evolved throughout the meeting</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {emotionTimeline.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={emotionTimeline}>
                                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                                <XAxis dataKey="timestamp" className="text-xs" />
                                                <YAxis domain={[0, 1]} className="text-xs" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: "hsl(var(--background))",
                                                        border: "1px solid hsl(var(--border))",
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="intensity"
                                                    stroke="#9333ea"
                                                    strokeWidth={3}
                                                    dot={{ fill: "#9333ea", r: 4 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                            No timeline data available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Emotion Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Emotion Distribution</CardTitle>
                                    <CardDescription>Overall sentiment breakdown</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={emotionDistribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }) => `${name}: ${value}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {emotionDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EmotionAnalyticsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <EmotionAnalyticsContent />
        </Suspense>
    );
}
