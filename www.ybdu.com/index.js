const axios = require('axios').default
const cheer = require('cheerio')
const gbk   = require('gbk')
const fs    = require('fs')
const jf    = require('jsonfile')

const baseurl = 'https://www.ybdu.com/xiaoshuo/19/19959/'

// saveChaptersAsJsonFile(baseurl)  // Step 1
// startFromNet()                   // Step 2
// mergeFromCache()                 // Step 3

/**
 * 从网上获取数据，并缓存到文件
 */
async function startFromNet() {
    let val = await readChaptersFromJsonFile()
    for(let i = 0; i < val.length; i++) {
        let v = val[i]
        if(v.index % 10 === 0) await sleep(3000)
        getchapterdetails(v.title, v.href, v.index)
    }
}

/**
 * 从缓存文件读取数据，并合并成一个文件
 */
async function mergeFromCache() {
    let val = await readChaptersFromJsonFile()
    for(let i = 0; i < val.length; i++) {
        let v = val[i]
        let data = '\n\n\n\n\n' + v.title + '\n\n' + fs.readFileSync(`./cache/${v.index}`)
        fs.writeFileSync('data.txt', data, {flag: 'a+'})
    }
}

async function getchapterdetails(title, href, index) {
    getDataAsCheer(baseurl + href).then(val => {
        let $ = val.data
        let content = ""
        $('#htmlContent')[0].children.forEach(element => {
            if(element.type === 'text')
                content = content + element.data
        });
        fs.writeFile(`./cache/${index}`, content, {flag: 'w'}, 
            (err) => fs.writeFile('err.log', err,()=>{}))
        console.log(index)
    })
}

/**
 * 从保存的json文件中读取数据
 */
async function readChaptersFromJsonFile() {
    return new Promise((resolve, reject) => {
        jf.readFile('chapters.json', (err, obj) => {
            if(err) reject(err)
            resolve(obj)
        })
    })
}

/** 
 * 保存章节到json文件
 */
async function saveChaptersAsJsonFile(url) {
    let chapters = await getchapters(url)
    let jsondata = []
    for(let i = 0; i < chapters.length; i++)
        jsondata.push({
            index: i + 1,
            title: chapters[i].children[0].data,
            href: chapters[i].attribs.href
        })

    jf.writeFile('chapters.json', jsondata)
}

/**
 * 获取章节元素数组 <a ...>
 */
async function getchapters(url) {
    return getDataAsCheer(url).then(val => {
        let $ = val.data
        return $('.mulu_list li a')
    })
}

/**
 * 获取指定网址的内容，并用cheerio转换为jQuery对象
 */
async function getDataAsCheer(url) {
    return axios.get(url, {
        transformResponse: [
            (data) => {
                return gbk.toString('utf-8', data)
            }, 
            (data) => {
                return cheer.load(data)
            }
        ],
        responseType: 'arraybuffer'
    })
}

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(time)
        }, time);
    })
}
