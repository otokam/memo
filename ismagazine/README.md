# Watson Natural Language Classifierとは
Watson Natural Language Classifier（以下、NLC）は、Watsonが提供するAPIのひとつで、自然言語で記述された文章が、どういったClass（分類）に属する文章であるかを判別するClassifier（分類器）です。

「文章が分類に所属するか判別する」とは、「今日は暑い」という文章に対し、「Summer」という分類の文章であるという判別を行うように、直接的な単語を含まなくても、その内容から分類を判別することができます。

NLCは学習と問い合わせのAPIを提供しており、開発者は目的に合わせた分類器の教育を行い、それに基づいた問い合わせを行うことが可能です。

# システム構成
今回はBluemix上にWatsonのインスタンスを生成し、LinuxのシェルからREST APIを呼び出して
分類器を教育する方法と、教育された分類器を利用する方法を紹介します。

JavaやNode.jsなどプログラミング言語からNLCを利用する場合、IBMが提供しているWatson SDKを利用するか、各言語でREST APIを呼び出すことでNLCを利用することが可能です。

# Bluemixのインスタンス作成
まず、BluemixにNLCのインスタンスを作成します。Bluemixにログインし、カタログから「Watson」カテゴリーの「Natural Language Classifier」を選択します。
オプション選択画面が表示されるので「作成」をクリックします。
NLCのインスタンスが生成されたらNLCのアイコンをクリックし、ダッシュボードを表示します。ダッシュボードから「サービス資格情報」タブをクリックし、「新規資格情報の追加」をクリックします。
ダイアログが表示されるので、名前はそのままで「追加」をクリックします。

すると次のようなJSON形式の認証情報が出力されます。

    {
      "credentials": {
        "url": "https://gateway.watsonplatform.net/natural-language-classifier/api",
        "password": "{password}",
        "username": "{username}"
      }
    }

これでNLCの準備が完了しました。
なお、ここで作成した{username}と{password}は以後のAPI呼び出しを行う際の認証情報として利用します。

# 教育
まず、文章の分類を判断する基準となるデータをNLCに教育します。
教育データの記述は非常にシンプルで、`"文章,分類"`のCSVフォーマットで記述します。
教育データは以下のルールに従っている必要があります。
* 教育データのエンコードはUTF-8とする
* 1レコードは1,024文字以下
* 教育データは15,000レコード以下
* \tや\r、\nなどのエスケープ文字は""（ダブルクォーテーション）で囲む
* 教育データは5分類以上

今回はIBM developerWorksの技術情報コンテンツを取得して、各記事のカテゴリーを分類として教育データを作成します。

教育を行うには、作成した教育データをAPIにPOSTします。
POSTする際に指定するオプションと、コマンドは次のとおりです。

|パラメータ名       |必須/任意|内容|
|:---------------:|:------:|:-:|
|training_data    |必須     |教育データのファイルを指定します。|
|training_metadata|任意     |JSON形式で、文章の言語とClassifierの名称を定義します。|

コマンド

    curl -X POST -u "{username}":"{password}" -F training_data=@{file} -F training_metadata="{\"language\":\"ja\",\"name\":\"{Classifier_name}\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"

ファイルのアップロードが完了すると、NLCから新規に作成されたClassifierの情報が表示されます。表示される内容は次のような内容が表示されます。

    {
      "classifier_id" : "{Classifier_id}",
      "name" : "{Classifier_name}",
      "language" : "ja",
      "created" : "2016-06-27T07:20:58.082Z",
      "url" : "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{Classifier_id}",
      "status" : "Training",
      "status_description" : "The classifier instance is in its training phase, not yet ready to accept classify requests"
    }

ここで`classifier_id`と`status`に注目をしてください。`classifier_id`はClassifierを一意に識別するためのidで、今後Classifierを利用する際に都度指定をします。
`status`はClassifierの現在の状態を表しています。この時点では、ファイルのアップロードが完了しましたが、教育は完了していません。
教育に要する時間は、データが多くなるほど長くなり、私が本記事を記述する際に利用した教育データ（217行、約470KB）で30分程かかりました。
Classifierの状態は次のようにすることで確認できます。

コマンド

    curl -u "{username}":"{password}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{Classifier_id}"

レスポンス

    {
      "classifier_id" : "{Classifier_id}",
      "name" : "{Classifier_name}",
      "language" : "ja",
      "created" : "2016-06-27T04:43:08.545Z",
      "url":"https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{Classifier_id}",
      "status" : "Available",
      "status_description" : "The classifier instance is now available and is ready to take classifier requests."
    }

レスポンスの`status`が`Available`になれば教育は完了です。

## 問い合わせの方法
では、これまで教育したデータを元に、与えた文章がいずれの分類に属するかを分類器にかけてみます。

    curl -X POST -u "{username}":"{password}"
    -d "{\"text\":\"Bluemixを利用したアプリケーションの開発\"}"  "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{Classifier_id}/classify"

NLCから次のようなレスポンスが返ってきました。

    {
        "classifier_id" : "{classifier_id}",
        "url" : "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/{classifier_id}",
        "text" : "Bluemixを利用したアプリケーション開発の方法",
        "top_class" : "cloud",
        "classes" : [ {
            "class_name" : "cloud",
            "confidence" : 0.6654509693816474
        }, {
            "class_name" : "bigdata",
            "confidence" : 0.09006333469378373
        }, {
           ～～  中略  ～～
        }, {
            "class_name" : "agile",
            "confidence" : 0.012339620236715464
        }, {
            "class_name" : "security",
            "confidence" : 0.011119026914631118
        } ]
    }

NLCは与えられた文章が属する可能性が高い分類と信頼度をレスポンスとして返します。confidenceの最大値は1となりますので、今回の結果ではcloudに属する可能性が66.5%で最大であることを示しています。

# まとめ
<Font color="red">個人的な感想や、応用方法、展望などを記述する</font>
