# coding: utf-8
from bs4 import BeautifulSoup
import requests
import codecs

baseUrl = 'http://www.yangguiweihuo.com'
bookIndex = '/10/10006/'


def gethtml(url):
    r = requests.get(url)
    r.encoding = 'GBK'
    htm = r.text
    return BeautifulSoup(htm, 'lxml')


def get_chapter_list(htm):
    chapter_list_div = htm.find_all('div', class_='article_texttitleb')[0]
    chapter_a = chapter_list_div.find_all('a')
    return chapter_a


def get_chapter_content(chapter_url):
    r = requests.get(chapter_url)
    bindata = r.content
    htm = bindata.decode("GBK")
    book = BeautifulSoup(htm, 'lxml').find('div', class_='book_content_text')
    # print(book.find('h1').get_text())
    return book.find('div', id='book_text').get_text()


def write_to_file(title, content, file):
    file.write(title)
    file.write('\n')
    file.write(content)
    file.write('\n\n\n')
    print(title + ' save success')


def start(url, from_chapter, to_chapter):
    htm = gethtml(url)
    ls = get_chapter_list(htm)
    f = codecs.open('1.txt', 'a+', 'UTF-8')
    err_log = codecs.open('errlog.txt', 'a+', 'UTF-8')
    print(ls)
    failed = []
    i = 0
    for l in ls:
        if i in range(from_chapter - 1, to_chapter):
            try:
                title = l.get_text()
                content = get_chapter_content(baseUrl + l['href'])
                write_to_file(title, content, f)
            except (AttributeError, Exception):
                print(title + ' save failed')
                err_log.write(title)
                err_log.write('\n')
                failed.append(title)
                err_log.flush()
                f.flush()
        i = i + 1
    f.flush()
    print(len(failed) + ' chapters save failed: ')
    for chap in failed:
        print('\t' + chap)


if __name__ == '__main__':
    start(baseUrl + bookIndex, 1, 100)

