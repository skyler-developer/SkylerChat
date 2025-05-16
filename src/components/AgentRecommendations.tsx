import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";

interface AgentRecommendationsProps {
    userName: string;
    currentAgentName?: string;
}

export const AgentRecommendations: React.FC<AgentRecommendationsProps> = ({
    userName,
    currentAgentName,
}) => {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/intelligentAgent/recommend", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userName, currentAgentName }),
                });
                const result = await response.json();
                if (result.success) {
                    setRecommendations(result.data);
                } else {
                    setError(result.message || "获取推荐失败");
                }
            } catch (err) {
                setError("请求推荐时出错");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, [userName, currentAgentName]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    if (recommendations.length === 0) {
        return (
            <Typography align="center" color="textSecondary">
                No recommendations available
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Recommended Agents
            </Typography>
            {recommendations.map((recommendation) => (
                <Card key={recommendation.intelligentAgentName} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{recommendation.intelligentAgentName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {recommendation.reason}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};
