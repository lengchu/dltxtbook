
运行环境: python 3.6

库: BeautifulSoup, requests


使用说明:

baseUrl = 'http://www.yangguiweihuo.com' -- 本程序基于此网站, 故此项无须修改
bookIndex = '/10/10006/' -- bookIndex: 欲下载的本网站的book的url 请按需修改

start(baseUrl + bookIndex, 1, 100)
第二和第三个参数是欲下载的章节范围 请按需修改

作者水平有限, 本程序时有部分章节下载失败和一些未知异常, 请勿吐槽
