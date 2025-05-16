import { NextRequest, NextResponse } from "next/server";
import { db } from "../../userInfo/router";

// 计算用户相似度
const calculateUserSimilarity = (user1Behaviors: any[], user2Behaviors: any[]): number => {
    const user1Agents = new Set(user1Behaviors.map((b) => b.intelligentAgentName));
    const user2Agents = new Set(user2Behaviors.map((b) => b.intelligentAgentName));
    const intersection = new Set([...user1Agents].filter((x) => user2Agents.has(x)));
    const union = new Set([...user1Agents, ...user2Agents]);
    return union.size === 0 ? 0 : intersection.size / union.size;
};

// 获取相似用户
const getSimilarUsers = (
    userName: string,
    allBehaviors: any[],
): { userName: string; similarity: number }[] => {
    const currentUserBehaviors = allBehaviors.filter((b) => b.user_name === userName);
    const userGroups = allBehaviors
        .filter((b) => b.user_name !== userName)
        .reduce((acc, behavior) => {
            if (!acc[behavior.user_name]) {
                acc[behavior.user_name] = [];
            }
            acc[behavior.user_name].push(behavior);
            return acc;
        }, {} as Record<string, any[]>);
    const similarities = Object.entries(userGroups).map(([otherUserName, behaviors]) => ({
        userName: otherUserName,
        similarity: calculateUserSimilarity(currentUserBehaviors, behaviors as any[]),
    }));
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
};

// 获取用户行为记录
const getUserBehaviors = async (userName: string): Promise<any[]> => {
    const [rows] = await db.query(
        `SELECT * FROM user_behavior 
     WHERE user_name = ? 
     OR user_name IN (
       SELECT user_name 
       FROM user_behavior 
       GROUP BY user_name 
       HAVING COUNT(*) > 5
     )`,
        [userName],
    );
    return rows as any[];
};

// 时间衰减因子
const calculateTimeDecay = (lastUsed: Date): number => {
    const now = new Date();
    const daysDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
    return Math.exp(-0.1 * daysDiff);
};

// 推荐主逻辑
const getRecommendations = async (userName: string, currentAgentName?: string): Promise<any[]> => {
    // 获取所有智能体
    const [agents] = await db.query(
        "SELECT intelligentAgentName, agentData FROM intelligentagentinfo",
    );
    // 获取用户行为记录
    const allBehaviors = await getUserBehaviors(userName);
    console.log("User behaviors:", allBehaviors);
    // 获取相似用户
    const similarUsers = getSimilarUsers(userName, allBehaviors);
    // 计算推荐分数
    const recommendations = (agents as any[])
        .filter((agent) => agent.intelligentAgentName !== currentAgentName)
        .map((agent) => {
            let score = 0;
            let reason = "";
            // 基于用户历史行为的分数（加时间衰减）
            const userAgentBehaviors = allBehaviors.filter(
                (b) =>
                    b.user_name === userName &&
                    b.intelligent_agent_name === agent.intelligentAgentName,
            );
            if (userAgentBehaviors.length > 0) {
                const behaviorScore = userAgentBehaviors.reduce((sum: number, behavior: any) => {
                    const decay = calculateTimeDecay(new Date(behavior.created_at));
                    let baseScore = 0;
                    switch (behavior.interaction_type) {
                        case "view":
                            baseScore = 0.3;
                            break;
                        case "use":
                            baseScore = 0.6;
                            break;
                        case "complete":
                            baseScore = 1.0;
                            break;
                        default:
                            baseScore = 0;
                    }
                    return sum + baseScore * decay;
                }, 0);
                score += behaviorScore;
                reason = "Based on your usage history";
            }
            // 基于相似用户的分数（加时间衰减）
            const similarUserScore = similarUsers.reduce((total: number, similarUser) => {
                const similarUserBehaviors = allBehaviors.filter(
                    (b) =>
                        b.user_name === similarUser.userName &&
                        b.intelligent_agent_name === agent.intelligentAgentName,
                );
                if (similarUserBehaviors.length > 0) {
                    const interactionScore = similarUserBehaviors.reduce(
                        (sum: number, behavior: any) => {
                            const decay = calculateTimeDecay(new Date(behavior.created_at));
                            let baseScore = 0;
                            switch (behavior.interaction_type) {
                                case "view":
                                    baseScore = 0.3;
                                    break;
                                case "use":
                                    baseScore = 0.6;
                                    break;
                                case "complete":
                                    baseScore = 1.0;
                                    break;
                                default:
                                    baseScore = 0;
                            }
                            return sum + baseScore * decay;
                        },
                        0,
                    );
                    return total + interactionScore * similarUser.similarity;
                }
                return total;
            }, 0);
            if (similarUserScore > 0) {
                score += similarUserScore;
                reason = "Popular among similar users";
            }
            return {
                intelligentAgentName: agent.intelligentAgentName,
                score,
                reason,
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    return recommendations;
};

export async function POST(request: NextRequest) {
    try {
        const { userName, currentAgentName } = await request.json();
        if (!userName) {
            return NextResponse.json(
                { success: false, message: "userName为必填项" },
                { status: 400 },
            );
        }
        const recommendations = await getRecommendations(userName, currentAgentName);
        return NextResponse.json({ success: true, data: recommendations }, { status: 200 });
    } catch (error) {
        console.error("获取推荐时出错:", error);
        return NextResponse.json(
            {
                success: false,
                message: "获取推荐失败",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 },
        );
    }
}
