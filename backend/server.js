// server.js - 英语六级词汇服务器 (精简稳定版)
console.log('🔧 开始启动服务器...');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // 默认使用3000端口

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON数据

// ========== 核心数据 ==========
const vocabulary = [
    { id: 1, word: "abandon", phonetic: "/əˈbændən/", meaning: "放弃，遗弃", difficulty: "easy" },
    { id: 2, word: "accommodate", phonetic: "/əˈkɒmədeɪt/", meaning: "容纳，提供住宿", difficulty: "medium" },
    { id: 3, word: "benevolent", phonetic: "/bəˈnevələnt/", meaning: "仁慈的，慈善的", difficulty: "hard" },
    { id: 4, word: "conscientious", phonetic: "/ˌkɒnʃiˈenʃəs/", meaning: "认真的，尽责的", difficulty: "medium" },
    { id: 5, word: "dilemma", phonetic: "/dɪˈlemə/", meaning: "困境，进退两难", difficulty: "easy" }
];

// ========== API接口 ==========
// 测试接口
app.get('/api/hello', (req, res) => {
    res.json({ message: '🎉 后端服务器连接成功！', timestamp: new Date() });
});

// 获取所有词汇
app.get('/api/words', (req, res) => {
    res.json({ success: true, data: vocabulary, count: vocabulary.length });
});

// 根据ID获取单词
app.get('/api/words/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const word = vocabulary.find(w => w.id === id);
    if (word) {
        res.json({ success: true, data: word });
    } else {
        res.status(404).json({ success: false, message: '单词未找到' });
    }
});

// 提交答案
app.post('/api/submit', (req, res) => {
    const { wordId, userAnswer } = req.body;
    const word = vocabulary.find(w => w.id === wordId);
    
    if (!word) {
        return res.json({ success: false, message: '单词不存在' });
    }
    
    // 简单判断：用户输入是否与单词匹配（实际应更复杂）
    const isCorrect = userAnswer && userAnswer.toLowerCase() === word.word.toLowerCase();
    
    res.json({
        success: true,
        correct: isCorrect,
        correctWord: word.word,
        correctMeaning: word.meaning
    });
});

// ========== 静态文件服务 (用于部署后) ==========
// 这一行先注释掉，本地开发时不用
app.use(express.static('../frontend'));

// ========== 启动服务器 ==========
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ ========================================`);
    console.log(`✅ 服务器启动成功！`);
    console.log(`✅ 本地访问: http://localhost:${PORT}`);
    console.log(`✅ 测试接口: http://localhost:${PORT}/api/hello`);
    console.log(`✅ 词汇接口: http://localhost:${PORT}/api/words`);
    console.log(`✅ ========================================\n`);
});

// 全局错误捕获
process.on('uncaughtException', (err) => {
    console.error('❌ 捕获到未处理的异常:', err);
});