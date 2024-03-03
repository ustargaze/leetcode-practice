const fs = require('fs')
const path = require('path')
const readline = require('readline')
const dayjs = require('dayjs')
const { getWeeklyContestInfo } = require('./requestUtil')
const { createQuestionMD } = require('./question')

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

    const promises = weeklyContest.questions.map(({ title_slug: titleSlug }) => createQuestionMD(titleSlug))
    await Promise.all(promises)
}
