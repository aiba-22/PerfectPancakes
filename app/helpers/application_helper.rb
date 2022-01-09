module ApplicationHelper
	def page_title(page_title = '')
		base_title = 'PerfectPancakes'
		page_title.empty? ? base_title :page_title + " | "+base_title
	end
	def default_meta_tags
		{
			og: {
				site_name: :site,
				title: :title,
				description: :description,
				type: 'website',
				url: :canonical,
				image: image_url('ogp.png'),
				},
				twitter: {
				card: 'summary',
				site: '@YuppyHappyToYou',
			}
		}
	end
end
