// 使用langchain.js框架，实现RAG的chain
// 使用本地ollama创建的deepseek R1:7b模型

import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

// 初始化 Ollama 模型
const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "deepseek-r1",
});

// 初始化文本分割器
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
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
你是一个智能助手，请根据以下上下文信息来回答问题。如果上下文中没有相关信息，请直接说明无法回答。

上下文信息：
{context}

问题：{question}

请用中文回答，并采用markdown格式输出。为了良好的阅读体验，回答内容尽量采用结构化的方式输出，使用标题、列表等格式化内容。
`);

// 创建 RAG 链
export const ragChain = RunnableSequence.from([
    {
        context: async (input: { question: string; documents: Document[] }) => {
            // 将文档分割成小块
            const docs = await textSplitter.splitDocuments(input.documents);

            // 将文档添加到向量存储
            await vectorStore.addDocuments(docs);

            // 根据问题检索相关文档
            const results = await vectorStore.similaritySearch(input.question, 3);

            // 将检索到的文档合并为上下文
            return results.map((doc) => doc.pageContent).join("\n\n");
        },
        question: (input: { question: string; documents: Document[] }) => input.question,
    },
    promptTemplate,
    model,
    new StringOutputParser(),
]);

// 处理文档并创建 RAG 链
export async function createRagChain(documents: Document[]) {
    return ragChain;
}

// 使用 RAG 链回答问题
export async function answerWithRag(question: string, documents: Document[]) {
    try {
        const chain = await createRagChain(documents);
        const response = await chain.invoke({
            question,
            documents,
        });
        return response;
    } catch (error) {
        console.error("RAG 处理出错:", error);
        throw error;
    }
}
