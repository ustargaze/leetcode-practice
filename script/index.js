const { createQuestionOfTodayMD, createQuestionMD } = require('./src/question')
const { createWeeklyContentMD } = require('./src/weeklyContest')

console.time('run')
run().finally(() => {
    console.timeEnd('run')
})

async function run() {
    const arg = process.argv[2]
    switch (arg) {
        case 'question':
            await createQuestionMD()
            break
        case 'questionOfToday':
            await createQuestionOfTodayMD()
            break
        case 'weeklyContest':
            await createWeeklyContentMD()
            break
        default:
            throw new Error('invalid input argument')
    }
}
