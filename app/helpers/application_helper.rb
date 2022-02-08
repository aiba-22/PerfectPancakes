module ApplicationHelper
  def page_title(page_title = '')
    base_title = 'PerfectPancakes'
    page_title.empty? ? base_title : page_title + ' | ' + base_title
  end

  def default_meta_tags
    {
      og: {
        site_name: 'PerfectPancakes',
        title: 'PerfectPancakes|パンケーキ作りをサポート',
        description: 'あなたのパンケーキ作りをサポート、カメラで読み込んだパンケーキの映像から画像解析を行い、ひっくり返すタイミングを教えてくれます。焼き加減調調整やレシピ登録機能も搭載しています。',
        type: 'website',
        url: 'https://www.perfectpancakes.jp',
        image: image_url('ogp.png')
      },
      twitter: {
        card: 'summary_large_image'
      }
    }
  end
end
