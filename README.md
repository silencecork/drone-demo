# drone-demo

範例為Drone 0.8版
Drone CLI為最新版

### 設定Github App
<a href="https://github.com/yeasy/docker_practice/blob/master/cases/ci/drone.md">看教學</a>
若是在本機端，沒有公開的DNS，可以使用<a href="https://qiita.com/kitaro729/items/44214f9f81d3ebda58bd">ngrok</a>

### 啟動Drone Server (使用docker-compose up啟動)

<pre><code>
version: '2'

services:
  drone-server:
    image: drone/drone:0.8

    ports:
      - 8080:8000
      - 9000
    volumes:
      - drone-server-data:/var/lib/drone/
    restart: always
    environment:
      - DRONE_OPEN=true
      - DRONE_HOST=${DRONE_HOST}
      - DRONE_ADMIN=${DRONE_ADMIN}
      - DRONE_GITHUB=true
      - DRONE_GITHUB_CLIENT=${DRONE_GITHUB_CLIENT}
      - DRONE_GITHUB_SECRET=${DRONE_GITHUB_SECRET}
      - DRONE_SECRET=${DRONE_SECRET}

  drone-agent:
    image: drone/agent:0.8

    command: agent
    restart: always
    depends_on:
      - drone-server
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_SERVER=drone-server:9000
      - DRONE_SECRET=${DRONE_SECRET}

volumes:
  drone-server-data:
  
</code></pre>

### 本機端測試
安裝<a href="https://docs.drone.io/cli/install/">Drone CLI</a>
<a href="https://docs.drone.io/cli/">CLI Reference</a>
在專案下執行
<pre><code>drone exec \
--branch [branch_name] \
--event [event_name] \
--secret-file [sec_file] \
--env-file [env_file] \
--trusted </code></pre>
簡單說明如下：

* --branch 模擬commit到專案的特定branch
* --event 模擬commit的事件，可以是push, pull_request, tag
* --secret-file secret的檔案，指定路徑，格式如下 (小寫即可)

> key_path=xxxxx
>
> user_name=xxxxx
>
> slack_webhook=xxxxx

* --env-file 環境變數檔案，指定路徑，格式如下 (大寫)
> ENV1=xxxxx
>
> ENV2=xxxxxx

* --trusted 如果.drone.yml中有某個step需要掛載主機的資料夾，就需要這項指令

### drone.yml pipeline

#### 第一步：安裝並測試
<pre><code>
install:
  image: node:10.15
  commands:
    - node -v
    - npm -v
    - npm install
    - npm install -g mocha
    - mocha test/api.js
  when:
    branch: master
</code></pre>
以跟主機相同的node環境的docker進行安裝，並使用<a href="https://mochajs.org">mocha</a> 做測試

#### 第二步：編譯docker image
使用<a href="https://github.com/drone-plugins/drone-docker">plugin/docker</a>
<p>簡單說明如下：</p>

*  repo：要上傳docker image的位置
*  username：登入docker image repo的帳號
    *  對應secret：docker_username
*  password：登入docker image repo的密碼
    *  對應secret：docker_password
*  dockerfile：要編譯image使用的Dockerfile路徑，e.g. docker-files/Dockerfile


#### 第三步：SCP檔案到遠端
使用<a href="https://github.com/appleboy/drone-scp">appleboy/drone-scp</a><br>
<br>登入用username需要從secret mapping到scp_username
<br>ssh key要mapping到scp_key_path，且記得路徑指的是在drone-scp這docker中的路徑，且這key要使用不用輸入passphrase的
<pre>
目前的ssh key要更改passphrase指令
<code>ssh-keygen -p -f ~/.ssh/id_dsa</code>
</pre>

#### 第四步：登入遠端主機進行設定
使用<a href="https://github.com/appleboy/drone-ssh">appleboy/drone-ssh</a><br>
<br>ssh key需要從secret mapping到ssh_key_path

#### 第五步：通知結果
使用<a href="https://github.com/drone-plugins/drone-slack">plugins/slack</a><br>
<br>通知slack的位置可以使用secret - slack_webhook or webhook
