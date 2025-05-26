// 使用langchain.js框架，实现RAG的chain
// 使用本地ollama创建的deepseek R1:7b模型

import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { readFileSync } from "fs";
import { join } from "path";

// 初始化 Ollama 模型
const model = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "deepseek-r1",
});

// 初始化文本分割器，针对 markdown 文档优化
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 300,
    separators: ["\n## ", "\n### ", "\n#### ", "\n", " ", ""], // 优先按 markdown 标题分割
    keepSeparator: true, // 保留分隔符，这样标题会保留在内容中
});

// 初始化向量存储
const vectorStore = new MemoryVectorStore(
    new OllamaEmbeddings({
        baseUrl: "http://localhost:11434",
        model: "deepseek-r1",
    }),
);

// 创建 RAG 提示模板
const promptTemplate = PromptTemplate.fromTemplate(`
你是一个智能助手，请根据以下上下文信息来回答问题。特别注意文档中的时间、日期等具体信息。
如果上下文中没有相关信息，请直接说明无法回答。

上下文信息：
{context}

问题：{question}

请特别注意：
1. 仔细查找文档中的时间、日期信息
2. 如果找到具体时间，请直接引用原文
3. 如果信息不完整，请明确指出
`);

// 创建 RAG 链
export const ragChain = RunnableSequence.from([
    {
        context: async (input: { question: string }) => {
            // 添加时间相关的关键词
            const timeKeywords = ["年", "月", "日", "成立", "创建", "建立"];

            // 根据问题检索相关文档
            const results = await vectorStore.similaritySearch(input.question, 12);

            // 优先选择包含时间信息的文档块
            const timeRelevantResults = results.filter((doc) =>
                timeKeywords.some((keyword) => doc.pageContent.includes(keyword)),
            );

            // 如果找到包含时间信息的文档块，优先使用它们
            const selectedResults = timeRelevantResults.length > 0 ? timeRelevantResults : results;

            // 将检索到的文档合并为上下文
            return selectedResults.map((doc) => doc.pageContent).join("\n\n");
        },
        question: (input: { question: string }) => input.question,
    },
    promptTemplate,
    model,
    new StringOutputParser(),
]);

// 处理文档并创建 RAG 链
export async function createRagChain(documents: Document | Document[]) {
    try {
        // 确保 documents 是数组
        const docsArray = Array.isArray(documents) ? documents : [documents];

        // 预处理文档
        const processedDocs = await textSplitter.splitDocuments(docsArray);
        // 将文档添加到向量存储
        await vectorStore.addDocuments(processedDocs);

        return ragChain;
    } catch (error) {
        console.error("文档处理出错:", error);
        throw error;
    }
}

// 使用 RAG 链回答问题
export async function answerWithRag(question: string, documents: Document | Document[]) {
    try {
        const chain = await createRagChain(documents);
        const response = await chain.invoke({
            question,
        });
        return response;
    } catch (error) {
        console.error("RAG 处理出错:", error);
        throw error;
    }
}

// 加载 markdown 文件并转换为 Document
export function loadMarkdownDocument(filePath: string): Document {
    try {
        // 读取文件内容
        const content = readFileSync(filePath, "utf-8");
        // 创建 Document 对象
        return new Document({
            pageContent: content,
            metadata: {
                source: filePath,
                type: "markdown",
            },
        });
    } catch (error) {
        console.error(`读取文件失败: ${filePath}`, error);
        throw error;
    }
}

const markdownPath = join(process.cwd(), "public", "RagInfo.md");
// const chain = await loadAndProcessMarkdown(markdownPath);

// 使用 RAG 链回答问题（流式输出）
export async function loadAndProcessMarkdown(question: string) {
    try {
        // 加载 markdown 文档
        const document = loadMarkdownDocument(markdownPath);
        // 创建 RAG 链
        const chain = await createRagChain(document);

        // 使用流式输出
        const stream = await chain.stream({
            question,
        });

        return stream;
    } catch (error) {
        console.error("处理 markdown 文件失败:", error);
        throw error;
    }
}
