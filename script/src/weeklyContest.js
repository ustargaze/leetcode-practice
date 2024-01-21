const html2md = require('html-to-md')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const dayjs = require('dayjs')
const { getQuestion, getWeeklyContestInfo } = require('./requestUtil')

exports.createWeeklyContentMD = async () => {
    // 从控制台输入 url，然后根据 url 解析处 titleSlug 去获取题目内容
    const inputInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
    const weeklyContestSlug = await new Promise((resolve) => {
        inputInterface.question(`输入需要获取的周赛的 url：`, (input) => {
            inputInterface.close()
            const weeklyContestSlug = /https:\/\/leetcode\.cn\/contest\/([A-Za-z0-9-]+?)\//.exec(input)[1]
            resolve(weeklyContestSlug)
        })
    })

    const weeklyContest = await getWeeklyContestInfo(weeklyContestSlug)
    const contest = weeklyContest.contest
    createMarkdownFile(contest.title, contest.title_slug, contest.start_time, weeklyContest.questions)
}

function createMarkdownFile(title, titleSlug, startTime, questions) {
    const formatStartTime = dayjs(startTime * 1000).format('YYYY-MM-DD')
    const markdown = `# ${title} (${formatStartTime})

> https://leetcode.cn/contest/${titleSlug}/

${questions
    .map(
        ({ title, title_slug: titleSlug }) => `## [${title}](https://leetcode.cn/problems/${titleSlug}/)
#### 方法一：

**思路**


**代码**

\`\`\`java

\`\`\`

**复杂度分析**

- 时间复杂度：$O()$。
- 空间复杂度：$O()$。
`
    )
    .join('\n\n--------------------\n\n')}
`
    title = title.replaceAll(' ', '')
    const filename = `${formatStartTime}.${title}.md`
    const fileDir = path.join(process.env.PWD, '../', `weekly-contest`)
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
