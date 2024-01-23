const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { getQuestion, getQuestionOfToday } = require('./requestUtil')

exports.createQuestionOfTodayMD = async () => {
    const question = await getQuestionOfToday()
    createMarkdownFile(question)
}

exports.createQuestionMD = async () => {
    // 从控制台输入 url，然后根据 url 解析处 titleSlug 去获取题目内容
    const inputInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
    const titleSlug = await new Promise((resolve) => {
        inputInterface.question(`输入需要获取的题目的 url：`, (input) => {
            inputInterface.close()
            const titleSlug = /https:\/\/leetcode\.cn\/problems\/([A-Za-z0-9-]+?)\//.exec(input)[1]
            resolve(titleSlug)
        })
    })

    const question = await getQuestion(titleSlug)
    createMarkdownFile(question)
}

function createMarkdownFile({ id, title, titleSlug, difficulty, tags, content }) {
    const difficultyColor = difficulty === 'Easy' ? 'green' : difficulty === 'Medium' ? 'orange' : 'red'

    // 将 tag 数组拼接成字符串
    const tag = tags.map((tag) => `\`${tag.name}\``).join(' ')

    // 拼接成 markdown 文档的内容
    const markdown = `# ${id}. ${title}

> [${id}. ${title}](https://leetcode.cn/problems/${titleSlug}/)
>
> 难度：<font color=${difficultyColor}>\`${difficulty}\`</font>
>
> 标签：${tag}

## 题目

${content}

--------------------

## 题解

### 方法一：

**思路**



**代码**

\`\`\`java

\`\`\`

**复杂度分析**

- 时间复杂度：$O()$。
- 空间复杂度：$O()$。
`
    title = title.replaceAll(' ', '')
    const filename = `${'0'.repeat(Math.max(4 - id.length, 0)) + id}.${title}.md`
    const numberId = Number.parseInt(id)
    const min = String(Math.floor(numberId / 100) * 100 + 1)
    const max = String((Math.floor(numberId / 100) + 1) * 100)
    const fileDir = path.join(
        process.env.PWD,
        '../',
        `${'0'.repeat(Math.max(4 - min.length, 0)) + min}-${'0'.repeat(Math.max(4 - max.length, 0)) + max}`
    )
    if (!fs.existsSync(path.join(fileDir))) {
        fs.mkdirSync(fileDir)
    }
    const filepath = path.join(fileDir, filename)
    if (fs.existsSync(filepath)) {
        throw new Error(`${filename} 已经存在`)
    }
    fs.writeFileSync(path.join(fileDir, filename), markdown)
    console.log(`${filename} 创建成功`)
}
