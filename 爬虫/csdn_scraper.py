import requests
import json
from datetime import datetime
import time

def scrape_csdn_blogs():
    # 用户名
    username = 'weixin_44231148'
    # API URL
    base_url = f'https://blog.csdn.net/community/home-api/v1/get-business-list'
    
    try:
        articles = []
        page = 1
        
        print("开始获取文章列表...")
        
        while True:
            # 构造请求参数
            params = {
                'page': page,
                'size': 20,
                'businessType': 'blog',
                'orderby': 'create',
                'noMore': 'false',
                'username': username
            }
            
            # 发送请求
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': f'https://blog.csdn.net/{username}',
                'Origin': 'https://blog.csdn.net'
            }
            
            try:
                response = requests.get(base_url, params=params, headers=headers)
                print(f"请求状态码: {response.status_code}")
                
                # 检查响应状态码
                if response.status_code != 200:
                    print(f"请求失败，状态码: {response.status_code}")
                    print(f"响应内容: {response.text[:200]}")
                    break
                
                # 尝试解析JSON
                try:
                    data = response.json()
                except json.JSONDecodeError as je:
                    print(f"JSON解析错误: {je}")
                    print(f"响应内容: {response.text[:200]}")
                    break
                
                # 检查数据结构
                if 'data' not in data or 'list' not in data['data']:
                    print("响应数据结构不正确")
                    print(f"响应内容: {json.dumps(data, ensure_ascii=False)[:200]}")
                    break
                
                # 检查是否有数据
                if not data['data']['list']:
                    print("没有更多文章了")
                    break
                
                articles.extend(data['data']['list'])
                print(f"已获取第 {page} 页的文章，本页文章数：{len(data['data']['list'])}")
                page += 1
                
                # 添加延时，避免请求过快
                time.sleep(1)
                
            except requests.exceptions.RequestException as e:
                print(f"请求异常: {e}")
                break
        
        if not articles:
            print("未获取到任何文章")
            return
            
        # 写入文件
        with open('csdn_blogs.txt', 'w', encoding='utf-8') as f:
            # 写入标题
            f.write("CSDN博客文章列表 - {}\n".format(username))
            f.write("=" * 60 + "\n\n")
            
            # 写入统计信息
            f.write(f"总文章数：{len(articles)}\n")
            f.write(f"统计时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("-" * 60 + "\n\n")
            
            # 遍历并写入每篇文章的信息
            for idx, article in enumerate(articles, 1):
                title = article.get('title', '无标题')
                # 修改：尝试多个可能的时间字段
                create_time = article.get('postTime') or article.get('createTime') or article.get('created_time') or '未知时间'
                views = article.get('viewCount', 0)
                likes = article.get('diggCount', 0)
                comment_count = article.get('commentCount', 0)
                article_url = article.get('url', '')
                
                # 格式化时间 - 增加调试信息
                try:
                    if isinstance(create_time, str) and create_time.isdigit():
                        create_time = datetime.fromtimestamp(int(create_time)/1000).strftime('%Y-%m-%d %H:%M:%S')
                    elif isinstance(create_time, int):
                        create_time = datetime.fromtimestamp(create_time/1000).strftime('%Y-%m-%d %H:%M:%S')
                    else:
                        print(f"文章 {idx} 的时间格式异常: {create_time}")
                except Exception as e:
                    print(f"处理文章 {idx} 的时间时出错: {e}, 原始时间值: {create_time}")
                    create_time = '未知时间'
                
                # 写入文章信息
                f.write(f"文章 {idx}\n")
                f.write(f"标题：{title}\n")
                f.write(f"发布时间：{create_time}\n")
                f.write(f"阅读量：{views}\n")
                f.write(f"点赞数：{likes}\n")
                f.write(f"评论数：{comment_count}\n")
                f.write(f"文章链接：{article_url}\n")
                f.write("-" * 40 + "\n\n")
            
        print(f"成功抓取 {len(articles)} 篇文章信息，已保存到 csdn_blogs.txt")
        
    except Exception as e:
        print(f"发生错误: {str(e)}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    scrape_csdn_blogs() 