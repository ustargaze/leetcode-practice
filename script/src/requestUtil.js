const axios = require('axios')

const headers = {
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Connection: 'keep-alive',
    Origin: 'https://leetcode.cn',
    Referer: 'https://leetcode.cn/',
    'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'content-type': 'application/json'
}

const graphqlQuestionQuery = `{
  id: questionFrontendId
  difficulty
  title: translatedTitle
  content: translatedContent
  titleSlug
  tags: topicTags {
    name: translatedName
  }
}`

function graphqlRequest(data) {
    return axios.request({
        data,
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://leetcode.cn/graphql/',
        headers
    })
}

/**
 * 通过 leetcode 的接口获取每日一题的题目信息
 * 题目信息包括 id（前端显示的id）、title（题目中文标题）、slug（题目的唯一表示？）、difficulty（难度）、tags（标签列表）、content（题目的内容）
 */
exports.getQuestionOfToday = () => {
    const operation = 'questionOfToday'
    const graphqlQuery = `query ${operation} {
  todayRecord {
    question ${graphqlQuestionQuery}
  }
}`
    const data = { query: graphqlQuery, variables: {}, operationName: operation }
    return graphqlRequest(data).then((response) => response.data.data.todayRecord[0].question)
}

/**
 * 通过 leetcode 的接口获取 titleSlug 指定的题目信息
 * 题目信息包括 id（前端显示的id）、title（题目中文标题）、titleSlug（题目的唯一表示？）、difficulty（难度）、tags（标签列表）、content（题目的内容）
 */
exports.getQuestion = (titleSlug) => {
    const operation = 'question'
    const graphqlQuery = `query ${operation}($titleSlug: String!) {
  question(titleSlug: $titleSlug) ${graphqlQuestionQuery}
}`
    const data = { query: graphqlQuery, variables: {  titleSlug }, operationName: operation }
    return graphqlRequest(data).then((response) => response.data.data.question)
}

exports.getWeeklyContestInfo = (weeklyContestSlug) => {
    return axios
        .request({
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://leetcode.cn/contest/api/info/${weeklyContestSlug}`,
            headers
        })
        .then((response) => response.data)
}
